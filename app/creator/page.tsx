"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type Campaign = {
  id: string;
  title: string;
  description: string;
  platform: string;
};

export default function CreatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiktokConnected, setTiktokConnected] = useState(false);

useEffect(() => {
  fetchCampaigns();
  checkTikTokConnection();

  const connected = searchParams.get("connected");
  if (connected === "tiktok") {
    checkTikTokConnection();
  }
}, [searchParams]);


  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCampaigns(data || []);
    setLoading(false);
  }

  async function checkTikTokConnection() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("creator_social_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "tiktok")
      .single();

    if (data) setTiktokConnected(true);
  }

  return (
    <main className="min-h-screen bg-[#0b0b14]">
      {/* 🔝 TOP BAR */}
      <div className="sticky top-0 z-20 bg-[#0b0b14]/90 backdrop-blur border-b border-purple-500/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Title */}
          <div>
            <h1
              className="text-2xl font-extrabold"
              style={{ color: "hcl(280 60% 60%)" }}
            >
              Creator Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Explore campaigns & submit your content
            </p>
          </div>

          {/* 🔗 CONNECT BUTTONS */}
          <div className="flex gap-3 items-center">
            {!tiktokConnected ? (
              <button
                onClick={() => router.push("/auth/tiktok/")}
                className="px-4 py-2 rounded-lg bg-[#121226] border border-purple-500/30 text-white hover:bg-purple-500/10 transition"
              >
                🎵 Connect TikTok (Demo)
              </button>
            ) : (
              <div className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-sm font-medium">
                ✅ TikTok Connected
              </div>
            )}

            <button
              onClick={() => router.push("/auth/linkedin")}
              className="px-4 py-2 rounded-lg bg-[#121226] border border-purple-500/30 text-white hover:bg-purple-500/10 transition"
            >
              💼 Connect LinkedIn
            </button>

            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-400 hover:text-purple-400 underline ml-2"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        {loading && <p className="text-gray-400">Loading campaigns...</p>}

        {!loading && campaigns.length === 0 && (
          <p className="text-gray-500">No campaigns available</p>
        )}

        <div className="grid gap-6">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-[#121226] border border-purple-500/20 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-1">
                {c.title}
              </h2>

              <p className="text-gray-400 mb-3">
                {c.description}
              </p>

              <span className="inline-block mb-4 text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Platform: {c.platform}
              </span>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    router.push(`/creator/submit/${c.id}`)
                  }
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.03] transition"
                >
                  Submit Entry
                </button>

                <button
                  onClick={() =>
                    router.push(`/creator/submissions/${c.id}`)
                  }
                  className="px-5 py-2 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:scale-[1.03] transition"
                >
                  View My Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
