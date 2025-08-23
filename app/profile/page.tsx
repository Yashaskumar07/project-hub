"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface User {
  name: string;
  email: string;
  gender: string;
}

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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



  return (
    <div className="flex min-h-screen bg-gray-100">
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
          <a href="/Dashboard" className="hover:bg-blue-600 p-2 rounded">📊 Dashboard</a>
          <a href="/projects" className="hover:bg-blue-600 p-2 rounded">🌍 Explore Projects</a>
          <a href="/my-projects" className="hover:bg-blue-600 p-2 rounded">💼 My Projects</a>
          <a href="/upload" className="hover:bg-blue-600 p-2 rounded">⬆️ Upload Project</a>
          <a href="/communities" className="hover:bg-blue-600 p-2 rounded">👥 Communities</a>
          <a href="/discussions" className="hover:bg-blue-600 p-2 rounded">💬 Discussions</a>
          <a href="/bookmarks" className="hover:bg-blue-600 p-2 rounded">⭐ Bookmarks</a>
          <a href="/notifications" className="hover:bg-blue-600 p-2 rounded">🔔 Notifications</a>
          <a href="/profile" className="hover:bg-blue-600 p-2 rounded">👤 Profile</a>
          <a href="/logout" className="hover:bg-blue-600 p-2 rounded">🚪 Logout</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          <Menu className="h-5 w-5" /> Open Menu
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
          {user ? (
            <>
              <p className="mt-2 text-gray-600">📛 <span className="font-medium">Name:</span> {user.name}</p>
              <p className="text-gray-600">📧 <span className="font-medium">Email:</span> {user.email}</p>
              <p className="text-gray-600">🚻 <span className="font-medium">Gender:</span> {user.gender}</p>
            </>
          ) : (
            <p className="text-gray-500 mt-2">Loading user info...</p>
          )}
        </div>
      </main>
    </div>
  );
}
