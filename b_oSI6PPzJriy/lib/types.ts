export type WorkstreamType = 
  | "Platform"
  | "Growth"
  | "Enterprise"
  | "Mobile"
  | "Infrastructure"
  | "Data & Analytics";

export type StageType = 
  | "Discovery"
  | "Definition"
  | "Design"
  | "Development"
  | "Testing"
  | "Release"
  | "Post-Release";

export type StatusType = 
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "In Progress"
  | "Blocked"
  | "On Hold"
  | "Completed"
  | "Cancelled";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type QuarterType = "Q1" | "Q2" | "Q3" | "Q4";

export interface Owner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  workstream: WorkstreamType;
  stage: StageType;
  status: StatusType;
  owner: Owner;
  quarter: QuarterType;
  year: number;
  risk: RiskLevel;
  priority: number;
  createdAt: string;
  updatedAt: string;
  targetDate: string;
  problemStatement?: string;
  goals?: string[];
  kpis?: KPI[];
  dependencies?: Dependency[];
  risks?: RiskItem[];
  attachments?: Attachment[];
  approvals?: Approval[];
  jiraKey?: string;
  impactScore?: number;
  effortScore?: number;
}

export interface KPI {
  id: string;
  name: string;
  baseline: string;
  target: string;
  current?: string;
  unit: string;
}

export interface Dependency {
  id: string;
  initiativeId?: string;
  title: string;
  type: "Internal" | "External";
  status: "Resolved" | "Pending" | "Blocked";
}

export interface RiskItem {
  id: string;
  description: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  mitigation?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: Owner;
}

export interface Approval {
  id: string;
  type: string;
  approver: Owner;
  status: "Pending" | "Approved" | "Rejected" | "Sent Back";
  comments?: string;
  checklist?: ChecklistItem[];
  reviewedAt?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  initiativeId: string;
  type: "comment" | "status_change" | "approval" | "update" | "attachment";
  description: string;
  user: Owner;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  color: string;
  requiredApprovals: string[];
}

export interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  recipients: string[];
  enabled: boolean;
}

export interface ApprovalMatrix {
  id: string;
  stage: StageType;
  approverRoles: string[];
  requiredCount: number;
}

export interface JiraMapping {
  id: string;
  initiativeField: string;
  jiraField: string;
  syncDirection: "push" | "pull" | "both";
}
