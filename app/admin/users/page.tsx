"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


type User = {
  id: string;
  name: string;
  role: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Fetch users
  async function fetchUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsers(data || []);
    }
  }

  // 🔹 Add user (creator / brand)
  async function addUser(role: "creator" | "brand") {
    setLoading(true);

    const { error } = await supabase.from("users").insert([
      {
        name: role === "creator" ? "New Creator" : "New Brand",
        role: role,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error adding user");
      console.error(error);
    } else {
      fetchUsers(); // refresh list
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Supabase Users
      </h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => addUser("creator")}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Creator
        </button>

        <button
          onClick={() => addUser("brand")}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Brand
        </button>
      </div>

      {/* Users list */}
      {users.length === 0 && <p>No users found</p>}

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border p-2 rounded">
            <strong>{u.name}</strong> — {u.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
