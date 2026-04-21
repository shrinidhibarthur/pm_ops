import { Prisma, PrismaClient, RoleKey } from "@prisma/client";

const prisma = new PrismaClient();

type StageSeed = {
  key: string;
  name: string;
  description?: string;
  requirements: Prisma.InputJsonValue;
};

const STAGES: StageSeed[] = [
  {
    key: "IDEA_INTAKE",
    name: "Idea Intake",
    requirements: {
      artifacts: [{ type: "LINK", required: false }],
      checklists: [{ checklistKey: "IDEA_INTAKE_BASE", required: true }],
      approvals: [],
    },
  },
  {
    key: "CONCEPT_PITCH_APPROVAL",
    name: "Concept / Pitch Approval",
    requirements: {
      artifacts: [{ type: "DOCUMENT", required: true, label: "Pitch deck / concept doc" }],
      checklists: [{ checklistKey: "CONCEPT_PITCH_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "PITCH_APPROVAL", required: true }],
    },
  },
  {
    key: "UX_CREATION",
    name: "UX Creation",
    requirements: {
      artifacts: [{ type: "UX", required: true, label: "UX flows / prototypes" }],
      checklists: [{ checklistKey: "UX_BASE", required: true }],
      approvals: [],
    },
  },
  {
    key: "DESIGN_LEADERSHIP_REVIEW",
    name: "Design Leadership Review",
    requirements: {
      artifacts: [{ type: "DESIGN", required: true, label: "Design spec" }],
      checklists: [{ checklistKey: "DESIGN_REVIEW_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "DESIGN_LEAD_REVIEW", required: true }],
    },
  },
  {
    key: "ADA_APPROVAL",
    name: "ADA Approval",
    requirements: {
      artifacts: [{ type: "ADA", required: true, label: "ADA review notes" }],
      checklists: [{ checklistKey: "ADA_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "ADA_REVIEW", required: true }],
    },
  },
  {
    key: "PRD_CREATION",
    name: "PRD Creation",
    requirements: {
      artifacts: [{ type: "PRD", required: true, label: "PRD document" }],
      checklists: [{ checklistKey: "PRD_BASE", required: true }],
      approvals: [],
    },
  },
  {
    key: "PRD_APPROVAL",
    name: "PRD Approval",
    requirements: {
      artifacts: [{ type: "PRD", required: true }],
      checklists: [{ checklistKey: "PRD_APPROVAL_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "PRD_APPROVAL", required: true }],
    },
  },
  {
    key: "CROSS_FUNCTIONAL_REVIEW",
    name: "Cross-Functional Review",
    requirements: {
      artifacts: [],
      checklists: [{ checklistKey: "XFN_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "XFN_REVIEW", required: true }],
    },
  },
  {
    key: "ART_FINANCE_MPO_APPROVAL",
    name: "ART / Finance / MPO Approval",
    requirements: {
      artifacts: [{ type: "FINANCE", required: true, label: "Funding / ART assessment" }],
      checklists: [{ checklistKey: "ART_FIN_MPO_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "ART_FIN_MPO", required: true }],
    },
  },
  {
    key: "DEPENDENT_TEAM_PLANNING",
    name: "Dependent Team Planning",
    requirements: {
      artifacts: [],
      checklists: [{ checklistKey: "DEPENDENCIES_BASE", required: true }],
      approvals: [],
    },
  },
  {
    key: "JIRA_CREATION",
    name: "Jira Creation",
    description: "Jira creation is gated by required approval stages; exact rules are configurable in workflow config.",
    requirements: {
      artifacts: [],
      checklists: [{ checklistKey: "JIRA_CREATE_BASE", required: true }],
      approvals: [],
      systemRules: [{ rule: "REQUIRES_APPROVALS_BEFORE_JIRA", required: true }],
    },
  },
  {
    key: "KICKOFF_ALIGNMENT",
    name: "Kickoff & Alignment",
    requirements: { artifacts: [], checklists: [{ checklistKey: "KICKOFF_BASE", required: true }], approvals: [] },
  },
  {
    key: "TECH_GROOMING",
    name: "Tech Grooming",
    requirements: {
      artifacts: [],
      checklists: [{ checklistKey: "TECH_GROOMING_BASE", required: true }],
      approvals: [],
      systemRules: [{ rule: "REQUIRES_ART_FIN_MPO_BEFORE_GROOMING", required: true }],
    },
  },
  {
    key: "DEVELOPMENT_TRACKING",
    name: "Development Tracking",
    requirements: { artifacts: [], checklists: [{ checklistKey: "DEV_TRACKING_BASE", required: true }], approvals: [] },
  },
  {
    key: "FINAL_DEMO_UAT",
    name: "Final Demo / UAT",
    requirements: { artifacts: [], checklists: [{ checklistKey: "UAT_BASE", required: true }], approvals: [] },
  },
  {
    key: "LAUNCH_APPROVAL",
    name: "Launch Approval",
    requirements: {
      artifacts: [],
      checklists: [{ checklistKey: "LAUNCH_APPROVAL_BASE", required: true }],
      approvals: [{ approvalMatrixKey: "LAUNCH_APPROVAL", required: true }],
    },
  },
  {
    key: "PRODUCTION_ROLLOUT",
    name: "Production Rollout",
    requirements: { artifacts: [], checklists: [{ checklistKey: "ROLLOUT_BASE", required: true }], approvals: [] },
  },
  {
    key: "IMPACT_TRACKING",
    name: "Impact Tracking",
    requirements: { artifacts: [], checklists: [{ checklistKey: "IMPACT_BASE", required: true }], approvals: [] },
  },
];

const CHECKLISTS: Array<{ key: string; name: string; items: Array<{ key: string; label: string; required: boolean }> }> =
  [
    {
      key: "IDEA_INTAKE_BASE",
      name: "Idea Intake – Base",
      items: [
        { key: "problem_statement", label: "Problem statement captured", required: true },
        { key: "target_customer", label: "Target customer / segment defined", required: true },
        { key: "success_metric", label: "Initial success metric hypothesis", required: true },
      ],
    },
    {
      key: "CONCEPT_PITCH_BASE",
      name: "Concept / Pitch – Base",
      items: [
        { key: "value_prop", label: "Value proposition defined", required: true },
        { key: "scope_bounds", label: "Scope boundaries agreed", required: true },
        { key: "risks", label: "Key risks identified", required: true },
      ],
    },
    { key: "UX_BASE", name: "UX – Base", items: [{ key: "flows", label: "UX flows drafted", required: true }] },
    {
      key: "DESIGN_REVIEW_BASE",
      name: "Design Review – Base",
      items: [{ key: "design_ready", label: "Design spec ready for leadership review", required: true }],
    },
    { key: "ADA_BASE", name: "ADA – Base", items: [{ key: "a11y", label: "Accessibility review completed", required: true }] },
    { key: "PRD_BASE", name: "PRD – Base", items: [{ key: "prd_draft", label: "PRD drafted", required: true }] },
    {
      key: "PRD_APPROVAL_BASE",
      name: "PRD Approval – Base",
      items: [{ key: "prd_reviewed", label: "PRD reviewed by required stakeholders", required: true }],
    },
    { key: "XFN_BASE", name: "XFN Review – Base", items: [{ key: "xfn", label: "XFN reviewers engaged", required: true }] },
    {
      key: "ART_FIN_MPO_BASE",
      name: "ART/Finance/MPO – Base",
      items: [{ key: "funding", label: "Funding / prioritization decision recorded", required: true }],
    },
    {
      key: "DEPENDENCIES_BASE",
      name: "Dependent Team Planning – Base",
      items: [{ key: "deps", label: "Dependent teams identified and planned", required: true }],
    },
    { key: "JIRA_CREATE_BASE", name: "Jira Creation – Base", items: [{ key: "jira", label: "Epic & stories created/linked", required: true }] },
    { key: "KICKOFF_BASE", name: "Kickoff – Base", items: [{ key: "kickoff", label: "Kickoff completed", required: true }] },
    { key: "TECH_GROOMING_BASE", name: "Tech Grooming – Base", items: [{ key: "groomed", label: "Tech grooming completed", required: true }] },
    { key: "DEV_TRACKING_BASE", name: "Development – Base", items: [{ key: "tracking", label: "Execution tracking enabled", required: true }] },
    { key: "UAT_BASE", name: "UAT – Base", items: [{ key: "uat", label: "UAT / demo completed", required: true }] },
    { key: "LAUNCH_APPROVAL_BASE", name: "Launch Approval – Base", items: [{ key: "go_no_go", label: "Go/No-Go decision captured", required: true }] },
    { key: "ROLLOUT_BASE", name: "Rollout – Base", items: [{ key: "rolled_out", label: "Production rollout completed", required: true }] },
    { key: "IMPACT_BASE", name: "Impact – Base", items: [{ key: "impact", label: "Impact metrics captured", required: true }] },
  ];

async function main() {
  // Roles
  const roleSeeds: Array<{ key: RoleKey; name: string }> = [
    { key: "PRODUCT_MANAGER", name: "Product Manager" },
    { key: "SENIOR_PM", name: "Senior PM / Group PM" },
    { key: "ENGINEERING_ARCHITECT", name: "Engineering Architect" },
    { key: "DESIGN_LEAD", name: "Design Lead" },
    { key: "DIRECTOR", name: "Director / Senior Director" },
    { key: "FINANCE_ART_APPROVER", name: "Finance / ART approver" },
    { key: "ADA_REVIEWER", name: "ADA reviewer" },
    { key: "PROJECT_MANAGER", name: "Project Manager" },
    { key: "ADMIN", name: "Admin" },
  ];

  for (const r of roleSeeds) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name },
      create: { key: r.key, name: r.name },
    });
  }

  // Team
  const team = await prisma.team.upsert({
    where: { key: "DIGITAL_COMMERCE" },
    update: { name: "Digital Commerce" },
    create: { key: "DIGITAL_COMMERCE", name: "Digital Commerce" },
  });

  // Users (dev-friendly)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "pm@example.com" },
      update: { name: "Pat PM", title: "Product Manager" },
      create: { email: "pm@example.com", name: "Pat PM", title: "Product Manager" },
    }),
    prisma.user.upsert({
      where: { email: "director@example.com" },
      update: { name: "Dana Director", title: "Director" },
      create: { email: "director@example.com", name: "Dana Director", title: "Director" },
    }),
    prisma.user.upsert({
      where: { email: "finance@example.com" },
      update: { name: "Frank Finance", title: "Finance" },
      create: { email: "finance@example.com", name: "Frank Finance", title: "Finance" },
    }),
    prisma.user.upsert({
      where: { email: "ada@example.com" },
      update: { name: "Avery ADA", title: "ADA Reviewer" },
      create: { email: "ada@example.com", name: "Avery ADA", title: "ADA Reviewer" },
    }),
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: { name: "Alex Admin", title: "Admin" },
      create: { email: "admin@example.com", name: "Alex Admin", title: "Admin" },
    }),
  ]);

  const byEmail = new Map(users.map((u) => [u.email, u]));
  const pm = byEmail.get("pm@example.com")!;
  const director = byEmail.get("director@example.com")!;
  const finance = byEmail.get("finance@example.com")!;
  const ada = byEmail.get("ada@example.com")!;
  const admin = byEmail.get("admin@example.com")!;

  await prisma.userTeam.upsert({
    where: { userId_teamId: { userId: pm.id, teamId: team.id } },
    update: { isPrimary: true },
    create: { userId: pm.id, teamId: team.id, isPrimary: true },
  });

  // Assign roles
  async function grant(email: string, roleKey: RoleKey) {
    const user = byEmail.get(email)!;
    const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
  }

  await grant(pm.email, "PRODUCT_MANAGER");
  await grant(director.email, "DIRECTOR");
  await grant(finance.email, "FINANCE_ART_APPROVER");
  await grant(ada.email, "ADA_REVIEWER");
  await grant(admin.email, "ADMIN");

  // Approval matrices (rules are fully configurable)
  await prisma.approvalMatrix.upsert({
    where: { key: "PITCH_APPROVAL" },
    update: { name: "Pitch Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
    create: { key: "PITCH_APPROVAL", name: "Pitch Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "DESIGN_LEAD_REVIEW" },
    update: { name: "Design Leadership Review", rules: { quorum: 1, roles: ["DESIGN_LEAD"] } },
    create: { key: "DESIGN_LEAD_REVIEW", name: "Design Leadership Review", rules: { quorum: 1, roles: ["DESIGN_LEAD"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "ADA_REVIEW" },
    update: { name: "ADA Review", rules: { quorum: 1, roles: ["ADA_REVIEWER"] } },
    create: { key: "ADA_REVIEW", name: "ADA Review", rules: { quorum: 1, roles: ["ADA_REVIEWER"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "PRD_APPROVAL" },
    update: { name: "PRD Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
    create: { key: "PRD_APPROVAL", name: "PRD Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "XFN_REVIEW" },
    update: { name: "XFN Review", rules: { quorum: 1, roles: ["ENGINEERING_ARCHITECT", "PROJECT_MANAGER"] } },
    create: { key: "XFN_REVIEW", name: "XFN Review", rules: { quorum: 1, roles: ["ENGINEERING_ARCHITECT", "PROJECT_MANAGER"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "ART_FIN_MPO" },
    update: { name: "ART/Finance/MPO Approval", rules: { quorum: 1, roles: ["FINANCE_ART_APPROVER"] } },
    create: { key: "ART_FIN_MPO", name: "ART/Finance/MPO Approval", rules: { quorum: 1, roles: ["FINANCE_ART_APPROVER"] } },
  });
  await prisma.approvalMatrix.upsert({
    where: { key: "LAUNCH_APPROVAL" },
    update: { name: "Launch Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
    create: { key: "LAUNCH_APPROVAL", name: "Launch Approval", rules: { quorum: 1, roles: ["DIRECTOR"] } },
  });

  // Checklist templates
  for (const c of CHECKLISTS) {
    await prisma.checklistTemplate.upsert({
      where: { key: c.key },
      update: { name: c.name, items: c.items },
      create: { key: c.key, name: c.name, items: c.items },
    });
  }

  // Stage templates
  for (const s of STAGES) {
    await prisma.stageTemplate.upsert({
      where: { key: s.key },
      update: { name: s.name, description: s.description, requirements: s.requirements },
      create: { key: s.key, name: s.name, description: s.description, requirements: s.requirements },
    });
  }

  // Workflow config (team-specific override point)
  const stages = STAGES.map((s, idx) => {
    const base = { key: s.key, ordinal: idx + 1 } as any;
    if (s.key === "JIRA_CREATION") {
      base.gates = { requireStagesComplete: ["ART_FINANCE_MPO_APPROVAL", "PRD_APPROVAL"] };
    }
    if (s.key === "TECH_GROOMING") {
      base.gates = { requireStagesComplete: ["ART_FINANCE_MPO_APPROVAL"] };
    }
    return base;
  });
  const wf = await prisma.workflowConfig.upsert({
    where: { key: "DEFAULT_DIGITAL_COMMERCE_V1" },
    update: { name: "Default Digital Commerce v1", status: "ACTIVE", teamId: team.id, stages },
    create: { key: "DEFAULT_DIGITAL_COMMERCE_V1", name: "Default Digital Commerce v1", status: "ACTIVE", teamId: team.id, stages },
  });

  // Sample initiative
  const initiative = await prisma.initiative.upsert({
    where: { key: "INIT-0001" },
    update: { title: "Frictionless Reorder Experience", teamId: team.id, ownerId: pm.id, workflowConfigId: wf.id },
    create: {
      key: "INIT-0001",
      title: "Frictionless Reorder Experience",
      summary: "Reduce reorder friction and increase repeat purchase rate.",
      teamId: team.id,
      ownerId: pm.id,
      workflowConfigId: wf.id,
      currentStageKey: stages[0]!.key,
      currentStageOrdinal: 1,
    },
  });

  // Stage state rows
  for (const st of stages) {
    await prisma.initiativeStageState.upsert({
      where: { initiativeId_stageKey: { initiativeId: initiative.id, stageKey: st.key } },
      update: { ordinal: st.ordinal, status: st.ordinal === 1 ? "IN_PROGRESS" : "NOT_STARTED" },
      create: {
        initiativeId: initiative.id,
        stageKey: st.key,
        ordinal: st.ordinal,
        status: st.ordinal === 1 ? "IN_PROGRESS" : "NOT_STARTED",
        startedAt: st.ordinal === 1 ? new Date() : null,
      },
    });
  }

  // Seed a couple pending approvals at the right stage (configurable, but demonstrates inbox)
  await prisma.approvalTask.createMany({
    data: [
      {
        initiativeId: initiative.id,
        stageKey: "CONCEPT_PITCH_APPROVAL",
        title: "Approve Concept / Pitch",
        requestedByUserId: pm.id,
        assignedRoleKey: "DIRECTOR",
      },
      {
        initiativeId: initiative.id,
        stageKey: "ART_FINANCE_MPO_APPROVAL",
        title: "ART / Finance / MPO Approval",
        requestedByUserId: pm.id,
        assignedRoleKey: "FINANCE_ART_APPROVER",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.initiativeComment.create({
    data: {
      initiativeId: initiative.id,
      authorUserId: pm.id,
      body: "Seeded initiative created. Next steps: complete Idea Intake checklist and submit Concept/Pitch for approval.",
    },
  });

  // Audit marker
  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: "SEED",
      entityType: "system",
      entityId: "seed",
      after: { message: "Seed completed" },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

