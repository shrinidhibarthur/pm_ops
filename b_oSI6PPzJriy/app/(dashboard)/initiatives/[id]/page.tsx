import { initiatives, activities } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { InitiativeDetailHeader } from "@/components/initiatives/detail/initiative-detail-header";
import { WorkflowTimeline } from "@/components/initiatives/detail/workflow-timeline";
import { InitiativeDetailTabs } from "@/components/initiatives/detail/initiative-detail-tabs";

interface InitiativeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InitiativeDetailPage({ params }: InitiativeDetailPageProps) {
  const { id } = await params;
  const initiative = initiatives.find((i) => i.id === id);

  if (!initiative) {
    notFound();
  }

  const initiativeActivities = activities.filter((a) => a.initiativeId === id);

  return (
    <div className="p-6 space-y-6">
      <InitiativeDetailHeader initiative={initiative} />
      <WorkflowTimeline currentStage={initiative.stage} />
      <InitiativeDetailTabs initiative={initiative} activities={initiativeActivities} />
    </div>
  );
}
