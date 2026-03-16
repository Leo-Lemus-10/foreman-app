"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (checked && !authed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [checked, authed, pathname, router]);

  if (!checked) {
    return <p className="p-6 text-sm text-slate-600">Checking credentials...</p>;
  }

  if (!authed) {
    return <p className="p-6 text-sm text-slate-600">Redirecting to login...</p>;
  }

  return <>{children}</>;
}
