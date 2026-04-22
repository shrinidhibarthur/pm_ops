"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Upload, Plus, X } from "lucide-react";

const steps = [
  { id: 1, name: "Basic Info", description: "Initiative details" },
  { id: 2, name: "Problem & Goal", description: "Define the why" },
  { id: 3, name: "Impact & KPIs", description: "Success metrics" },
  { id: 4, name: "Dependencies", description: "Risks and blockers" },
  { id: 5, name: "Attachments", description: "Supporting docs" },
  { id: 6, name: "Review", description: "Submit for approval" },
];

interface CreateInitiativeWizardProps {
  teams: { id: string; name: string }[];
}

export function CreateInitiativeWizard({ teams }: CreateInitiativeWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    teamId: "",
    problemStatement: "",
    goals: [""],
    kpis: [{ name: "", baseline: "", target: "", unit: "" }],
    dependencies: [{ title: "", type: "Internal" }],
    risks: [{ description: "", likelihood: "", impact: "" }],
  });

  const updateFormData = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addGoal = () => {
    setFormData((prev) => ({ ...prev, goals: [...prev.goals, ""] }));
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData((prev) => ({ ...prev, goals: newGoals }));
  };

  const removeGoal = (index: number) => {
    setFormData((prev) => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));
  };

  const addKpi = () => {
    setFormData((prev) => ({
      ...prev,
      kpis: [...prev.kpis, { name: "", baseline: "", target: "", unit: "" }],
    }));
  };

  const addDependency = () => {
    setFormData((prev) => ({
      ...prev,
      dependencies: [...prev.dependencies, { title: "", type: "Internal" }],
    }));
  };

  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risks: [...prev.risks, { description: "", likelihood: "", impact: "" }],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          summary: formData.summary,
          teamId: formData.teamId,
        }),
      });
      const json = await res.json();
      if (json.id) {
        router.push(`/initiatives/${json.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  currentStep > step.id
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : currentStep === step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 mx-2 mt-[-1rem]",
                  currentStep > step.id ? "bg-emerald-600" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Initiative Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter initiative title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief description of the initiative"
                  value={formData.summary}
                  onChange={(e) => updateFormData("summary", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team *</Label>
                <select
                  id="team"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.teamId}
                  onChange={(e) => updateFormData("teamId", e.target.value)}
                >
                  <option value="">Select team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement *</Label>
                <Textarea
                  id="problem"
                  placeholder="What problem are we solving? Who is affected?"
                  value={formData.problemStatement}
                  onChange={(e) => updateFormData("problemStatement", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Goals</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addGoal}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </div>
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Goal ${index + 1}`}
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                    />
                    {formData.goals.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Key Performance Indicators</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addKpi}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add KPI
                  </Button>
                </div>
                {formData.kpis.map((kpi, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-4 p-4 border border-border rounded-lg">
                    <Input
                      placeholder="KPI Name"
                      value={kpi.name}
                      onChange={(e) => {
                        const newKpis = [...formData.kpis];
                        newKpis[index].name = e.target.value;
                        updateFormData("kpis", newKpis);
                      }}
                    />
                    <Input
                      placeholder="Baseline"
                      value={kpi.baseline}
                      onChange={(e) => {
                        const newKpis = [...formData.kpis];
                        newKpis[index].baseline = e.target.value;
                        updateFormData("kpis", newKpis);
                      }}
                    />
                    <Input
                      placeholder="Target"
                      value={kpi.target}
                      onChange={(e) => {
                        const newKpis = [...formData.kpis];
                        newKpis[index].target = e.target.value;
                        updateFormData("kpis", newKpis);
                      }}
                    />
                    <Input
                      placeholder="Unit (e.g., ms, %)"
                      value={kpi.unit}
                      onChange={(e) => {
                        const newKpis = [...formData.kpis];
                        newKpis[index].unit = e.target.value;
                        updateFormData("kpis", newKpis);
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Dependencies</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addDependency}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Dependency
                  </Button>
                </div>
                {formData.dependencies.map((dep, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      placeholder="Dependency description"
                      className="flex-1"
                      value={dep.title}
                      onChange={(e) => {
                        const newDeps = [...formData.dependencies];
                        newDeps[index].title = e.target.value;
                        updateFormData("dependencies", newDeps);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Risks</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRisk}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Risk
                  </Button>
                </div>
                {formData.risks.map((risk, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-2 p-4 border border-border rounded-lg">
                    <Input
                      placeholder="Risk description"
                      className="sm:col-span-2"
                      value={risk.description}
                      onChange={(e) => {
                        const newRisks = [...formData.risks];
                        newRisks[index].description = e.target.value;
                        updateFormData("risks", newRisks);
                      }}
                    />
                    <Input
                      placeholder="Likelihood (Low/Medium/High)"
                      value={risk.likelihood}
                      onChange={(e) => {
                        const newRisks = [...formData.risks];
                        newRisks[index].likelihood = e.target.value;
                        updateFormData("risks", newRisks);
                      }}
                    />
                    <Input
                      placeholder="Impact (Low/Medium/High)"
                      value={risk.impact}
                      onChange={(e) => {
                        const newRisks = [...formData.risks];
                        newRisks[index].impact = e.target.value;
                        updateFormData("risks", newRisks);
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline" size="sm">Browse Files</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG (max 10MB)
                </p>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Review Your Initiative</h3>
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                    <p className="font-medium">{formData.title || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Team:</span>
                    <p className="font-medium">
                      {teams.find((t) => t.id === formData.teamId)?.name || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Summary:</span>
                  <p className="mt-1">{formData.summary || "Not provided"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Goals:</span>
                  <ul className="list-disc list-inside mt-1">
                    {formData.goals.filter(Boolean).map((goal, i) => (
                      <li key={i}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-amber-600 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Submission Notice</p>
                  <p className="text-amber-700 mt-1">
                    Once submitted, this initiative will enter the workflow pipeline and be assigned to the appropriate team.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={() => setCurrentStep((s) => s + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleSubmit}
            disabled={submitting || !formData.title || !formData.teamId}
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        )}
      </div>
    </div>
  );
}
