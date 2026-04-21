import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const templates = await prisma.reportTemplate.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Admin • Report templates</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Report templates drive PDF/DOCX/CSV export jobs (provider abstraction next).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">No templates.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {templates.map((t) => (
                <li key={t.id} className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.type} • key={t.key}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

