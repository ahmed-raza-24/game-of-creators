// lib/supabaseClient.ts - UPDATED FOR VERCEL
import { createClient } from "@supabase/supabase-js";

// Dynamic redirect URL for both local and Vercel
const getRedirectUrl = () => {
  // Server side (build time) - Vercel compatible
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback';
  }
  // Client side
  return `${window.location.origin}/auth/callback`;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// Helper function for OAuth
export const signInWithGoogle = async (role: "creator" | "brand") => {
  const redirectTo = getRedirectUrl();
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${redirectTo}?role=${role}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }
};