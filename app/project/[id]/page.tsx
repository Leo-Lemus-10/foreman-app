"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";
import { DailyReportForm } from "@/components/DailyReportForm";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();

  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link href="/dashboard" className="text-sm text-slate-700 underline">
            ← Back to dashboard
          </Link>
          <DailyReportForm projectId={params.id} />
        </div>
      </main>
    </AuthGate>
  );
}
