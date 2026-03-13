export type Project = {
  id: string;
  project_name: string;
  project_address: string;
  created_at: string;
};

export type DailyReport = {
  id?: string;
  project_id: string;
  report_date: string;
  foreman_name: string;
  weather: string;
  work_completed: string;
  project_phase: string;
  percent_complete: number;
  total_workers: number;
  crew_hours: string;
  subcontractors: string;
  subcontractor_work: string;
  materials_delivered: string;
  material_cost: number;
  equipment_used: string;
  equipment_notes: string;
  inspection_today: boolean;
  inspection_type: string;
  inspection_result: string;
  next_inspection: string;
  issues: string;
  issue_explanation: string;
  change_order_requested: boolean;
  change_order_description: string;
  change_order_estimate: number;
  safety_incident: string;
  plan_tomorrow: string;
  materials_needed: string;
  created_at?: string;
  updated_at?: string;
};

export const defaultDailyReportValues: Omit<DailyReport, "project_id" | "report_date"> = {
  foreman_name: "",
  weather: "",
  work_completed: "",
  project_phase: "",
  percent_complete: 0,
  total_workers: 0,
  crew_hours: "",
  subcontractors: "",
  subcontractor_work: "",
  materials_delivered: "",
  material_cost: 0,
  equipment_used: "",
  equipment_notes: "",
  inspection_today: false,
  inspection_type: "",
  inspection_result: "",
  next_inspection: "",
  issues: "",
  issue_explanation: "",
  change_order_requested: false,
  change_order_description: "",
  change_order_estimate: 0,
  safety_incident: "",
  plan_tomorrow: "",
  materials_needed: "",
};
