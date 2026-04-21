import { JiraIssueType } from "@prisma/client";

export type JiraCreateEpicInput = {
  projectKey: string;
  summary: string;
  description?: string;
};

export type JiraIssueRef = {
  issueKey: string;
  url: string;
  issueType: JiraIssueType;
  status?: string;
};

export interface JiraProvider {
  createEpic(input: JiraCreateEpicInput): Promise<JiraIssueRef>;
}

/**
 * Stub provider for local/dev until Jira credentials are configured.
 * Replaces real Jira Cloud REST calls with deterministic fake keys/URLs.
 */
export class StubJiraProvider implements JiraProvider {
  async createEpic(input: JiraCreateEpicInput): Promise<JiraIssueRef> {
    const key = `${input.projectKey}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      issueKey: key,
      issueType: "EPIC",
      url: `https://jira.example.local/browse/${key}`,
      status: "To Do",
    };
  }
}

