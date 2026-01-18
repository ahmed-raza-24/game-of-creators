"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitEntryPage() {
  const { campaignId } = useParams();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!url) {
      alert("Please enter a post URL");
      return;
    }

    setLoading(true);

    // 🔹 Fetch campaign platform
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("platform")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      alert("Campaign not found");
      setLoading(false);
      return;
    }

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
    const now = new Date();
    const postDate = new Date(); // demo assumption

    const diffInDays =
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);

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
      setLoading(false);
      alert("Submission failed");
      console.error(error);
      return;
    }

    // 2️⃣ Create metrics
    const { error: metricsError } = await supabase.from("metrics").insert([
      {
        submission_id: data.id,
        views: 0,
        likes: 0,
        comments: 0,
      },
    ]);

    setLoading(false);

    if (metricsError) {
      alert("Submission saved but metrics failed");
      console.error(metricsError);
    } else {
      alert("Entry submitted successfully");
      router.push("/creator");
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b14] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#121226] border border-purple-500/20 rounded-2xl p-8 shadow-xl">
        <h1
          className="text-2xl font-extrabold mb-2 text-center"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          Submit Your Entry
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Paste your TikTok or LinkedIn post link
        </p>

        <input
          type="text"
          placeholder="https://www.tiktok.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-5 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.03] transition disabled:opacity-50"
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
