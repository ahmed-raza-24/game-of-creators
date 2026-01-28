// app/auth/callback/page.tsx - UPDATE
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
      try {
        // Get current URL
        const currentUrl = window.location.href;
        
        // Check if it's a callback from OAuth
        const url = new URL(currentUrl);
        const hasCode = url.searchParams.has('code');
        
        if (hasCode) {
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(currentUrl);

          if (error) {
            console.error("Auth error:", error);
            router.replace("/");
            return;
          }

          if (data.session) {
            const role = params.get("role") ?? "creator";
            router.replace(role === "brand" ? "/brand" : "/creator");
          }
        } else {
          // Already logged in?
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const role = params.get("role") ?? "creator";
            router.replace(role === "brand" ? "/brand" : "/creator");
          } else {
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.replace("/");
      }
    }

    run();
  }, [router, params]);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-400">
      Logging you in...
    </main>
  );
}