"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      router.replace("/creator");
      return;
    }

    // 🔹 Demo flow (real app me yahan token exchange hota)
    console.log("LinkedIn OAuth code:", code);

    router.replace("/creator");
  }, [router, params]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
      Connecting your LinkedIn account...
    </main>
  );
}
