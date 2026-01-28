// app/components/SupabaseProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SupabaseContext = createContext<{
  user: any | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Agar user logged in hai aur home page par hai
      if (session?.user && pathname === "/") {
        // Temporary: sabko creator page par redirect
        router.push("/creator");
      }
      
      // Agar user NOT logged in aur protected page par hai
      if (!session?.user && 
          (pathname.startsWith("/creator") || 
           pathname.startsWith("/brand") || 
           pathname.startsWith("/admin"))) {
        router.push("/");
      }
    };

    checkSession();

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  return (
    <SupabaseContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);