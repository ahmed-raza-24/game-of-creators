"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  post_url: string;
  status: string;
  created_at: string;
  campaigns: {
    title: string;
    platform: string;
  }[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    last_refreshed_at: string;
  }[];
};


export default function CreatorSubmissionsPage() {
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
        campaigns (
          title,
          platform
        ),
        metrics (
          views,
          likes,
          comments,
          last_refreshed_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSubmissions(data || []);
    }

    setLoading(false);
  }
    async function refreshMetrics() {
        const { data: submissions, error } = await supabase
            .from("submissions")
            .select("id");

        if (error || !submissions) {
            alert("Failed to refresh metrics");
            return;
        }

        for (const sub of submissions) {
            await supabase
                .from("metrics")
                .update({
                    views: Math.floor(Math.random() * 1000),
                    likes: Math.floor(Math.random() * 300),
                    comments: Math.floor(Math.random() * 100),
                    last_refreshed_at: new Date(),
                })
                .eq("submission_id", sub.id);
        }

        alert("Metrics refreshed");
        fetchSubmissions(); // refresh UI
    }

  return (
    <main className="min-h-screen bg-[#0b0b14] p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          My Submissions
        </h1>
        <p className="text-gray-400">
          Track your submitted content and performance
        </p>
        <button
            onClick={refreshMetrics}
            className="mt-4 px-5 py-2 rounded-lg bg-[#1e1e3f] text-purple-300 border border-purple-500/30 hover:bg-[#26265a] transition"
        >
            Refresh Metrics (Demo)
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading && (
          <p className="text-gray-400">Loading submissions...</p>
        )}

        {!loading && submissions.length === 0 && (
          <p className="text-gray-500">
            You haven’t submitted anything yet.
          </p>
        )}

        <div className="grid gap-6">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-[#121226] border border-purple-500/20 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {s.campaigns?.[0]?.title}
                  </h2>
                  <span className="text-xs text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                    {s.campaigns?.[0]?.platform}
                  </span>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    s.status === "approved"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <a
                href={s.post_url}
                target="_blank"
                className="text-sm text-purple-400 underline break-all"
              >
                {s.post_url}
              </a>

              {s.metrics?.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div className="bg-[#0b0b14] p-3 rounded-lg">
                    <p className="text-white font-semibold">
                      {s.metrics[0].views}
                    </p>
                    <p className="text-xs text-gray-400">Views</p>
                  </div>

                  <div className="bg-[#0b0b14] p-3 rounded-lg">
                    <p className="text-white font-semibold">
                      {s.metrics[0].likes}
                    </p>
                    <p className="text-xs text-gray-400">Likes</p>
                  </div>

                  <div className="bg-[#0b0b14] p-3 rounded-lg">
                    <p className="text-white font-semibold">
                      {s.metrics[0].comments}
                    </p>
                    <p className="text-xs text-gray-400">Comments</p>
                  </div>
                </div>
              )}
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
