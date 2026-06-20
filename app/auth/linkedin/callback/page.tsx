"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Main callback component wrapped in Suspense
function LinkedInCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const code = params.get("code");
      const error = params.get("error");
      const demo = params.get("demo"); // ✅ ADD THIS: Check for demo parameter

      // ✅ HANDLE DEMO FLOW
      if (demo === "true") {
        console.log("Processing demo LinkedIn connection");
        await handleDemoConnection();
        return;
      }

      // ✅ HANDLE REAL OAUTH FLOW (existing code)
      if (error) {
        console.error("LinkedIn auth error:", error);
        router.push("/creator");
        return;
      }

      if (!code) {
        router.push("/creator");
        return;
      }

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Save LinkedIn connection (demo for now)
          await supabase.from("creator_social_accounts").upsert({
            user_id: user.id,
            provider: "linkedin",
            access_token: "demo_token_" + Date.now(),
            profile_data: {
              connected_at: new Date().toISOString(),
              oauth_success: true,
            },
          });

          // Redirect with success param
          router.push("/creator?connected=linkedin&source=oauth");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("LinkedIn callback error:", err);
        router.push("/creator");
      }
    }

    // ✅ NEW FUNCTION: Handle demo connection
    async function handleDemoConnection() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/");
          return;
        }

        // Save demo connection
        const { error } = await supabase
          .from("creator_social_accounts")
          .upsert({
            user_id: user.id,
            provider: "linkedin",
            profile_data: {
              connected_at: new Date().toISOString(),
              demo_mode: true,
            },
          }, {
            onConflict: "user_id,provider",
          });

        if (error) {
          console.error("Demo connection error:", error);
          router.push("/creator?error=linkedin_demo_failed");
        } else {
          console.log("Demo LinkedIn connection saved successfully");
          router.push("/creator?connected=linkedin&source=demo");
        }
      } catch (err) {
        console.error("Demo flow error:", err);
        router.push("/creator");
      }
    }

    handleCallback();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
      <p className="text-gray-400">Connecting LinkedIn...</p>
    </div>
  );
}

// Main page component with Suspense
export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <LinkedInCallbackContent />
    </Suspense>
  );
}