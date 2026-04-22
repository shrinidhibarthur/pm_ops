import Anthropic from "@anthropic-ai/sdk";
import type { JiraReviewData, AnalyticsReviewData, ReviewNarrative } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a senior business review specialist helping draft executive business reviews in Amazon-style WBR/MBR/QBR format.

Your output must be concise, data-driven, and direct. Focus on what moved, why it matters, and what action is needed.

Rules:
- Highlights: things that went well, backed by specific numbers
- Lowlights: things that need attention, specific and actionable
- Variance notes: only for metrics that changed more than 10% — explain the likely driver in one sentence
- Suggested actions: concrete, assignable, time-bound where possible
- No filler phrases like "it is worth noting" or "it should be mentioned"

Return ONLY valid JSON, no markdown fences.`;

interface NarrativeInput {
  reviewType: string;
  dateRange: string;
  analytics?: AnalyticsReviewData;
  jira?: JiraReviewData;
}

export async function generateNarrative(input: NarrativeInput): Promise<ReviewNarrative> {
  const prompt = `Generate a ${input.reviewType} business review narrative for the period ${input.dateRange}.

Data:
${JSON.stringify(input, null, 2)}

Return this JSON structure (no other text):
{
  "summary": "2-3 sentence executive summary of the period",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "lowlights": ["lowlight 1", "lowlight 2"],
  "varianceNotes": {
    "metricKey": "one-sentence explanation of why it moved"
  },
  "suggestedActions": ["action 1", "action 2", "action 3"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // Cache the system prompt across review generations
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Extract JSON if surrounded by extra text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude returned non-JSON narrative: ${text.slice(0, 200)}`);
  }

  return JSON.parse(jsonMatch[0]) as ReviewNarrative;
}
