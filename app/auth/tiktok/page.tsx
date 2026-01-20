"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TikTokConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"demo" | "real">("demo");

  async function connectDemoTikTok() {
    setLoading(true);

    // 🔹 get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login again");
      router.push("/");
      return;
    }

    // 🔹 DEMO connect (no real OAuth)
    const { error } = await supabase
      .from("creator_social_accounts")
      .upsert(
        {
          user_id: user.id,
          provider: "tiktok",
          profile_data: {
            demo: true,
            connected_at: new Date().toISOString(),
            username: "demo_tiktok_user",
            followers: 10000,
          },
        },
        {
          onConflict: "user_id,provider",
        }
      );

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to connect TikTok (demo)");
    } else {
      alert("TikTok connected (demo)");
      router.push("/creator?connected=tiktok");
    }
  }

  function connectRealTikTok() {
    // TikTok OAuth is complex and requires business verification
    // This is a placeholder for real implementation
    alert("TikTok OAuth requires business verification. Using demo for now.");
    connectDemoTikTok();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] p-6">
      <div className="max-w-md w-full bg-[#121226] border border-purple-500/20 rounded-2xl p-8 shadow-xl text-center">
        <h1
          className="text-2xl font-extrabold mb-3"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          🎵 Connect TikTok
        </h1>

        <div className="space-y-4 mb-6">
          {/* Option Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedOption("demo")}
              className={`flex-1 py-2 rounded-lg ${
                selectedOption === "demo"
                  ? "bg-purple-600 text-white"
                  : "bg-[#1a1a2e] text-gray-400"
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => setSelectedOption("real")}
              className={`flex-1 py-2 rounded-lg ${
                selectedOption === "real"
                  ? "bg-purple-600 text-white"
                  : "bg-[#1a1a2e] text-gray-400"
              }`}
            >
              Real OAuth
            </button>
          </div>

          {/* Real TikTok OAuth Info */}
          {selectedOption === "real" && (
            <div className="border border-purple-500/30 rounded-lg p-4 text-left">
              <h3 className="text-white font-medium mb-2">⚠️ TikTok OAuth Requirements</h3>
              <ul className="text-gray-400 text-sm space-y-1 mb-3">
                <li>• Business verification required</li>
                <li>• App review process (2-4 weeks)</li>
                <li>• Limited availability in some regions</li>
                <li>• Requires TikTok for Developers account</li>
              </ul>
              <button
                onClick={connectRealTikTok}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
              >
                Try Real Connection
              </button>
            </div>
          )}

          {/* Demo Option */}
          {selectedOption === "demo" && (
            <div className="border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Demo Connection</h3>
              <p className="text-gray-400 text-sm mb-3">
                Simulate TikTok connection without real OAuth. Perfect for testing.
              </p>
              <button
                onClick={connectDemoTikTok}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:scale-[1.03] transition disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Continue with Demo"}
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Note: TikTok API access is restricted. Demo mode simulates the full user experience.
        </div>

        <button
          onClick={() => router.push("/creator")}
          className="text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}