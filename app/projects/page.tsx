// app/projects/page.tsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ✅ Define a type for Project
interface Project {
  _id: string;
  title: string;
  shortDescription?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data: Project[] = await res.json(); // ✅ typed response
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Heading with animation */}
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🚀 Uploaded Projects
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {projects.length === 0 && (
          <motion.p
            className="text-gray-600 col-span-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects uploaded yet.
          </motion.p>
        )}

        {projects.map((project) => (
          <motion.div
            key={project._id.toString()}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
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
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => router.back()}
          className="bg-white hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg shadow transition duration-200"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
