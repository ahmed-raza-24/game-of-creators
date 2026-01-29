// app/auth/callback/page.tsx - FIXED FOR PKCE
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the current URL hash and search parameters
        const hash = window.location.hash;
        const urlSearchParams = new URLSearchParams(window.location.search);
        const code = urlSearchParams.get('code');
        const error = urlSearchParams.get('error');

        if (error) {
          console.error("OAuth error:", error);
          router.push("/");
          return;
        }

        // Check if we have a code in URL (OAuth callback)
        if (code || hash.includes('access_token')) {
          // Let Supabase handle the OAuth callback automatically
          // It will read the code from URL and exchange it for session
          // Let Supabase handle the callback
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          const session = data?.session;

          if (sessionError) {
            console.error("Session error:", sessionError);
            router.push("/");
            return;
          }

          if (session?.user) {
            // Check if user exists in our database
            const { data: existingUser } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            // If new user, insert into database
            if (!existingUser) {
              const role = searchParams.get("role") || "creator";
              const { error: insertError } = await supabase
                .from("users")
                .insert([
                  {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email,
                    role: role,
                  },
                ]);

              if (insertError) {
                console.error("Error inserting user:", insertError);
              }
            }

            // Redirect based on role
            const role = searchParams.get("role") || existingUser?.role || "creator";
            router.replace(role === "brand" ? "/brand" : "/creator");
          } else {
            router.push("/");
          }
        } else {
          // No OAuth code, check existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const role = searchParams.get("role") || "creator";
            router.replace(role === "brand" ? "/brand" : "/creator");
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/");
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
      <p className="text-gray-400">Authenticating...</p>
    </main>
  );
}