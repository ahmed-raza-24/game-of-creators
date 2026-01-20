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
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);


  useEffect(() => {
    fetchSubmissions();

    // load last refresh time from localStorage
    const saved = localStorage.getItem("metrics_last_refresh");
    if (saved) setLastRefresh(Number(saved));
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

    if (!error) {
      const formatted = (data || []).map((s: any) => ({
        ...s,
        metrics: s.metrics?.[0] || null,
      }));
      setSubmissions(formatted);
    }

    setLoading(false);
  }

  async function refreshMetrics() {
    const now = Date.now();

    if (lastRefresh && now - lastRefresh < 30 * 60 * 1000) {
      const remainingMs = 30 * 60 * 1000 - (now - lastRefresh);
      const remainingMin = Math.ceil(remainingMs / 60000);

      setToast(`⏳ You can refresh metrics after ${remainingMin} minutes`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

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

    localStorage.setItem("metrics_last_refresh", String(now));
    setLastRefresh(now);

    setToast("✅ Metrics refreshed successfully");
    setTimeout(() => setToast(null), 3000);

    fetchSubmissions();
  }


  const refreshDisabled =
    !!lastRefresh && Date.now() - lastRefresh < 30 * 60 * 1000;


  return (
    <main className="min-h-screen bg-[#0b0b14] p-6">
      <div className="max-w-6xl mx-auto">

        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#121226] border border-purple-500/30 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in">
            {toast}
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "hcl(280 60% 60%)" }}
          >
            My Submissions
          </h1>

          {/* 🔄 REFRESH BUTTON (RIGHT SIDE) */}
          <button
            onClick={refreshMetrics}
            disabled={refreshDisabled}
            className={`px-5 py-2 rounded-lg font-semibold transition cursor-pointer ${refreshDisabled
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.05]"
              }`}
          >
            🔄 Refresh Metrics
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && submissions.length === 0 && (
          <p className="text-gray-500">No submissions yet</p>
        )}

        <div className="flex flex-col gap-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-6 bg-[#121226] border border-purple-500/20 rounded-xl p-4 hover:shadow-purple-500/10 transition"
            >
              {/* LEFT INFO */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">
                  📅 {new Date(s.created_at).toLocaleString()}
                </p>

                <a
                  href={s.post_url}
                  target="_blank"
                  className="text-sm text-purple-400 underline break-all hover:text-purple-300 transition"
                >
                  🔗 View Submitted Post
                </a>

                <span
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-full border ${s.status === "approved"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    }`}
                >
                  {s.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                </span>
              </div>

              {/* RIGHT METRICS */}
              <div className="flex gap-6 text-center">
                <Metric label="👁" value={s.metrics?.views ?? 0} />
                <Metric label="❤️" value={s.metrics?.likes ?? 0} />
                <Metric label="💬" value={s.metrics?.comments ?? 0} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/creator")}
          className="mt-10 text-sm text-gray-500 hover:text-purple-400 underline cursor-pointer"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}

/* 🔹 Small metric card */
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#0b0b14] p-4 rounded-xl">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
