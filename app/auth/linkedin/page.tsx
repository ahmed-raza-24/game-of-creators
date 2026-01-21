"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getLinkedInAuthUrl } from "@/lib/linkedin";

export default function LinkedInConnectDemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function connectDemoLinkedIn() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login again");
      router.push("/");
      return;
    }

    const { error } = await supabase
      .from("creator_social_accounts")
      .upsert(
        {
          user_id: user.id,
          provider: "linkedin",
          // Add demo data
          profile_data: {
            demo: true,
            connected_at: new Date().toISOString(),
          },
        },
        {
          onConflict: "user_id,provider",
        }
      );

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to connect LinkedIn (demo)");
    } else {
      alert("LinkedIn connected (demo)");
      router.push("/creator?connected=linkedin");
    }
  }

  // Real LinkedIn OAuth function
  function connectRealLinkedIn() {
    // Redirect to LinkedIn OAuth
    window.location.href = getLinkedInAuthUrl();
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
          onClick={() => router.push("/creator")}
          className="mt-4 text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}