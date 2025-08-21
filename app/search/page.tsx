"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function SearchPage() {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    const res = await fetch(`/api/projects/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Project Search</h1>
      <SearchBar onSearch={handleSearch} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((project) => (
          <div key={project._id} className="border p-4 rounded-lg shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>
            <p className="text-xs text-blue-600 mt-2">Difficulty: {project.difficulty}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {project.tags?.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
