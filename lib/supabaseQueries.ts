import { assertSupabase } from "@/lib/supabaseClient";
import type { DailyReport, Project } from "@/lib/types";

export const fetchProjects = async () => {
  const supabase = assertSupabase();
  const { data, error } = await supabase
    .from<Project>("projects")
    .select("id, project_name, project_address, created_at");

  if (error) {
    throw new Error(error.message ?? "Unable to fetch projects.");
  }

  return data ?? [];
};

export const fetchTodayReport = async (projectId: string, reportDate: string) => {
  const supabase = assertSupabase();
  const { data, error } = await supabase
    .from<DailyReport>("daily_reports")
    .select("*")
    .eq("project_id", projectId)
    .eq("report_date", reportDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message ?? "Unable to fetch today's report.");
  }

  return data;
};

export const upsertDailyReport = async (payload: DailyReport) => {
  const supabase = assertSupabase();
  const { data, error } = await supabase
    .from<DailyReport>("daily_reports")
    .select("*")
    .upsert(
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id,report_date" },
    );

  if (error) {
    throw new Error(error.message ?? "Unable to save daily report.");
  }

  return data;
};
