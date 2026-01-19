"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role"); // creator | brand

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    // 1️⃣ Get logged in user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Auth error:", error);
      router.push("/");
      return;
    }

    // 2️⃣ Check if user exists in public.users
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    // 3️⃣ If not exists → insert
    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        role: role, // creator | brand
      });

      if (insertError) {
        console.error("User insert failed:", insertError);
        return;
      }
    }

    // 4️⃣ Redirect based on role
    if (role === "creator") {
      router.push("/creator");
    } else if (role === "brand") {
      router.push("/brand");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
      Logging you in...
    </main>
  );
}
