import { prisma } from "@/server/db/prisma";
import { StubJiraProvider } from "@/server/integrations/jira/provider";
import { WorkflowStagesConfigSchema } from "@/server/workflow/types";
import { badRequest, notFound } from "@/server/http/errors";

export async function jiraEligibility(initiativeId: string) {
  const initiative = await prisma.initiative.findUnique({
    where: { id: initiativeId },
    include: { stageStates: true, workflowConfig: { include: { jiraMapping: true } } },
  });
  if (!initiative) throw notFound();

  const stages = WorkflowStagesConfigSchema.parse(initiative.workflowConfig.stages);
  const jiraStage = stages.find((s) => s.key === "JIRA_CREATION");
  const required = jiraStage?.gates?.requireStagesComplete ?? [];
  const statusByKey = new Map(initiative.stageStates.map((s) => [s.stageKey, s.status]));
  const missing = required.filter((k) => statusByKey.get(k) !== "COMPLETE");

  const hasMapping = Boolean(initiative.workflowConfig.jiraMapping?.projectKey || undefined);
  return {
    canManageJira: missing.length === 0 && hasMapping,
    missingPrerequisites: missing,
    hasMapping,
    projectKey: initiative.workflowConfig.jiraMapping?.projectKey ?? null,
  };
}

export async function createEpicForInitiative(initiativeId: string, actorUserId: string) {
  const initiative = await prisma.initiative.findUnique({
    where: { id: initiativeId },
    include: { workflowConfig: { include: { jiraMapping: true } }, jiraLinks: true },
  });
  if (!initiative) throw notFound();

  const eligibility = await jiraEligibility(initiativeId);
  if (!eligibility.canManageJira) {
    throw badRequest("Jira actions are blocked by workflow prerequisites or missing mapping.", eligibility);
  }
  if (!eligibility.projectKey) throw badRequest("Missing Jira project mapping.");

  // Prevent duplicate epic creation if one already exists.
  const existingEpic = initiative.jiraLinks.find((l) => l.issueType === "EPIC");
  if (existingEpic) {
    return { already: true, issueKey: existingEpic.issueKey, url: existingEpic.url };
  }

  const provider = new StubJiraProvider();
  const epic = await provider.createEpic({
    projectKey: eligibility.projectKey,
    summary: `${initiative.key} — ${initiative.title}`,
    description: initiative.summary ?? undefined,
  });

  const link = await prisma.jiraIssueLink.create({
    data: {
      initiativeId,
      issueKey: epic.issueKey,
      issueType: "EPIC",
      url: epic.url,
      status: epic.status ?? null,
      syncedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId,
      action: "JIRA_CREATE_EPIC",
      entityType: "initiative",
      entityId: initiativeId,
      after: { issueKey: epic.issueKey, url: epic.url },
    },
  });

  return { id: link.id, issueKey: link.issueKey, url: link.url };
}

export async function linkEpicToInitiative(
  initiativeId: string,
  actorUserId: string,
  input: { issueKey: string; url: string; status?: string },
) {
  const eligibility = await jiraEligibility(initiativeId);
  if (!eligibility.canManageJira) {
    throw badRequest("Jira actions are blocked by workflow prerequisites or missing mapping.", eligibility);
  }

  const link = await prisma.jiraIssueLink.upsert({
    where: { initiativeId_issueKey: { initiativeId, issueKey: input.issueKey } },
    update: { url: input.url, status: input.status ?? null, syncedAt: new Date() },
    create: {
      initiativeId,
      issueKey: input.issueKey,
      issueType: "EPIC",
      url: input.url,
      status: input.status ?? null,
      syncedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId,
      action: "JIRA_LINK_EPIC",
      entityType: "initiative",
      entityId: initiativeId,
      after: { issueKey: input.issueKey, url: input.url },
    },
  });

  return { id: link.id, issueKey: link.issueKey, url: link.url };
}

