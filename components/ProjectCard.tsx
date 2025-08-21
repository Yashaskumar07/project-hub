// components/ProjectCard.tsx
"use client";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    domain: string;
    shortDescription: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <h2 className="text-lg font-semibold">{project.title}</h2>
      <p className="text-sm text-gray-600">Domain: {project.domain}</p>
      <p className="text-gray-500 text-sm mt-2">{project.shortDescription}</p>

      <button
        onClick={() => router.push(`/projects/${project._id}`)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
}
