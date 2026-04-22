import { prisma } from "@/server/db/prisma";
import { InitiativeHeader } from "@/components/initiatives/initiative-header";
import { InitiativeFilters } from "@/components/initiatives/initiative-filters";
import { InitiativeTable } from "@/components/initiatives/initiative-table";

export const dynamic = "force-dynamic";

export default async function InitiativesListPage() {
  const [initiatives, teams] = await Promise.all([
    prisma.initiative.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        key: true,
        title: true,
        summary: true,
        status: true,
        currentStageKey: true,
        updatedAt: true,
        team: { select: { name: true } },
        owner: { select: { name: true, email: true } },
      },
    }),
    prisma.team.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <InitiativeHeader />
      <InitiativeFilters teams={teams} />
      <InitiativeTable initiatives={initiatives} />
    </div>
  );
}
