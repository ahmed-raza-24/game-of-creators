// app/auth/callback/page.tsx - FIXED VERSION
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Main callback component
function AuthCallbackContent() {
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
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Session error:", sessionError);
            router.push("/");
            return;
          }

          if (session?.user) {
            // Log user info for debugging
            console.log("User authenticated:", {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name
            });

            // Check if user exists in our database
            const { data: existingUser, error: fetchError } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
              // PGRST116 = No rows found (user doesn't exist) - this is expected for new users
              console.error("Error checking user:", fetchError);
            }

            // If new user, insert into database
            if (!existingUser) {
              const role = searchParams.get("role") || "creator";
              
              console.log("Creating new user with role:", role);
              
              const userData = {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
                email: session.user.email,
                role: role,
              };
              
              console.log("User data to insert:", userData);

              const { error: insertError } = await supabase
                .from("users")
                .insert([userData]);

              if (insertError) {
                // Detailed error logging
                console.error("Insert error details:", {
                  message: insertError.message,
                  code: insertError.code,
                  details: insertError.details,
                  hint: insertError.hint
                });
                
                // Check if it's a duplicate key error
                if (insertError.code === '23505') {
                  console.log("User already exists, continuing...");
                } else {
                  alert(`Error creating user: ${insertError.message}`);
                  router.push("/");
                  return;
                }
              } else {
                console.log("User created successfully!");
              }
            }

            // Redirect based on role
            const role = searchParams.get("role") || existingUser?.role || "creator";
            console.log("Redirecting to:", role === "brand" ? "/brand" : "/creator");
            router.replace(role === "brand" ? "/brand" : "/creator");
          } else {
            console.log("No session found");
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
      } catch (error: any) {
        console.error("Auth callback error:", {
          message: error.message,
          stack: error.stack
        });
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

// Main page with Suspense
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