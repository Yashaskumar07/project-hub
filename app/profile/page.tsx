"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
}

interface Community {
  _id: string;
  name: string;
}

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const communities: Community[] = [
    { _id: "123", name: "AI Enthusiasts" },
    { _id: "456", name: "Web Developers" },
  ];

  // ✅ Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("userEmail"); // saved at login
        if (!email) return;
        const res = await fetch(`/api/profile?email=${email}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  // ✅ Join community
  const handleJoin = async (communityId: string) => {
    if (!user?._id) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }), // ✅ use real user ID
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Joined community!");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error joining community:", err);
      alert("Failed to join community. Try again later.");
    }
  };

  return (
  <div className="flex min-h-screen w-full bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white p-6 flex flex-col transform transition-transform duration-300 z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">👤 Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
  <Link href="/Dashboard" className="hover:bg-blue-600 p-2 rounded">
    📊 Dashboard
  </Link>
  <Link href="/projects" className="hover:bg-blue-600 p-2 rounded">
    🌍 Explore Projects
  </Link>
  <Link href="/my-projects" className="hover:bg-blue-600 p-2 rounded">
    💼 My Projects
  </Link>
  <Link href="/upload" className="hover:bg-blue-600 p-2 rounded">
    ⬆️ Upload Project
  </Link>

  {/* Communities */}
  <div className="mt-2">
    <p className="text-sm font-semibold text-gray-200 mb-1">👥 Communities</p>
    {communities.map((c) => (
      <div
        key={c._id}
        className="flex justify-between items-center hover:bg-blue-600 p-2 rounded"
      >
        <Link href={`/community/${c._id}`} className="flex-1">
          {c.name}
        </Link>
        <button
          onClick={() => handleJoin(c._id)}
          className="bg-green-500 text-white px-2 py-1 rounded ml-2 hover:bg-green-600"
        >
          Join
        </button>
      </div>
    ))}
  </div>

  
  <Link href="/bookmarks" className="hover:bg-blue-600 p-2 rounded">
    ⭐ Bookmarks
  </Link>
  
  <Link href="/logout" className="hover:bg-blue-600 p-2 rounded">
    🚪 Logout
  </Link>
</nav>

      </aside>

      {/* Main */}
      <main className="flex-1 w-full p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          <Menu className="h-5 w-5" /> Open Menu
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            User Information
          </h2>
          {user ? (
            <>
              <p className="mt-2 text-gray-600">
                📛 <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-gray-600">
                📧 <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                🚻 <span className="font-medium">Gender:</span> {user.gender}
              </p>
            </>
          ) : (
            <p className="text-gray-500 mt-2">Loading user info...</p>
          )}
        </div>
      </main>
    </div>
  );
}