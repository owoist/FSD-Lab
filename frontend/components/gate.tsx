"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

// Wraps logged-in pages: redirects to /login without a session, otherwise shows nav + content.
export default function Gate({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && !data) router.replace("/login");
  }, [isPending, data, router]);
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.12),transparent_55%)]" />
      {data ? children : <p className="text-sm text-muted-foreground">Loading…</p>}
      <div />
    </main>
  );
}
