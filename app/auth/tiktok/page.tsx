"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TikTokConnectDemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    const { data, error } = await supabase
      .from("creator_social_accounts")
      .upsert(
        {
          user_id: user.id,
          provider: "tiktok",
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
      router.push("/creator");
    }
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

        <p className="text-gray-400 text-sm mb-6">
          TikTok login is restricted in some regions.
          This is a <span className="text-purple-300">demo connection</span> to
          showcase the full flow.
        </p>

        <button
          onClick={connectDemoTikTok}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.03] transition disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Continue (Demo)"}
        </button>

        <button
          onClick={() => router.push("/creator?connected=tiktok")}
          className="mt-4 text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}
