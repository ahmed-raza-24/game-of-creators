// app/auth/callback/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const code = urlSearchParams.get('code');
        const error = urlSearchParams.get('error');
        
        if (error) {
          console.error("OAuth error:", error);
          router.push("/");
          return;
        }

        if (code) {
          const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (sessionError) {
            console.error("Session error:", sessionError);
            router.push("/");
            return;
          }

          if (session?.user) {
            // Check if user exists in database
            const { data: existingUser } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (!existingUser) {
              const role = searchParams.get("role") || "creator";
              await supabase
                .from("users")
                .insert([
                  {
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email,
                    role: role,
                  },
                ]);
            }

            // ✅ Correct redirect based on role
            const role = searchParams.get("role") || "creator";
            router.replace(role === "brand" ? "/brand" : "/creator");
          } else {
            router.push("/");
          }
        } else {
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
        <p className="text-gray-400">Loading...</p>
      </main>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}