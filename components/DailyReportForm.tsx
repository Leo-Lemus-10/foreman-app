"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { defaultDailyReportValues, type DailyReport } from "@/lib/types";
import { fetchTodayReport, upsertDailyReport } from "@/lib/supabaseQueries";

const todayDate = () => new Date().toISOString().split("T")[0];

type FormProps = {
  projectId: string;
};

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, children, className }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium text-slate-700 ${className ?? ""}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

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
      <form onSubmit={submit} className="space-y-6 rounded-2xl bg-white p-4 pb-28 shadow-sm sm:p-6 md:pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Daily Report</h1>
          <p className="text-sm text-slate-600">Project: {projectId}</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Foreman Name">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.foreman_name} onChange={(e) => setField("foreman_name", e.target.value)} />
          </Field>
          <Field label="Weather">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.weather} onChange={(e) => setField("weather", e.target.value)} />
          </Field>
          <Field label="Work Completed" className="md:col-span-2">
            <textarea className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.work_completed} onChange={(e) => setField("work_completed", e.target.value)} />
          </Field>
          <Field label="Project Phase">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.project_phase} onChange={(e) => setField("project_phase", e.target.value)} />
          </Field>
          <Field label="Percent Complete">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" type="number" value={formState.percent_complete} onChange={(e) => setField("percent_complete", Number(e.target.value))} />
          </Field>
          <Field label="Total Workers">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" type="number" value={formState.total_workers} onChange={(e) => setField("total_workers", Number(e.target.value))} />
          </Field>
          <Field label="Crew Hours">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.crew_hours} onChange={(e) => setField("crew_hours", e.target.value)} />
          </Field>
          <Field label="Subcontractors">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.subcontractors} onChange={(e) => setField("subcontractors", e.target.value)} />
          </Field>
          <Field label="Subcontractor Work">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.subcontractor_work} onChange={(e) => setField("subcontractor_work", e.target.value)} />
          </Field>
          <Field label="Materials Delivered">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.materials_delivered} onChange={(e) => setField("materials_delivered", e.target.value)} />
          </Field>
          <Field label="Material Cost">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" type="number" step="0.01" value={formState.material_cost} onChange={(e) => setField("material_cost", Number(e.target.value))} />
          </Field>
          <Field label="Equipment Used">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.equipment_used} onChange={(e) => setField("equipment_used", e.target.value)} />
          </Field>
          <Field label="Equipment Notes">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.equipment_notes} onChange={(e) => setField("equipment_notes", e.target.value)} />
          </Field>
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm">
            <input type="checkbox" checked={formState.inspection_today} onChange={(e) => setField("inspection_today", e.target.checked)} /> Inspection today
          </label>
          <Field label="Inspection Type">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.inspection_type} onChange={(e) => setField("inspection_type", e.target.value)} />
          </Field>
          <Field label="Inspection Result">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.inspection_result} onChange={(e) => setField("inspection_result", e.target.value)} />
          </Field>
          <Field label="Next Inspection">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.next_inspection} onChange={(e) => setField("next_inspection", e.target.value)} />
          </Field>
          <Field label="Issues">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.issues} onChange={(e) => setField("issues", e.target.value)} />
          </Field>
          <Field label="Issue Explanation">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.issue_explanation} onChange={(e) => setField("issue_explanation", e.target.value)} />
          </Field>
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm">
            <input type="checkbox" checked={formState.change_order_requested} onChange={(e) => setField("change_order_requested", e.target.checked)} /> Change order requested
          </label>
          <Field label="Change Order Description">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.change_order_description} onChange={(e) => setField("change_order_description", e.target.value)} />
          </Field>
          <Field label="Change Order Estimate">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" type="number" step="0.01" value={formState.change_order_estimate} onChange={(e) => setField("change_order_estimate", Number(e.target.value))} />
          </Field>
          <Field label="Safety Incident">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.safety_incident} onChange={(e) => setField("safety_incident", e.target.value)} />
          </Field>
          <Field label="Plan For Tomorrow">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.plan_tomorrow} onChange={(e) => setField("plan_tomorrow", e.target.value)} />
          </Field>
          <Field label="Materials Needed">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200" value={formState.materials_needed} onChange={(e) => setField("materials_needed", e.target.value)} />
          </Field>
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none [padding-bottom:calc(env(safe-area-inset-bottom)+0.75rem)] md:[padding-bottom:0]">
          <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow disabled:opacity-60" disabled={saving}>
            {saving ? "Saving..." : "Save Daily Report"}
          </button>
        </div>
      </form>
      {toast ? <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded bg-emerald-600 px-4 py-2 text-sm text-white shadow [bottom:calc(env(safe-area-inset-bottom)+1rem)]">{toast}</div> : null}
    </>
  );
}
