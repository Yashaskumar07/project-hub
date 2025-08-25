"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  tags?: string[];
  difficulty?: string;
  likes?: string[];
  comments?: Comment[];
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // ✅ Protect HomePage (only logged-in users can see it)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/is-authenticated", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!data.isAuthenticated) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch {
        router.push("/login"); // removed unused `error`
      }
    };

    checkAuth();
  }, [router]);

  // ✅ Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }
    fetchProjects();
  }, []);

  // ✅ Handle Like
  const handleLike = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demoUser123" }), // Replace with logged-in userId
      });
      const data = await res.json();

      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId ? { ...p, likes: data.likesArray ?? p.likes } : p
        )
      );
    } catch (err) {
      console.error("Error liking project:", err);
    }
  };

  // ✅ Handle Comment
  const handleComment = async (projectId: string) => {
    const text = commentText[projectId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demoUser123", text }),
      });
      const data = await res.json();

      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId ? { ...p, comments: data.comments } : p
        )
      );

      setCommentText((prev) => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🌟 Student Projects</h1>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <Link
              href={`/projects/${project._id}`}
              className="block p-5 bg-white rounded-2xl shadow-md hover:bg-blue-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-black">{project.title}</h2>
              <p className="text-gray-600 mt-2">{project.shortDescription}</p>
              <span className="text-sm text-blue-600 mt-3 inline-block font-medium">
                View details →
              </span>
            </Link>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Difficulty */}
            {project.difficulty && (
              <div className="mt-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                  {project.difficulty}
                </span>
              </div>
            )}

            {/* Like Button */}
            <button
              onClick={() => handleLike(project._id)}
              className="mt-4 px-3 py-1 bg-blue-500 text-white rounded-lg"
            >
              👍 Like ({project.likes?.length || 0})
            </button>

            {/* Comment Input */}
            <div className="mt-4">
              <input
                type="text"
                value={commentText[project._id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [project._id]: e.target.value,
                  }))
                }
                placeholder="Add a comment..."
                className="border p-2 w-full rounded-md"
              />
              <button
                onClick={() => handleComment(project._id)}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                💬 Comment
              </button>

              {/* Comments List */}
              <ul className="mt-3 space-y-2">
                {project.comments?.map((c, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <strong>{c.userId}:</strong> {c.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
