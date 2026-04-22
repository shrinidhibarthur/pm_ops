import { prisma } from "@/server/db/prisma";
import { CreateInitiativeWizard } from "@/components/initiatives/create-initiative-wizard";

export const dynamic = "force-dynamic";

export default async function NewInitiativePage() {
  const teams = await prisma.team.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Create Initiative</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define a new initiative and submit it for workflow processing
        </p>
      </div>
      <div className="max-w-3xl">
        <CreateInitiativeWizard teams={teams} />
      </div>
    </div>
  );
}
