import { prisma } from "@/server/db/prisma";
import { StageRequirementsSchema, WorkflowStagesConfigSchema, type StageGateEvaluation } from "@/server/workflow/types";
import { emitDomainEvent } from "@/server/notifications/service";

type InitiativeSnapshot = Awaited<ReturnType<typeof loadInitiativeSnapshot>>;

async function loadInitiativeSnapshot(initiativeId: string) {
  const initiative = await prisma.initiative.findUnique({
    where: { id: initiativeId },
    include: {
      workflowConfig: true,
      stageStates: true,
      artifacts: true,
      approvals: true,
      checklistCompletions: true,
    },
  });
  return initiative;
}

function indexByStageStatus(stageStates: { stageKey: string; status: string }[]) {
  const m = new Map<string, string>();
  for (const s of stageStates) m.set(s.stageKey, s.status);
  return m;
}

export async function evaluateCurrentStageGates(initiativeId: string): Promise<StageGateEvaluation> {
  const snap = await loadInitiativeSnapshot(initiativeId);
  if (!snap) throw new Error("NOT_FOUND");

  const workflowStages = WorkflowStagesConfigSchema.parse(snap.workflowConfig.stages);
  const stageKey = snap.currentStageKey;

  const stageTemplate = await prisma.stageTemplate.findUnique({ where: { key: stageKey } });
  const req = StageRequirementsSchema.parse(stageTemplate?.requirements ?? {});

  const currentStageCfg = workflowStages.find((s) => s.key === stageKey);
  const stageStatus = indexByStageStatus(snap.stageStates);

  const checks: StageGateEvaluation["checks"] = [];

  // Checklist requirements
  for (const c of req.checklists.filter((x) => x.required)) {
    const template = await prisma.checklistTemplate.findUnique({ where: { key: c.checklistKey } });
    const items = Array.isArray((template?.items as any) ?? []) ? ((template?.items as any) as Array<any>) : [];
    const requiredKeys = items.filter((i) => i?.required).map((i) => String(i.key));
    const completed = snap.checklistCompletions
      .filter((cc) => cc.stageKey === stageKey && cc.checklistKey === c.checklistKey)
      .map((cc) => cc.itemKey);
    const missing = requiredKeys.filter((k) => !completed.includes(k));
    checks.push({
      key: `checklist:${c.checklistKey}`,
      label: `Checklist: ${template?.name ?? c.checklistKey}`,
      status: missing.length === 0 ? "PASS" : "FAIL",
      details: missing.length ? `Missing items: ${missing.join(", ")}` : undefined,
    });
  }

  // Artifact requirements
  for (const a of req.artifacts.filter((x) => x.required)) {
    const min = a.minCount ?? 1;
    const count = snap.artifacts.filter((ar) => (ar.stageKey ?? stageKey) === stageKey && ar.type === (a.type as any)).length;
    checks.push({
      key: `artifact:${a.type}`,
      label: a.label ? `Artifact: ${a.label}` : `Artifact: ${a.type}`,
      status: count >= min ? "PASS" : "FAIL",
      details: count >= min ? undefined : `Need ${min}, have ${count}`,
    });
  }

  // Approval requirements: satisfied when all required approval tasks for stage are APPROVED.
  for (const ar of req.approvals.filter((x) => x.required)) {
    const tasks = snap.approvals.filter((t) => t.stageKey === stageKey && t.status !== "CANCELLED");
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const rejected = tasks.filter((t) => t.status === "REJECTED").length;
    const approved = tasks.filter((t) => t.status === "APPROVED").length;
    const pass = rejected === 0 && pending === 0 && approved > 0;
    checks.push({
      key: `approval:${ar.approvalMatrixKey}`,
      label: `Approvals: ${ar.approvalMatrixKey}`,
      status: pass ? "PASS" : "FAIL",
      details: pass ? undefined : `Approved=${approved}, Pending=${pending}, Rejected=${rejected}`,
    });
  }

  // Policy gates defined per workflow stage override.
  const requiredStagesComplete = currentStageCfg?.gates?.requireStagesComplete ?? [];
  if (requiredStagesComplete.length) {
    const missing = requiredStagesComplete.filter((k) => stageStatus.get(k) !== "COMPLETE");
    checks.push({
      key: "policy:priorStagesComplete",
      label: "Policy: prerequisite stages complete",
      status: missing.length === 0 ? "PASS" : "FAIL",
      details: missing.length ? `Incomplete: ${missing.join(", ")}` : undefined,
    });
  }

  const canAdvance = checks.every((c) => c.status === "PASS");
  return { stageKey, checks, canAdvance };
}

export async function advanceStage(initiativeId: string, actorUserId: string) {
  const snap = await prisma.initiative.findUnique({
    where: { id: initiativeId },
    include: { workflowConfig: true, stageStates: { orderBy: { ordinal: "asc" } } },
  });
  if (!snap) throw new Error("NOT_FOUND");

  const evaluation = await evaluateCurrentStageGates(initiativeId);
  if (!evaluation.canAdvance) {
    const err: any = new Error("STAGE_BLOCKED");
    err.details = evaluation;
    throw err;
  }

  const stages = WorkflowStagesConfigSchema.parse(snap.workflowConfig.stages).sort((a, b) => a.ordinal - b.ordinal);
  const currentIdx = stages.findIndex((s) => s.key === snap.currentStageKey);
  const next = stages[currentIdx + 1];
  if (!next) return { advanced: false, message: "Already at final stage." };

  // Transactionally update stage states and initiative pointer.
  await prisma.$transaction(async (tx) => {
    const now = new Date();
    await tx.initiativeStageState.update({
      where: { initiativeId_stageKey: { initiativeId: snap.id, stageKey: snap.currentStageKey } },
      data: { status: "COMPLETE", completedAt: now },
    });
    await tx.initiativeStageState.update({
      where: { initiativeId_stageKey: { initiativeId: snap.id, stageKey: next.key } },
      data: { status: "IN_PROGRESS", startedAt: now },
    });
    await tx.initiative.update({
      where: { id: snap.id },
      data: { currentStageKey: next.key, currentStageOrdinal: next.ordinal },
    });
    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "STAGE_ADVANCE",
        entityType: "initiative",
        entityId: snap.id,
        before: { stageKey: snap.currentStageKey, ordinal: snap.currentStageOrdinal },
        after: { stageKey: next.key, ordinal: next.ordinal },
      },
    });
  });

  await emitDomainEvent({
    event: "STAGE_ADVANCED",
    initiativeId,
    actorUserId,
    payload: { fromStageKey: snap.currentStageKey, toStageKey: next.key },
  });

  return { advanced: true, nextStageKey: next.key };
}

export async function getInitiativeGateSummary(initiativeId: string) {
  return evaluateCurrentStageGates(initiativeId);
}

