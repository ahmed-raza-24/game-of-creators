"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Wait for Supabase to process the OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          router.replace("/");
          return;
        }

        if (!session?.user) {
          console.log("No user found after OAuth");
          router.replace("/");
          return;
        }

        // Get role from URL
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get("role") || "creator";

        // Check if user exists in database
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", session.user.id)
          .single();

        // Create user if doesn't exist
        if (!existingUser) {
          await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email,
            role: role,
          });
        }

        // Redirect based on role
        router.replace(role === "brand" ? "/brand" : "/creator");
        
      } catch (error) {
        console.error("Callback error:", error);
        router.replace("/");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-gray-400">
      Logging you in...
    </main>
  );
}