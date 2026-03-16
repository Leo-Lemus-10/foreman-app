"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_STORAGE_KEY, isAuthenticated } from "@/lib/auth";

const safeNextRoute = (rawNext: string | null) => {
  if (!rawNext) {
    return "/dashboard";
  }

  try {
    const url = new URL(rawNext, window.location.origin);
    if (url.origin !== window.location.origin) {
      return "/dashboard";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/dashboard";
  }
};

export function LoginForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authed = isAuthenticated();

    if (authed) {
      router.replace("/dashboard");
    }
  }, [router, searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const configuredPasscode = process.env.NEXT_PUBLIC_APP_PASSCODE;

    if (!configuredPasscode) {
      setError("App passcode is not configured.");
      setSubmitting(false);
      return;
    }

    if (passcode !== configuredPasscode) {
      setError("Incorrect passcode.");
      setSubmitting(false);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    const rawNext = searchParams.get("next");
    const sanitizedNextRoute = safeNextRoute(rawNext);

    router.push(sanitizedNextRoute);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-slate-900">Foreman Login</h1>
      <p className="text-sm text-slate-600">Enter the shared passcode to access daily reports.</p>
      <label className="block text-sm font-medium text-slate-700">
        Passcode
        <input
          type="password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-base focus:border-slate-500 focus:outline-none"
          placeholder="••••••"
          required
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 p-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        disabled={submitting}
      >
        {submitting ? "Checking..." : "Login"}
      </button>
    </form>
  );
}
