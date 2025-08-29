"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  tags?: string[];
  difficulty?: string;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/is-authenticated", { credentials: "include" });
        const data = await res.json();
        if (!data.isAuthenticated) router.push("/login");
        else setLoading(false);
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🌟 Student Projects</h1>

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
              <button
    type="button"
    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
  >
    View Details →
  </button>
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
          </div>
        ))}
      </div>
    </div>
  );
}
