"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

const ARTIFACT_TYPES = ["LINK", "DOCUMENT", "PRD", "UX", "DESIGN", "FINANCE", "ADA", "OTHER"] as const;
type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export function ArtifactAddDialog({ initiativeId, defaultStageKey }: { initiativeId: string; defaultStageKey: string }) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<ArtifactType>("LINK");
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/artifacts`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stageKey: defaultStageKey, type, name, url }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to add artifact.");
      return;
    }
    setOpen(false);
    window.location.reload();
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="secondary">
          Add artifact
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-sm font-semibold">Add artifact</Dialog.Title>
              <Dialog.Description className="text-xs text-zinc-500 dark:text-zinc-400">
                Attach a doc/link to satisfy stage requirements.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">✕</button>
            </Dialog.Close>
          </div>

          <div className="mt-3 space-y-3">
            <label className="block text-sm font-medium">
              Type
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ArtifactType)}
                className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
              >
                {ARTIFACT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
                placeholder="PRD doc, Pitch deck, Figma link..."
              />
            </label>
            <label className="block text-sm font-medium">
              URL
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-black"
                placeholder="https://..."
              />
            </label>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={() => void onSave()} disabled={saving || !name.trim() || !url.trim()}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

