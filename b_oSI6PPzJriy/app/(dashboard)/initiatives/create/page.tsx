import { CreateInitiativeWizard } from "@/components/initiatives/create-initiative-wizard";

export default function CreateInitiativePage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Create New Initiative</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill out the form below to submit a new product initiative for approval
          </p>
        </div>
        <CreateInitiativeWizard />
      </div>
    </div>
  );
}
