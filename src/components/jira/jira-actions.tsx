"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Eligibility = {
  canManageJira: boolean;
  missingPrerequisites: string[];
  hasMapping: boolean;
  projectKey: string | null;
};

export function JiraActions({ initiativeId }: { initiativeId: string }) {
  const [elig, setElig] = React.useState<Eligibility | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [issueKey, setIssueKey] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function loadEligibility() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/jira/eligibility`, { cache: "no-store" });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to load Jira eligibility.");
      return;
    }
    setElig(json.data);
  }

  React.useEffect(() => {
    void loadEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiativeId]);

  async function createEpic() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/jira/create-epic`, { method: "POST" });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to create epic.");
      return;
    }
    window.location.reload();
  }

  async function linkEpic() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/jira/link-epic`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ issueKey, url }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to link epic.");
      return;
    }
    setOpen(false);
    window.location.reload();
  }

  if (loading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading Jira…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!elig) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Mapping:{" "}
          {elig.hasMapping ? (
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{elig.projectKey}</span>
          ) : (
            <span className="font-medium text-red-600">missing</span>
          )}
        </div>
        <Badge variant={elig.canManageJira ? "success" : "warning"}>{elig.canManageJira ? "Enabled" : "Gated"}</Badge>
      </div>

      {!elig.canManageJira ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-50">
          <div className="font-medium">Jira actions are blocked.</div>
          <div className="mt-1 opacity-90">
            {elig.missingPrerequisites.length
              ? `Missing prerequisite stages: ${elig.missingPrerequisites.join(", ")}`
              : "Missing Jira mapping configuration."}
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button size="sm" onClick={() => void createEpic()} disabled={!elig.canManageJira || saving}>
          {saving ? "Working…" : "Create Epic (stub)"}
        </Button>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button size="sm" variant="outline" disabled={!elig.canManageJira || saving}>
              Link Epic
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Dialog.Title className="text-sm font-semibold">Link existing Epic</Dialog.Title>
                  <Dialog.Description className="text-xs text-zinc-500 dark:text-zinc-400">
                    Stores a link; status sync will be added via provider jobs.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button className="rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">✕</button>
                </Dialog.Close>
              </div>

              <div className="mt-3 space-y-3">
                <label className="block text-sm font-medium">
                  Epic key
                  <input
                    value={issueKey}
                    onChange={(e) => setIssueKey(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
                    placeholder={`${elig.projectKey ?? "PROJ"}-1234`}
                  />
                </label>
                <label className="block text-sm font-medium">
                  URL
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
                    placeholder="https://your-jira/browse/PROJ-1234"
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button onClick={() => void linkEpic()} disabled={saving || !issueKey.trim() || !url.trim()}>
                  {saving ? "Saving…" : "Link"}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <button
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
        onClick={() => void loadEligibility()}
      >
        Refresh
      </button>
    </div>
  );
}

