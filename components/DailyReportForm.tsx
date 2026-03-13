"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { defaultDailyReportValues, type DailyReport } from "@/lib/types";
import { fetchTodayReport, upsertDailyReport } from "@/lib/supabaseQueries";

const todayDate = () => new Date().toISOString().split("T")[0];

type FormProps = {
  projectId: string;
};

export function DailyReportForm({ projectId }: FormProps) {
  const [formState, setFormState] = useState<DailyReport>({
    project_id: projectId,
    report_date: todayDate(),
    ...defaultDailyReportValues,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const reportDate = useMemo(() => todayDate(), []);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const report = await fetchTodayReport(projectId, reportDate);
        if (report) {
          setFormState((current) => ({ ...current, ...report }));
        }
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Unable to load daily report.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [projectId, reportDate]);

  const setField = <K extends keyof DailyReport>(key: K, value: DailyReport[K]) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await upsertDailyReport({ ...formState, project_id: projectId, report_date: reportDate });
      setToast("Daily report saved successfully.");
      setTimeout(() => setToast(""), 3000);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save daily report.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="rounded-lg bg-white p-6 shadow">Loading report...</p>;
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-5 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">Daily Report</h1>
        <p className="text-sm text-slate-600">Project: {projectId}</p>

        <section className="grid gap-4 md:grid-cols-2">
          <input className="rounded border p-3" placeholder="Foreman name" value={formState.foreman_name} onChange={(e) => setField("foreman_name", e.target.value)} />
          <input className="rounded border p-3" placeholder="Weather" value={formState.weather} onChange={(e) => setField("weather", e.target.value)} />
          <textarea className="rounded border p-3 md:col-span-2" placeholder="Work completed" value={formState.work_completed} onChange={(e) => setField("work_completed", e.target.value)} />
          <input className="rounded border p-3" placeholder="Project phase" value={formState.project_phase} onChange={(e) => setField("project_phase", e.target.value)} />
          <input className="rounded border p-3" type="number" placeholder="Percent complete" value={formState.percent_complete} onChange={(e) => setField("percent_complete", Number(e.target.value))} />
          <input className="rounded border p-3" type="number" placeholder="Total workers" value={formState.total_workers} onChange={(e) => setField("total_workers", Number(e.target.value))} />
          <input className="rounded border p-3" placeholder="Crew hours" value={formState.crew_hours} onChange={(e) => setField("crew_hours", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Subcontractors" value={formState.subcontractors} onChange={(e) => setField("subcontractors", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Subcontractor work" value={formState.subcontractor_work} onChange={(e) => setField("subcontractor_work", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Materials delivered" value={formState.materials_delivered} onChange={(e) => setField("materials_delivered", e.target.value)} />
          <input className="rounded border p-3" type="number" step="0.01" placeholder="Material cost" value={formState.material_cost} onChange={(e) => setField("material_cost", Number(e.target.value))} />
          <textarea className="rounded border p-3" placeholder="Equipment used" value={formState.equipment_used} onChange={(e) => setField("equipment_used", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Equipment notes" value={formState.equipment_notes} onChange={(e) => setField("equipment_notes", e.target.value)} />
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={formState.inspection_today} onChange={(e) => setField("inspection_today", e.target.checked)} /> Inspection today
          </label>
          <input className="rounded border p-3" placeholder="Inspection type" value={formState.inspection_type} onChange={(e) => setField("inspection_type", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Inspection result" value={formState.inspection_result} onChange={(e) => setField("inspection_result", e.target.value)} />
          <input className="rounded border p-3" placeholder="Next inspection" value={formState.next_inspection} onChange={(e) => setField("next_inspection", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Issues" value={formState.issues} onChange={(e) => setField("issues", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Issue explanation" value={formState.issue_explanation} onChange={(e) => setField("issue_explanation", e.target.value)} />
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={formState.change_order_requested} onChange={(e) => setField("change_order_requested", e.target.checked)} /> Change order requested
          </label>
          <textarea className="rounded border p-3" placeholder="Change order description" value={formState.change_order_description} onChange={(e) => setField("change_order_description", e.target.value)} />
          <input className="rounded border p-3" type="number" step="0.01" placeholder="Change order estimate" value={formState.change_order_estimate} onChange={(e) => setField("change_order_estimate", Number(e.target.value))} />
          <textarea className="rounded border p-3" placeholder="Safety incident" value={formState.safety_incident} onChange={(e) => setField("safety_incident", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Plan for tomorrow" value={formState.plan_tomorrow} onChange={(e) => setField("plan_tomorrow", e.target.value)} />
          <textarea className="rounded border p-3" placeholder="Materials needed" value={formState.materials_needed} onChange={(e) => setField("materials_needed", e.target.value)} />
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded-lg bg-slate-900 p-3 text-white" disabled={saving}>
          {saving ? "Saving..." : "Save Daily Report"}
        </button>
      </form>
      {toast ? <div className="fixed bottom-5 right-5 rounded bg-emerald-600 px-4 py-2 text-white shadow">{toast}</div> : null}
    </>
  );
}
