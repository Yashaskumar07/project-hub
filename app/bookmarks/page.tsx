"use client";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  author: string;
  likes?: number | string[]; // likes can be a number or array of userIds (as strings)
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/bookmarks");
      if (!res.ok) {
        throw new Error(`Failed to fetch bookmarks: ${res.status}`);
      }

      const data: Project[] = await res.json();
      setBookmarks(data);
    } catch (err: unknown) {
      console.error("Error fetching bookmarks:", err);
      setError("Could not load bookmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (projectId: string) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to remove bookmark: ${res.status}`);
      }

      // Optimistic update
      setBookmarks((prev) => prev.filter((p) => p._id !== projectId));

      // Notify other tabs/pages
      window.dispatchEvent(new Event("bookmarksUpdated"));
    } catch (err: unknown) {
      console.error("Error removing bookmark:", err);
      setError("Could not remove bookmark. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookmarks();

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

        {loading && <p className="text-gray-500">Loading bookmarks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {bookmarks.length === 0 ? (
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
                      <span className="text-gray-600">
                        👍{" "}
                        {Array.isArray(project.likes)
                          ? project.likes.length
                          : project.likes || 0}
                      </span>
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
          </>
        )}
      </div>
    </main>
  );
}
