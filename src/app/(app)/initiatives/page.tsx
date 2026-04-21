import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function InitiativesListPage() {
  const initiatives = await prisma.initiative.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: { team: true, owner: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Initiatives</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Filterable portfolio view (seed data included).</p>
        </div>
        <Link
          href="/initiatives/new"
          className="rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Create
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 text-left font-medium">Key</th>
                  <th className="py-2 text-left font-medium">Title</th>
                  <th className="py-2 text-left font-medium">Team</th>
                  <th className="py-2 text-left font-medium">Owner</th>
                  <th className="py-2 text-left font-medium">Stage</th>
                  <th className="py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {initiatives.map((i) => (
                  <tr key={i.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950">
                    <td className="py-2 pr-4">
                      <Link href={`/initiatives/${i.id}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                        {i.key}
                      </Link>
                    </td>
                    <td className="py-2 pr-6 max-w-[520px]">
                      <div className="truncate">{i.title}</div>
                      {i.summary ? (
                        <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{i.summary}</div>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4">{i.team.name}</td>
                    <td className="py-2 pr-4">{i.owner.name ?? i.owner.email}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="default">{i.currentStageKey}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={i.status === "ACTIVE" ? "info" : i.status === "COMPLETED" ? "success" : "warning"}>
                        {i.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {initiatives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                      No initiatives.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

