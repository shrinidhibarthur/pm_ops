"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Plus, Trash2, Check } from "lucide-react";
import type { ReviewNarrative, ReviewAction } from "@/server/reviews/types";
import { cn } from "@/lib/utils";

interface NarrativeSectionProps {
  narrative: ReviewNarrative;
}

export function NarrativeSection({ narrative }: NarrativeSectionProps) {
  return (
    <div className="space-y-6">
      {narrative.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">{narrative.summary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {narrative.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-700 dark:text-red-400 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Lowlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {narrative.lowlights.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface VarianceNotesProps {
  notes: Record<string, string>;
}

export function VarianceNotes({ notes }: VarianceNotesProps) {
  const entries = Object.entries(notes);
  if (entries.length === 0) return null;

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="text-base text-amber-700 dark:text-amber-400">
          ⚠ Variance Explanations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map(([key, explanation]) => (
            <div key={key} className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-1">
                {key}
              </p>
              <p className="text-sm text-foreground">{explanation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActionsEditorProps {
  reviewId: string;
  initialActions: ReviewAction[];
}

export function ActionsEditor({ reviewId, initialActions }: ActionsEditorProps) {
  const [items, setItems] = useState<ReviewAction[]>(initialActions);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));

  const remove = (id: string) => setItems((prev) => prev.filter((a) => a.id !== id));

  const add = () => {
    const text = newText.trim();
    if (!text) return;
    setItems((prev) => [
      ...prev,
      { id: `action-${Date.now()}`, text, done: false },
    ]);
    setNewText("");
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/reviews/${reviewId}/actions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Action Items</CardTitle>
        <Button
          size="sm"
          onClick={save}
          disabled={saving}
          variant={saved ? "outline" : "default"}
          className={cn(saved && "text-emerald-600 border-emerald-300")}
        >
          {saved ? (
            <>
              <Check className="h-3 w-3 mr-1" /> Saved
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save"
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((action) => (
          <div
            key={action.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-border transition-colors",
              action.done && "opacity-60 bg-muted/30"
            )}
          >
            <button
              onClick={() => toggle(action.id)}
              className={cn(
                "mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                action.done
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-muted-foreground hover:border-primary"
              )}
            >
              {action.done && <Check className="h-3 w-3 text-white" />}
            </button>
            <span className={cn("flex-1 text-sm", action.done && "line-through text-muted-foreground")}>
              {action.text}
            </span>
            <button
              onClick={() => remove(action.id)}
              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="Add action item..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="text-sm"
          />
          <Button size="icon" variant="outline" onClick={add} disabled={!newText.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
