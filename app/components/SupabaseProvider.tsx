// app/components/SupabaseProvider.tsx - PERSISTENT LOGIN
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SupabaseContext = createContext<{
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check existing session - This persists across page reloads
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If user is logged in and tries to access home page, stay on home
      // They can click buttons to go to dashboard
      
      // If user NOT logged in and trying to access protected pages
      if (!session?.user && 
          (pathname.startsWith("/creator") || 
           pathname.startsWith("/brand") || 
           pathname.startsWith("/admin"))) {
        router.push("/");
      }
    };

    checkSession();

    // 2. Listen for auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // When user logs out, redirect to home
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
      
      // When user logs in, they stay on current page
      // They will navigate manually or we can redirect if on home
      if (event === "SIGNED_IN") {
        // If on home page, stay there - user can choose where to go
        // No automatic redirect
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Session will be cleared, user state will update via onAuthStateChange
    router.push("/");
  };

  return (
    <SupabaseContext.Provider value={{ user, loading, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);