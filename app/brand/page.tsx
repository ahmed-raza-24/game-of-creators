"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Campaign = {
  id: string;
  title: string;
  platform: string;
  description: string;
};

export default function BrandPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [loading, setLoading] = useState(false);

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
  }

  async function createCampaign() {
    if (!title) {
      alert("Campaign title is required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("campaigns").insert([
      {
        title,
        description,
        platform,
        brand_id: null, // auth later
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error creating campaign");
      console.error(error);
    } else {
      setTitle("");
      setDescription("");
      fetchCampaigns();
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b14] p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          Brand Dashboard
        </h1>
        <p className="text-gray-400">
          Launch campaigns and collaborate with creators
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-8">
        {/* Create Campaign */}
        <div className="bg-[#121226] border border-purple-500/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">
            Create Campaign
          </h2>

          <input
            type="text"
            placeholder="Campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <textarea
            placeholder="Campaign description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:outline-none"
          >
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <button
            onClick={createCampaign}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.03] transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>

        {/* Campaign List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Your Campaigns
          </h2>

          {campaigns.length === 0 && (
            <p className="text-gray-500">No campaigns yet</p>
          )}

          <div className="grid gap-5">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-[#121226] border border-purple-500/20 rounded-2xl p-5 shadow"
              >
                <h3 className="text-lg font-semibold text-white">
                  {c.title}
                </h3>

                <p className="text-gray-400 mt-1 mb-3">
                  {c.description}
                </p>

                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Platform: {c.platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
