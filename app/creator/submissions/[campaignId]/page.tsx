"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Submission = {
  id: string;
  post_url: string;
  status: string;
  created_at: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  } | null;
};

export default function CreatorSubmissionsPage() {
  const { campaignId } = useParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from("submissions")
      .select(`
        id,
        post_url,
        status,
        created_at,
        metrics (
          views,
          likes,
          comments
        )
      `)
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      // metrics array ko single object me convert
      const formatted = (data || []).map((s: any) => ({
        ...s,
        metrics: s.metrics?.[0] || null,
      }));
      setSubmissions(formatted);
    }

    setLoading(false);
  }

  async function refreshMetrics() {
    for (const s of submissions) {
      await supabase
        .from("metrics")
        .update({
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 300),
          comments: Math.floor(Math.random() * 100),
          last_refreshed_at: new Date(),
        })
        .eq("submission_id", s.id);
    }

    fetchSubmissions();
  }

  return (
    <main className="min-h-screen bg-[#0b0b14] p-6">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-3xl font-extrabold mb-6"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          My Submissions
        </h1>

        <button
          onClick={refreshMetrics}
          className="mb-6 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
        >
          Refresh Metrics
        </button>

        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && submissions.length === 0 && (
          <p className="text-gray-500">No submissions yet</p>
        )}

              <div className="grid gap-6">
                  {submissions.map((s) => (
                      <div
                          key={s.id}
                          className="bg-[#121226] border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/10 transition"
                      >
                          {/* Top row */}
                          <div className="flex items-center justify-between mb-4">
                              <p className="text-xs text-gray-400">
                                  📅 {new Date(s.created_at).toLocaleString()}
                              </p>

                              <span
                                  className={`text-xs px-3 py-1 rounded-full border ${s.status === "approved"
                                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                      }`}
                              >
                                  {s.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                              </span>
                          </div>

                          {/* Post link */}
                          <a
                              href={s.post_url}
                              target="_blank"
                              className="block mb-4 text-sm text-purple-400 underline break-all hover:text-purple-300 transition"
                          >
                              🔗 View Submitted Post
                          </a>

                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-[#0b0b14] p-3 rounded-xl">
                                  <p className="text-xl font-bold text-white">
                                      {s.metrics?.views ?? 0}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                      👁 Views
                                  </p>
                              </div>

                              <div className="bg-[#0b0b14] p-3 rounded-xl">
                                  <p className="text-xl font-bold text-white">
                                      {s.metrics?.likes ?? 0}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                      ❤️ Likes
                                  </p>
                              </div>

                              <div className="bg-[#0b0b14] p-3 rounded-xl">
                                  <p className="text-xl font-bold text-white">
                                      {s.metrics?.comments ?? 0}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                      💬 Comments
                                  </p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

        <button
          onClick={() => router.push("/creator")}
          className="mt-8 text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}
