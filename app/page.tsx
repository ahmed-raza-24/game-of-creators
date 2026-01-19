"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  async function signIn(role: "creator" | "brand") {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?role=${role}`,
      },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
      <div className="bg-[#121226] border border-purple-500/20 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        
        {/* Title */}
        <h1
          className="text-3xl font-extrabold mb-3"
          style={{ color: "hcl(280 60% 60%)" }}
        >
          Game of Creators
        </h1>

        <p className="text-gray-400 mb-8">
          Choose how you want to continue
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => signIn("creator")}
            className="py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition"
          >
            Continue as Creator
          </button>

          <button
            onClick={() => signIn("brand")}
            className="py-3 rounded-lg bg-[#1e1e3f] text-purple-300 border border-purple-500/30 hover:bg-[#26265a] transition"
          >
            Continue as Brand
          </button>
        </div>
      </div>
    </main>
  );
}
