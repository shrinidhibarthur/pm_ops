import { initiatives } from "@/lib/mock-data";
import { InitiativeFilters } from "@/components/initiatives/initiative-filters";
import { InitiativeTable } from "@/components/initiatives/initiative-table";
import { InitiativeHeader } from "@/components/initiatives/initiative-header";

export default function InitiativesPage() {
  return (
    <div className="p-6 space-y-6">
      <InitiativeHeader />
      <InitiativeFilters />
      <InitiativeTable initiatives={initiatives} />
    </div>
  );
}
