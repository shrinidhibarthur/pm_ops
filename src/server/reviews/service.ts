import { prisma } from "@/server/db/prisma";
import { fetchAnalyticsData } from "@/server/integrations/adobe/metrics";
import { fetchProjectReviewData } from "@/server/integrations/jira/review-client";
import { generateNarrative } from "./claude";
import type { JiraReviewData, AnalyticsReviewData, ReviewAction } from "./types";

export interface CreateReviewInput {
  type: "WBR" | "MBR" | "QBR";
  dateStart: Date;
  dateEnd: Date;
  requestedByUserId: string;
}

/** Compute the immediately preceding period of the same length */
function priorPeriod(start: Date, end: Date): { priorStart: Date; priorEnd: Date } {
  const ms = end.getTime() - start.getTime();
  return { priorStart: new Date(start.getTime() - ms), priorEnd: new Date(end.getTime() - ms) };
}

/** Get Jira project keys from team mappings; fall back to env var */
async function resolveProjectKeys(): Promise<string[]> {
  const mappings = await prisma.jiraMapping.findMany({ select: { projectKey: true } });
  if (mappings.length > 0) return [...new Set(mappings.map((m) => m.projectKey))];
  const envKey = process.env.JIRA_PROJECT_KEY;
  if (envKey) return [envKey];
  return [];
}

export async function createReview(input: CreateReviewInput) {
  return prisma.businessReview.create({
    data: {
      type: input.type,
      dateStart: input.dateStart,
      dateEnd: input.dateEnd,
      status: "PENDING",
      requestedByUserId: input.requestedByUserId,
    },
  });
}

export async function runReview(reviewId: string): Promise<void> {
  await prisma.businessReview.update({ where: { id: reviewId }, data: { status: "RUNNING" } });

  let jiraData: JiraReviewData | undefined;
  let analyticsData: AnalyticsReviewData | undefined;

  const review = await prisma.businessReview.findUniqueOrThrow({ where: { id: reviewId } });
  const { priorStart, priorEnd } = priorPeriod(review.dateStart, review.dateEnd);

  // Fetch Jira — partial failure allowed
  try {
    const projectKeys = await resolveProjectKeys();
    if (projectKeys.length > 0) {
      const projects = await Promise.all(projectKeys.map(fetchProjectReviewData));
      jiraData = { fetchedAt: new Date().toISOString(), projects };
    } else {
      jiraData = { fetchedAt: new Date().toISOString(), projects: [], error: "No Jira project keys configured." };
    }
  } catch (err) {
    jiraData = {
      fetchedAt: new Date().toISOString(),
      projects: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // Fetch Adobe Analytics — partial failure allowed
  try {
    analyticsData = await fetchAnalyticsData(review.dateStart, review.dateEnd, priorStart, priorEnd);
  } catch (err) {
    analyticsData = {
      fetchedAt: new Date().toISOString(),
      dateRange: {
        start: review.dateStart.toISOString().split("T")[0],
        end: review.dateEnd.toISOString().split("T")[0],
      },
      priorDateRange: {
        start: priorStart.toISOString().split("T")[0],
        end: priorEnd.toISOString().split("T")[0],
      },
      metrics: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // Generate Claude narrative — fails the whole review if Claude is unavailable
  let narrative;
  try {
    const dateRange = `${review.dateStart.toISOString().split("T")[0]} to ${review.dateEnd.toISOString().split("T")[0]}`;
    narrative = await generateNarrative({
      reviewType: review.type,
      dateRange,
      analytics: analyticsData,
      jira: jiraData,
    });
  } catch (err) {
    await prisma.businessReview.update({
      where: { id: reviewId },
      data: {
        status: "FAILED",
        error: `Narrative generation failed: ${err instanceof Error ? err.message : String(err)}`,
        jiraData: jiraData as object,
        analyticsData: analyticsData as object,
      },
    });
    return;
  }

  // Seed default action items from suggested actions
  const defaultActions: ReviewAction[] = narrative.suggestedActions.map((text, i) => ({
    id: `action-${i + 1}`,
    text,
    done: false,
  }));

  await prisma.businessReview.update({
    where: { id: reviewId },
    data: {
      status: "COMPLETE",
      jiraData: jiraData as object,
      analyticsData: analyticsData as object,
      narrative: narrative as object,
      actions: { items: defaultActions } as object,
      generatedAt: new Date(),
    },
  });
}
