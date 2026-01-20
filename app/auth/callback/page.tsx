"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// IMPORTANT: Add these 2 lines at the top level
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const role = params.get("role");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          role: role ?? "creator",
        });
      }

      router.replace(role === "brand" ? "/brand" : "/creator");
    }

    handleCallback();
  }, [params, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
      Logging you in...
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense 
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
          Loading...
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}