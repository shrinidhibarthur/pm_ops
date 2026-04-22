import { fetchAdobeSummary } from "./client";
import type { AnalyticsReviewData, ReviewMetric } from "@/server/reviews/types";

// Standard Adobe Analytics metric IDs.
// Override via AA_METRIC_* env vars if your report suite uses different IDs.
const METRIC_IDS = {
  sessions: process.env.AA_METRIC_SESSIONS ?? "metrics/visits",
  orders: process.env.AA_METRIC_ORDERS ?? "metrics/orders",
  revenue: process.env.AA_METRIC_REVENUE ?? "metrics/revenue",
  cartAdds: process.env.AA_METRIC_CART_ADDS ?? "metrics/cartadditions",
  carts: process.env.AA_METRIC_CARTS ?? "metrics/carts",
};

const ORDERED_KEYS = ["sessions", "orders", "revenue", "cartAdds", "carts"] as const;

function adobeDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "");
  return `${fmt(start)}/${fmt(end)}`;
}

function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export async function fetchAnalyticsData(
  dateStart: Date,
  dateEnd: Date,
  priorStart: Date,
  priorEnd: Date
): Promise<AnalyticsReviewData> {
  const metricIds = ORDERED_KEYS.map((k) => METRIC_IDS[k]);

  const [current, prior] = await Promise.all([
    fetchAdobeSummary({ dateRange: adobeDateRange(dateStart, dateEnd), metricIds }),
    fetchAdobeSummary({ dateRange: adobeDateRange(priorStart, priorEnd), metricIds }),
  ]);

  // sessions, orders, revenue, cartAdds, carts
  const [sessions, orders, revenue, cartAdds, carts] = current;
  const [pSessions, pOrders, pRevenue, pCartAdds, pCarts] = prior;

  const convRate = safeDiv(orders, sessions) * 100;
  const pConvRate = safeDiv(pOrders, pSessions) * 100;
  const cartRevisit = safeDiv(carts - cartAdds, carts) * 100;
  const pCartRevisit = safeDiv(pCarts - pCartAdds, pCarts) * 100;

  const make = (
    key: string,
    name: string,
    curr: number,
    prev: number,
    unit: ReviewMetric["unit"]
  ): ReviewMetric => {
    const delta = curr - prev;
    const deltaPct = prev === 0 ? 0 : (delta / prev) * 100;
    return { key, name, current: curr, prior: prev, delta, deltaPct, unit };
  };

  return {
    fetchedAt: new Date().toISOString(),
    dateRange: {
      start: dateStart.toISOString().split("T")[0],
      end: dateEnd.toISOString().split("T")[0],
    },
    priorDateRange: {
      start: priorStart.toISOString().split("T")[0],
      end: priorEnd.toISOString().split("T")[0],
    },
    metrics: [
      make("sessions", "Sessions", sessions, pSessions, "number"),
      make("orders", "Orders", orders, pOrders, "number"),
      make("revenue", "Revenue", revenue, pRevenue, "currency"),
      make("cartAdds", "Cart Adds", cartAdds, pCartAdds, "number"),
      make("cartRevisit", "Cart Revisit Rate", cartRevisit, pCartRevisit, "percent"),
      make("convRate", "Conversion Rate", convRate, pConvRate, "percent"),
    ],
  };
}
