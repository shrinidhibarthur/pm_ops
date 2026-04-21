import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewInitiativePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">New initiative</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Creation is wired through the workflow engine + RBAC (next step).
          </p>
        </div>
        <Link
          href="/initiatives"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
        >
          Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
          This screen will include: title/summary, workstream/team, workflow selection, and initial artifacts/checklist.
        </CardContent>
      </Card>
    </div>
  );
}

