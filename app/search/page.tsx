"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Link from "next/link"

export default function SearchPage() {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    const res = await fetch(`/api/projects/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl  font-bold mb-4">🔍 Project Search</h1>
      <SearchBar onSearch={handleSearch} />

<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {results.map((project) => (
    <div
      key={project._id}
      className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
      <p className="text-gray-700 text-sm mb-3">{project.description}</p>
      
      <p className="text-blue-600 font-medium text-sm mb-3">
        Difficulty: <span className="text-blue-800">{project.difficulty}</span>
      </p>

      <div className="flex gap-2 flex-wrap">
        {project.tags?.map((tag: string, i: number) => (
          <span
            key={i}
            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Link to project details */}
      <Link href={`/projects/${project._id}`}>
        <span className="inline-block mt-4 text-blue-600 font-medium hover:underline">
          View Details →
        </span>
      </Link>
    </div>
  ))}
</div>
    </div>
  );
}
