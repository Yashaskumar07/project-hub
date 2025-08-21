"use client";
import React, { useEffect, useState } from "react";
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🌟 Student Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
           key={project._id}
  href={`/projects/${project._id}`}
  className="block bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
>
            <h2 className="text-xl font-semibold text-black">{project.title}</h2>
  <p className="text-gray-600 mt-2">
    {project.shortDescription || project.description?.slice(0, 100) + "..."}
  </p>

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

            {/* View Details CTA */}
            <span className="text-sm text-blue-600 mt-4 inline-block">
              View details →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
