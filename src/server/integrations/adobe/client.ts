const IMS_URL = "https://ims-na1.adobelogin.com";
const AA_URL = "https://analytics.adobe.io";

// In-memory token cache — safe for server-side singleton
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.AA_CLIENT_ID;
  const clientSecret = process.env.AA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Adobe Analytics credentials not configured. Set AA_CLIENT_ID and AA_CLIENT_SECRET.");
  }

  const res = await fetch(`${IMS_URL}/ims/token/v3`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      // Scope required for Analytics reporting API
      scope: "openid,AdobeID,read_organizations,additional_info.projectedProductContext",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Adobe IMS token error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export interface AdobeReportRequest {
  rsid?: string;
  dateRange: string; // ISO 8601 interval: "2024-01-01T00:00:00/2024-01-07T23:59:59"
  metricIds: string[];
}

/** Returns metric totals in the same order as metricIds */
export async function fetchAdobeSummary(req: AdobeReportRequest): Promise<number[]> {
  const token = await getAccessToken();
  const clientId = process.env.AA_CLIENT_ID!;
  const companyId = process.env.AA_GLOBAL_COMPANY_ID;
  const rsid = req.rsid ?? process.env.AA_REPORT_SUITE_ID;

  if (!companyId || !rsid) {
    throw new Error(
      "Adobe Analytics not configured. Set AA_GLOBAL_COMPANY_ID and AA_REPORT_SUITE_ID."
    );
  }

  const body = {
    rsid,
    globalFilters: [{ type: "dateRange", dateRange: req.dateRange }],
    metricContainer: { metrics: req.metricIds.map((id) => ({ id })) },
    settings: { countRepeatInstances: true, limit: 1, page: 0, dimensionSort: "asc" },
  };

  const res = await fetch(`${AA_URL}/api/${companyId}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": clientId,
      "x-proxy-global-company-id": companyId,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Adobe Analytics API error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    rows?: Array<{ data: number[] }>;
    summaries?: number[];
  };

  // Prefer summaries field; fall back to first row's data array
  if (data.summaries && data.summaries.length > 0) return data.summaries;
  if (data.rows?.[0]?.data) return data.rows[0].data;
  return req.metricIds.map(() => 0);
}
