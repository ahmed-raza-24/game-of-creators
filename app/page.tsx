"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
      <div className="bg-[#121226] border border-purple-500/20 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        
        {/* Title */}
        <h1
          className="text-3xl font-extrabold mb-3"
          style={{
            color: "hcl(280 60% 60%)",
          }}
        >
          Game of Creators
        </h1>

        <p className="text-gray-400 mb-8">
          Choose how you want to continue
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/creator")}
            className="py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition"
          >
            I&apos;m a Creator
          </button>

          <button
            onClick={() => router.push("/brand")}
            className="py-3 rounded-lg bg-[#1e1e3f] text-purple-300 border border-purple-500/30 hover:bg-[#26265a] transition"
          >
            I&apos;m a Brand
          </button>


          {/* <button
            onClick={() => router.push("/admin/users")}
            className="mt-2 text-xs text-gray-500 hover:text-purple-400 underline"
          >
            Admin / Test Users
          </button> */}
        </div>
      </div>
    </main>
  );
}
