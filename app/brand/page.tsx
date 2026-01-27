"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Campaign = {
  id: string;
  title: string;
  description: string;
  platform: string;
  budget: number;
};

export default function BrandPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [budget, setBudget] = useState<number | "">("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCampaigns(data || []);
  }

  async function createCampaign() {
    if (!title || !budget) {
      alert("Title & budget required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("campaigns").insert([
      {
        title,
        description,
        platform,
        budget,
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
      setBudget("");
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

        <div className="flex justify-end">
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-sm text-gray-500 hover:text-purple-400 underline cursor-pointer"
          >
            ← Back to Home
          </button>

          {/* ✅ LOGOUT BUTTON ADDED */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="mt-6 ml-4 text-sm text-red-400 hover:text-red-300 underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid gap-10">
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
            className="w-full mb-3 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:ring-2 focus:ring-purple-600"
          />

          <textarea
            placeholder="Campaign description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:ring-2 focus:ring-purple-600"
          />

          <input
            type="number"
            placeholder="Budget ($)"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full mb-3 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30 focus:ring-2 focus:ring-purple-600"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full mb-5 p-3 rounded-lg bg-[#0b0b14] text-white border border-purple-500/30"
          >
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <button
            onClick={createCampaign}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.03] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>

        {/* Your Campaigns */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Your Campaigns
          </h2>

          {campaigns.length === 0 && (
            <p className="text-gray-500">No campaigns yet</p>
          )}

          <div className="flex flex-col gap-6">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-[#121226] border border-purple-500/20 rounded-2xl p-6 shadow"
              >
                <h3 className="text-xl font-semibold text-white">
                  {c.title}
                </h3>

                <p className="text-gray-400 mt-1">
                  {c.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    Platform: {c.platform}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                    Budget: ${c.budget}
                  </span>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => router.push(`/brand/campaigns/${c.id}`)}
                    className="text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}