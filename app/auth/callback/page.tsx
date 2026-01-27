"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

useEffect(() => {
  async function run() {
    // Pehle check karo agar already session hai
    const { data: { session: existingSession } } = await supabase.auth.getSession();
    if (existingSession?.user) {
      // Already logged in hai, redirect karo
      const role = params.get("role") ?? "creator";
      router.replace(role === "brand" ? "/brand" : "/creator");
      return;
    }

    // Nahi to OAuth complete karo
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      window.location.href
    );

    if (error || !data.session) {
      console.error(error);
      router.replace("/");
      return;
    }

    const role = params.get("role") ?? "creator";
    router.replace(role === "brand" ? "/brand" : "/creator");
  }

  run();
}, []);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-400">
      Logging you in...
    </main>
  );
}
