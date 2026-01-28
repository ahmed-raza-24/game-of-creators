"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        setSession(session);
        setUser(session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const testRLS = async () => {
    try {
      // Test 1: Try to read users table
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .limit(5);

      console.log("Users query result:", { users, usersError });

      // Test 2: Try to insert a test campaign
      if (user) {
        const { data: campaign, error: campaignError } = await supabase
          .from("campaigns")
          .insert([
            {
              title: "Test Campaign",
              description: "Testing RLS",
              platform: "tiktok",
              budget: 100,
              brand_id: user.id,
            },
          ])
          .select();

        console.log("Campaign insert result:", { campaign, campaignError });
      }
    } catch (error) {
      console.error("RLS test error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auth & RLS Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>User:</strong> {user?.email || "Not logged in"}</p>
        <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
        <p><strong>Session:</strong> {session ? "Active" : "None"}</p>
      </div>

      <button
        onClick={testRLS}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test RLS Policies
      </button>
    </div>
  );
}