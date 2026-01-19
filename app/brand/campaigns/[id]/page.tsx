"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  post_url: string;
  status: string;
  created_at: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  }[];
};

type Campaign = {
  id: string;
  title: string;
  description: string;
  platform: string;
};

export default function BrandCampaignDetailPage() {
    const router = useRouter();
  const { id } = useParams();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, []);

  async function fetchCampaignDetails() {
    setLoading(true);

    // 1️⃣ Fetch campaign
    const { data: campaignData } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    setCampaign(campaignData);

    // 2️⃣ Fetch submissions + metrics
    const { data: submissionsData } = await supabase
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
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });

    setSubmissions(submissionsData || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-gray-300">
        Loading campaign...
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-red-400">
        Campaign not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b1a] text-gray-200 p-8">
      {/* Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-400">
          {campaign.title}
        </h1>
        <p className="text-gray-400 mt-2">
          {campaign.description}
        </p>
        <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-[#1e1e3f] text-purple-300">
          Platform: {campaign.platform}
        </span>
        </div>

      {/* Submissions */}
      <h2 className="text-xl font-semibold mb-4 text-purple-300">
        Creator Submissions
      </h2>

      {submissions.length === 0 && (
        <p className="text-gray-400">
          No submissions yet
        </p>
      )}

      <div className="space-y-4">
        {submissions.map((s) => (
          <div
            key={s.id}
            className="bg-[#11112b] border border-purple-500/20 rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-2">
              <a
                href={s.post_url}
                target="_blank"
                className="text-purple-400 underline text-sm"
              >
                View Post
              </a>

              <span className="text-xs px-2 py-1 rounded bg-[#1e1e3f] text-gray-300">
                {s.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div className="bg-[#1a1a3a] rounded-lg p-3">
                <p className="text-xs text-gray-400">Views</p>
                <p className="text-lg font-bold text-purple-300">
                  {s.metrics[0]?.views ?? 0}
                </p>
              </div>

              <div className="bg-[#1a1a3a] rounded-lg p-3">
                <p className="text-xs text-gray-400">Likes</p>
                <p className="text-lg font-bold text-purple-300">
                  {s.metrics[0]?.likes ?? 0}
                </p>
              </div>

              <div className="bg-[#1a1a3a] rounded-lg p-3">
                <p className="text-xs text-gray-400">Comments</p>
                <p className="text-lg font-bold text-purple-300">
                  {s.metrics[0]?.comments ?? 0}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
              <div className="flex justify-end gap-3">
            <button
                onClick={() =>
                router.push("/brand")}
                  className="mt-8 text-sm text-gray-500 hover:text-purple-400 underline"
                >
                ← Brand Dashboard
            </button>
        </div>
    </main>
  );
}
