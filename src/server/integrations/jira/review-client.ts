/** Jira REST API v3 + Agile API client for WBR/MBR/QBR data fetching */

interface JiraConfig {
  baseUrl: string;
  auth: string; // Base64 "email:token"
}

function getConfig(): JiraConfig {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const baseUrl = process.env.JIRA_BASE_URL;
  if (!email || !token || !baseUrl) {
    throw new Error(
      "Jira credentials not configured. Set JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_BASE_URL."
    );
  }
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    auth: Buffer.from(`${email}:${token}`).toString("base64"),
  };
}

async function jiraGet<T>(path: string, agile = false): Promise<T> {
  const { baseUrl, auth } = getConfig();
  const base = agile ? `${baseUrl}/rest/agile/1.0` : `${baseUrl}/rest/api/3`;
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Jira ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

// ---------- Types (subset of Jira API shapes) ----------

interface JiraBoard {
  id: number;
  name: string;
  type: string;
}

interface JiraSprint {
  id: number;
  name: string;
  state: "active" | "closed" | "future";
  startDate?: string;
  endDate?: string;
}

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { statusCategory: { key: string } };
    issuetype: { name: string };
    priority?: { name: string };
    story_points?: number;
    customfield_10016?: number; // story points (common custom field)
  };
}

interface JiraSearchResult {
  total: number;
  issues: JiraIssue[];
}

// ---------- Helpers ----------

function statusCategory(issue: JiraIssue): "toDo" | "inProgress" | "done" {
  const cat = issue.fields.status.statusCategory.key;
  if (cat === "done") return "done";
  if (cat === "indeterminate") return "inProgress";
  return "toDo";
}

function issuePoints(issue: JiraIssue): number {
  return issue.fields.customfield_10016 ?? 0;
}

// ---------- Public API ----------

export interface SprintData {
  id: number;
  name: string;
  state: "active" | "closed" | "future";
  startDate?: string;
  endDate?: string;
  completedIssues: number;
  totalIssues: number;
  completionPct: number;
  storyPointsDone: number;
}

export interface JiraProjectReviewData {
  projectKey: string;
  activeSprint?: SprintData;
  recentSprints: SprintData[];
  issueCounts: {
    bug: number;
    story: number;
    task: number;
    total: number;
    inProgress: number;
    done: number;
    toDo: number;
  };
  blockers: Array<{ key: string; summary: string; priority: string }>;
  velocity: number;
}

async function getBoardId(projectKey: string): Promise<number | null> {
  type BoardsResp = { values: JiraBoard[] };
  const resp = await jiraGet<BoardsResp>(
    `/board?projectKeyOrId=${encodeURIComponent(projectKey)}&type=scrum`,
    true
  );
  return resp.values[0]?.id ?? null;
}

async function getSprintData(boardId: number, sprintId: number): Promise<SprintData & { issues: JiraIssue[] }> {
  type IssuesResp = { issues: JiraIssue[]; total: number };
  const resp = await jiraGet<IssuesResp>(
    `/board/${boardId}/sprint/${sprintId}/issue?maxResults=200&fields=summary,status,issuetype,priority,customfield_10016`,
    true
  );

  const done = resp.issues.filter((i) => statusCategory(i) === "done").length;
  const points = resp.issues
    .filter((i) => statusCategory(i) === "done")
    .reduce((sum, i) => sum + issuePoints(i), 0);

  return {
    id: sprintId,
    name: "",
    state: "closed",
    completedIssues: done,
    totalIssues: resp.total,
    completionPct: resp.total > 0 ? Math.round((done / resp.total) * 100) : 0,
    storyPointsDone: points,
    issues: resp.issues,
  };
}

export async function fetchProjectReviewData(projectKey: string): Promise<JiraProjectReviewData> {
  const boardId = await getBoardId(projectKey);

  // Default issue count structure (returned even if board not found)
  const emptyIssue = { bug: 0, story: 0, task: 0, total: 0, inProgress: 0, done: 0, toDo: 0 };

  // Fetch open issue counts via search regardless of board presence
  const [bugsResp, blockersResp, allOpenResp] = await Promise.all([
    jiraGet<JiraSearchResult>(
      `/search?jql=${encodeURIComponent(`project="${projectKey}" AND issuetype=Bug AND resolution=Unresolved`)}&maxResults=0`
    ),
    jiraGet<JiraSearchResult>(
      `/search?jql=${encodeURIComponent(`project="${projectKey}" AND priority in (Highest,Blocker) AND resolution=Unresolved`)}&maxResults=10&fields=summary,priority`
    ),
    jiraGet<JiraSearchResult>(
      `/search?jql=${encodeURIComponent(`project="${projectKey}" AND resolution=Unresolved`)}&maxResults=200&fields=issuetype,status`
    ),
  ]);

  const issueCounts = { ...emptyIssue };
  for (const issue of allOpenResp.issues) {
    const type = issue.fields.issuetype.name.toLowerCase();
    issueCounts.total++;
    if (type === "bug") issueCounts.bug++;
    else if (type === "story") issueCounts.story++;
    else if (type === "task") issueCounts.task++;
    const cat = statusCategory(issue);
    issueCounts[cat]++;
  }
  // Bug count from the targeted query (more accurate with pagination)
  issueCounts.bug = bugsResp.total;

  const blockers = blockersResp.issues.map((i) => ({
    key: i.key,
    summary: i.fields.summary,
    priority: i.fields.priority?.name ?? "Unknown",
  }));

  if (!boardId) {
    return { projectKey, recentSprints: [], issueCounts, blockers, velocity: 0 };
  }

  // Fetch recent sprints
  type SprintsResp = { values: JiraSprint[] };
  const sprintsResp = await jiraGet<SprintsResp>(
    `/board/${boardId}/sprint?state=active,closed&maxResults=5`,
    true
  );

  const sprintMetas = sprintsResp.values.slice(0, 5);
  const sprintDetails = await Promise.all(
    sprintMetas.map(async (s) => {
      const detail = await getSprintData(boardId, s.id);
      return { ...detail, id: s.id, name: s.name, state: s.state, startDate: s.startDate, endDate: s.endDate };
    })
  );

  const closedSprints = sprintDetails.filter((s) => s.state === "closed");
  const velocity =
    closedSprints.length > 0
      ? Math.round(
          closedSprints.slice(0, 3).reduce((sum, s) => sum + s.storyPointsDone, 0) /
            Math.min(3, closedSprints.length)
        )
      : 0;

  const activeSprint = sprintDetails.find((s) => s.state === "active");

  const recentSprints: SprintData[] = sprintDetails.map(({ issues: _issues, ...rest }) => rest);

  return { projectKey, activeSprint, recentSprints, issueCounts, blockers, velocity };
}
