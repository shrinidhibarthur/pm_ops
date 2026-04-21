import { workflowStages, notificationRules, approvalMatrix, jiraMappings, checklistTemplates } from "@/lib/mock-data";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure workflow stages, approval processes, and integrations
        </p>
      </div>
      <AdminTabs 
        workflowStages={workflowStages}
        notificationRules={notificationRules}
        approvalMatrix={approvalMatrix}
        jiraMappings={jiraMappings}
        checklistTemplates={checklistTemplates}
      />
    </div>
  );
}
