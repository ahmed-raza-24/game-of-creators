"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/supabaseClient"; // Updated import

export default function HomePage() {
  const router = useRouter();

  async function signIn(role: "creator" | "brand") {
    try {
      await signInWithGoogle(role);
    } catch (error) {
      alert("Login failed. Please try again.");
      console.error(error);
    }
  }

  return (
    <main className="bg-[#080812] text-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6d28d955,transparent_60%)]" />

        <div className="relative bg-[#121226]/80 backdrop-blur-xl border border-purple-500/30 p-10 rounded-3xl shadow-[0_0_60px_-15px rgba(168,85,247,0.6)] w-full max-w-md text-center">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Game of Creators
          </h1>

          <p className="text-gray-400 mb-8">
            Where creators & brands collaborate through performance-based campaigns.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => signIn("creator")}
              className="py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold transition hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] cursor-pointer"
            >
              Continue as Creator
            </button>

            <button
              onClick={() => signIn("brand")}
              className="py-3 rounded-xl bg-[#1e1e3f] text-purple-300 border border-purple-500/40 transition hover:scale-[1.05] hover:bg-purple-500/10 cursor-pointer"
            >
              Continue as Brand
            </button>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2
          className="text-4xl font-extrabold text-center mb-16"
          style={{
            color: "hcl(280 60% 60%)",
            textShadow: "0 0 25px rgba(168,85,247,0.6)",
          }}
        >
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Sign In",
              desc: "Login with Google as Creator or Brand.",
              color: "from-purple-500 to-indigo-500",
            },
            {
              title: "Collaborate",
              desc: "Brands launch campaigns, creators submit content.",
              color: "from-indigo-500 to-cyan-500",
            },
            {
              title: "Track Growth",
              desc: "Engagement & metrics tracked transparently.",
              color: "from-cyan-500 to-emerald-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-[#121226] rounded-3xl p-8 border border-purple-500/20 
              transition-all duration-500 hover:-translate-y-4 hover:rotate-[0.3deg]
              hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.7)]"
            >
              {/* Glow */}
              <div
                className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${item.color} blur-2xl -z-10`}
              />

              <h3 className="text-2xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="py-24 px-6 bg-[#0c0c1f]">
        <h2
          className="text-4xl font-extrabold text-center mb-16"
          style={{
            color: "hcl(280 60% 60%)",
            textShadow: "0 0 25px rgba(168,85,247,0.6)",
          }}
        >
          Choose Your Path
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Creator */}
          <div
            className="group relative bg-[#121226] rounded-3xl p-10 border border-purple-500/30
            transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_70px_-20px_rgba(168,85,247,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition rounded-3xl blur-xl -z-10" />

            <h3 className="text-3xl font-bold mb-6">
              🎯 Creators
            </h3>

            <ul className="space-y-3 text-gray-300 text-sm">
              <li>• Discover brand campaigns</li>
              <li>• Submit TikTok / LinkedIn content</li>
              <li>• Track views, likes & comments</li>
              <li>• Grow & earn through performance</li>
            </ul>
          </div>

          {/* Brand */}
          <div
            className="group relative bg-[#121226] rounded-3xl p-10 border border-indigo-500/30
            transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-cyan-600/30 opacity-0 group-hover:opacity-100 transition rounded-3xl blur-xl -z-10" />

            <h3 className="text-3xl font-bold mb-6">
              🚀 Brands
            </h3>

            <ul className="space-y-3 text-gray-300 text-sm">
              <li>• Launch creator campaigns</li>
              <li>• Define platform & budget</li>
              <li>• Review creator submissions</li>
              <li>• Measure real engagement</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </main>
  );
}