// "use client";

// import { useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function AuthCallback() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const role = searchParams.get("role") || "creator";

//   useEffect(() => {
//     async function syncUser() {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) return;

//       const user = session.user;

//       // 🔹 check if user already exists
//       const { data: existingUser } = await supabase
//         .from("users")
//         .select("id")
//         .eq("id", user.id)
//         .single();

//       // 🔹 insert if first login
//       if (!existingUser) {
//         await supabase.from("users").insert({
//           id: user.id,
//           name: user.user_metadata?.full_name || "New User",
//           role: role,
//         });
//       }

//       // 🔹 redirect by role
//       if (role === "brand") {
//         router.replace("/brand");
//       } else {
//         router.replace("/creator");
//       }
//     }

//     syncUser();
//   }, [role]);

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-[#0b0b14]">
//       <p className="text-gray-400">Setting up your account...</p>
//     </main>
//   );
// }
