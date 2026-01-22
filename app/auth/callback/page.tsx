"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function handleAuth() {
      const role = params.get("role") ?? "creator";

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      // ensure user exists in public.users
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          role,
        });
      }

      // ✅ FINAL REDIRECT
      router.replace(role === "brand" ? "/brand" : "/creator");
    }

    handleAuth();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
      Logging you in...
    </main>
  );
}
