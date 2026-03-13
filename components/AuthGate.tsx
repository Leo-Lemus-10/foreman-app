"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const authenticated = typeof window !== "undefined" && isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authenticated, pathname, router]);

  if (!authenticated) {
    return <p className="p-6 text-sm text-slate-600">Checking credentials...</p>;
  }

  return <>{children}</>;
}
