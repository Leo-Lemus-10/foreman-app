"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";
import { DailyReportForm } from "@/components/DailyReportForm";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();

  return (
    <AuthGate>
      <main className="min-h-screen bg-slate-100 px-3 py-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-4 [padding-bottom:env(safe-area-inset-bottom)]">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-slate-700 underline underline-offset-2">
            ← Back to dashboard
          </Link>
          <DailyReportForm projectId={params.id} />
        </div>
      </main>
    </AuthGate>
  );
}
