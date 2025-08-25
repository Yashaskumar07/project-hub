"use client";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // ⚡ later: replace with session.user.id and session.user.email
  const userId = "12345";
  const email = "admin@gmail.com"; // <-- TEMP hardcoded for now

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/bookmarks?userId=${userId}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (projectId: string) => {
    try {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId, email }),
      });

      // ✅ Optimistic update
      setBookmarks((prev) => prev.filter((p) => p._id !== projectId));

      // ✅ let other tabs/pages refresh too
      window.dispatchEvent(new Event("bookmarksUpdated"));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();

    // ✅ refresh when bookmark changes
    const listener = () => fetchBookmarks();
    window.addEventListener("bookmarksUpdated", listener);

    return () => {
      window.removeEventListener("bookmarksUpdated", listener);
    };
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookmarks</h1>

        {loading ? (
          <p className="text-gray-500">Loading bookmarks...</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-500">No bookmarks yet.</p>
        ) : (
          <ul className="space-y-6">
            {bookmarks.map((project) => (
              <li
                key={project._id}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-blue-600">
                  {project.title}
                </h2>
                <p className="text-gray-700 mt-2">{project.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By <span className="font-medium">{project.author}</span>
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600">👍 {project.likes}</span>
                  <button
                    onClick={() => removeBookmark(project._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
