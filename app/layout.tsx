// app/layout.tsx - QUICK FIX
"use client"; // ADD THIS

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabaseClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && pathname === "/") {
        router.push("/creator");
      }
      
      if (!session?.user && 
          (pathname.startsWith("/creator") || 
           pathname.startsWith("/brand"))) {
        router.push("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && pathname === "/") {
          router.push("/creator");
        }
        if (event === "SIGNED_OUT") {
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}