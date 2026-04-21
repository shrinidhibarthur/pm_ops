import { z } from "zod";

export const ArtifactRequirementSchema = z.object({
  type: z.string(),
  required: z.boolean().default(true),
  minCount: z.number().int().positive().optional(),
  label: z.string().optional(),
});

export const ChecklistRequirementSchema = z.object({
  checklistKey: z.string(),
  required: z.boolean().default(true),
});

export const ApprovalRequirementSchema = z.object({
  approvalMatrixKey: z.string(),
  required: z.boolean().default(true),
});

export const SystemRuleSchema = z.object({
  rule: z.string(),
  required: z.boolean().default(true),
});

export const StageRequirementsSchema = z
  .object({
    artifacts: z.array(ArtifactRequirementSchema).default([]),
    checklists: z.array(ChecklistRequirementSchema).default([]),
    approvals: z.array(ApprovalRequirementSchema).default([]),
    systemRules: z.array(SystemRuleSchema).default([]),
  })
  .default(() => ({ artifacts: [], checklists: [], approvals: [], systemRules: [] }));

export type StageRequirements = z.infer<typeof StageRequirementsSchema>;

export const WorkflowStageOverrideSchema = z.object({
  key: z.string(),
  ordinal: z.number().int().positive(),
  // Optional policy-style gates (config-driven). Example: require certain stages COMPLETE before entering.
  gates: z
    .object({
      requireStagesComplete: z.array(z.string()).optional(),
    })
    .optional(),
});

export const WorkflowStagesConfigSchema = z.array(WorkflowStageOverrideSchema);
export type WorkflowStagesConfig = z.infer<typeof WorkflowStagesConfigSchema>;

export type GateCheck = {
  key: string;
  label: string;
  status: "PASS" | "FAIL";
  details?: string;
};

export type StageGateEvaluation = {
  stageKey: string;
  checks: GateCheck[];
  canAdvance: boolean;
};

