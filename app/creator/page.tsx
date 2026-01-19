"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Campaign = {
  id: string;
  title: string;
  description: string;
  platform: string;
};

export default function CreatorPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCampaigns(data || []);
    }
    setLoading(false);
  }

  async function refreshMetrics() {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("id");

    if (!submissions) return;

    for (const sub of submissions) {
      await supabase
        .from("metrics")
        .update({
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 200),
          comments: Math.floor(Math.random() * 50),
          last_refreshed_at: new Date(),
        })
        .eq("submission_id", sub.id);
    }

    alert("Metrics refreshed (demo)");
  }

  return (
    <main className="min-h-screen bg-[#0b0b14] p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          Creator Dashboard
        </h1>
        <p className="text-gray-400">
          Explore brand campaigns and submit your content
        </p>
        <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    router.push("/")
                  }
                  className="mt-8 text-sm text-gray-500 hover:text-purple-400 underline"
                >
                  ← Back to Home
                </button>
          </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading && (
          <p className="text-gray-400">Loading campaigns...</p>
        )}

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
