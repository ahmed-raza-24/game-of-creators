// app/components/SupabaseProvider.tsx - FIXED VERSION
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
    // 1. Check existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // ✅ REMOVED: Automatic redirect when user is on home page
      // ✅ REMOVED: Automatic logout when accessing protected pages
      // User ko home page pe bhi rehne do, wo khud click karega
      
      // ✅ ONLY THIS: If user NOT logged in and trying to access protected pages
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // ✅ ONLY logout event pe redirect karo
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
      
      // ✅ SIGNED_IN event pe automatic redirect hata do
      // User ko khud decide karne do kahin jana hai ya nahi
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <SupabaseContext.Provider value={{ user, loading, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);