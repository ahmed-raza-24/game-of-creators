"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getLinkedInAuthUrl } from "@/lib/linkedin";
import { Suspense } from "react";

// Inner component that uses useSearchParams
function LinkedInConnectDemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Get redirect parameter if it exists
  const redirectParam = searchParams.get("redirect") || "/creator";

  async function connectDemoLinkedIn() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login again");
        router.push("/");
        return;
      }

      // Try without profile_data (same as TikTok fix)
      const { error } = await supabase
        .from("creator_social_accounts")
        .upsert(
          {
            user_id: user.id,
            provider: "linkedin",
          },
          {
            onConflict: "user_id,provider",
          }
        );

      setLoading(false);

      if (error) {
        // Better error logging
        console.error("LinkedIn connect error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        alert(`Failed to connect LinkedIn: ${error.message || "Unknown error"}`);
      } else {
        alert("LinkedIn connected (demo)");
        router.push(`${redirectParam}?connected=linkedin`);
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  }

  // Real LinkedIn OAuth function
  function connectRealLinkedIn() {
    // Get redirect parameter for OAuth callback
    const oauthRedirectUrl = `${window.location.origin}/auth/linkedin/callback?redirect=${encodeURIComponent(redirectParam)}`;
    
    // Redirect to LinkedIn OAuth with redirect parameter
    window.location.href = getLinkedInAuthUrl(oauthRedirectUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] p-6">
      <div className="max-w-md w-full bg-[#121226] border border-purple-500/20 rounded-2xl p-8 shadow-xl text-center">
        <h1
          className="text-2xl font-extrabold mb-3"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          💼 Connect LinkedIn
        </h1>

        <div className="space-y-4 mb-6">
          {/* Real LinkedIn OAuth */}
          <div className="border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Real LinkedIn Connection</h3>
            <p className="text-gray-400 text-sm mb-3">
              Connect your actual LinkedIn account using OAuth
            </p>
            <button
              onClick={() => {
                // Check if client ID exists
                if (!process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID) {
                  alert("LinkedIn is temporarily unavailable. Using demo mode.");
                  connectDemoLinkedIn();
                } else {
                  connectRealLinkedIn();
                }
              }}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Connect with LinkedIn
            </button>
          </div>

          {/* Demo Option */}
          <div className="border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Demo Connection</h3>
            <p className="text-gray-400 text-sm mb-3">
              Simulate connection without real LinkedIn login
            </p>
            <button
              onClick={connectDemoLinkedIn}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:scale-[1.03] transition disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Continue (Demo)"}
            </button>
          </div>
        </div>

        <button
          onClick={() => router.push(redirectParam)}
          className="mt-4 text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}

// Main component with Suspense wrapper
export default function LinkedInConnectDemoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading connection page...</p>
        </div>
      </main>
    }>
      <LinkedInConnectDemoContent />
    </Suspense>
  );
}