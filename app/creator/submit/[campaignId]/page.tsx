"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Campaign = {
  id: string;
  title: string;
  description: string;
  platform: string;
  budget?: number | null;
};

export default function SubmitEntryPage() {
  const { campaignId } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, []);

  async function fetchCampaign() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, title, description, platform, budget")
      .eq("id", campaignId)
      .single();

    if (error) {
      alert("Campaign not found");
      router.push("/creator");
    } else {
      setCampaign(data);
    }

    setPageLoading(false);
  }

  async function handleSubmit() {
    if (!url || !campaign) {
      alert("Please enter a post URL");
      return;
    }

    setLoading(true);

    // 🔹 Platform validation
    if (
      (campaign.platform === "tiktok" && !url.includes("tiktok.com")) ||
      (campaign.platform === "linkedin" && !url.includes("linkedin.com"))
    ) {
      alert(`Please submit a valid ${campaign.platform} URL`);
      setLoading(false);
      return;
    }

    // 🔹 2-day rule (demo)
    const diffInDays = 0; // demo pass
    if (diffInDays > 2) {
      alert("Only posts from last 2 days are allowed");
      setLoading(false);
      return;
    }

    // 1️⃣ Create submission
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          campaign_id: campaignId,
          creator_id: null, // auth later
          post_url: url,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Submission failed");
      setLoading(false);
      return;
    }

    // 2️⃣ Create metrics
    await supabase.from("metrics").insert([
      {
        submission_id: data.id,
        views: 0,
        likes: 0,
        comments: 0,
      },
    ]);

    setLoading(false);
    alert("Entry submitted successfully");
    router.push("/creator/submissions");
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#0b0b14] flex items-center justify-center text-gray-400">
        Loading campaign...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b14] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#121226] border border-purple-500/20 rounded-2xl p-8 shadow-xl">

        {/* Campaign Info */}
        {campaign && (
          <div className="mb-6 border border-purple-500/20 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white">
              {campaign.title}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {campaign.description}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Platform: {campaign.platform}
              </span>

              {campaign.budget !== null && campaign.budget !== undefined && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                  💰 {campaign.budget === 0 ? "Free" : `$${campaign.budget}`}
                </span>
              )}

            </div>
          </div>
        )}

        <input
          type="text"
          placeholder={`Paste your ${campaign?.platform} post URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-5 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold cursor-pointer hover:scale-[1.03] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Entry"}
        </button>

        <button
          onClick={() => router.push("/creator")}
          className="mt-4 w-full text-sm text-gray-500 hover:text-purple-400 underline"
        >
          ← Back to Creator Dashboard
        </button>
      </div>
    </main>
  );
}
