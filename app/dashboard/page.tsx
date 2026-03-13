"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { ProjectGrid } from "@/components/ProjectGrid";
import { fetchProjects } from "@/lib/supabaseQueries";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjects(await fetchProjects());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Construction Dashboard</h1>
            <Link href="/login" onClick={() => localStorage.removeItem("foreman-app-authenticated")} className="text-sm text-slate-600 underline">
              Logout
            </Link>
          </div>
          {loading ? <p>Loading projects...</p> : null}
          {error ? <p className="text-red-600">{error}</p> : null}
          {!loading && !error ? <ProjectGrid projects={projects} /> : null}
        </div>
      </main>
    </AuthGate>
  );
}
