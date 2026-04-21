"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type ChecklistItem = { key: string; label: string; required: boolean };
export type Checklist = { key: string; name: string; items: ChecklistItem[] };

export function ChecklistPanel({
  initiativeId,
  stageKey,
  checklists,
  completedItemKeys,
}: {
  initiativeId: string;
  stageKey: string;
  checklists: Checklist[];
  completedItemKeys: string[];
}) {
  const completed = React.useMemo(() => new Set(completedItemKeys), [completedItemKeys]);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function complete(checklistKey: string, itemKey: string) {
    setSavingKey(`${checklistKey}:${itemKey}`);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/checklists/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stageKey, checklistKey, itemKey }),
    });
    const json = await res.json();
    setSavingKey(null);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to complete item.");
      return;
    }
    window.location.reload();
  }

  if (checklists.length === 0) {
    return <div className="text-sm text-zinc-600 dark:text-zinc-400">No checklist requirements for this stage.</div>;
  }

  return (
    <div className="space-y-3">
      {checklists.map((c) => (
        <div key={c.key} className="rounded-md border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{c.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">key={c.key}</div>
            </div>
          </div>
          <div className="p-3">
            <ul className="space-y-2">
              {c.items.map((it) => {
                const k = `${c.key}:${it.key}`;
                const done = completed.has(k);
                return (
                  <li key={it.key} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className={cn("text-sm", done ? "text-zinc-500 line-through dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50")}>
                        {it.label}
                        {it.required ? <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">(required)</span> : null}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">itemKey={it.key}</div>
                    </div>
                    {done ? (
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Completed</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => void complete(c.key, it.key)}
                        disabled={savingKey !== null}
                      >
                        {savingKey === k ? "Saving…" : "Mark complete"}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
            {error ? <div className="mt-2 text-xs text-red-600">{error}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

