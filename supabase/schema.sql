create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  project_address text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  report_date date not null,
  foreman_name text,
  weather text,
  work_completed text,
  project_phase text,
  percent_complete int,
  total_workers int,
  crew_hours text,
  subcontractors text,
  subcontractor_work text,
  materials_delivered text,
  material_cost numeric,
  equipment_used text,
  equipment_notes text,
  inspection_today boolean,
  inspection_type text,
  inspection_result text,
  next_inspection text,
  issues text,
  issue_explanation text,
  change_order_requested boolean,
  change_order_description text,
  change_order_estimate numeric,
  safety_incident text,
  plan_tomorrow text,
  materials_needed text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone
);

alter table daily_reports
  add constraint daily_reports_project_date_unique unique (project_id, report_date);
