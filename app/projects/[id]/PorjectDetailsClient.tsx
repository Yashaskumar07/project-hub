"use client";

import { motion } from "framer-motion";

interface Project {
  _id: string;
  title: string;
  description: string;
  domain?: string;
  github?: string;
  demo?: string;
}

export default function ProjectDetailsClient({ project }: { project: Project }) {
  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {project.title}
      </motion.h1>

      {project.domain && (
        <motion.p
          className="text-gray-500 mt-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          📂 Domain: <span className="font-medium">{project.domain}</span>
        </motion.p>
      )}

      <motion.p
        className="mt-5 text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {project.description}
      </motion.p>

      <div className="mt-6 space-y-3">
        {project.github && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔗 GitHub Repo
          </motion.a>
        )}

        {project.demo && (
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Live Demo
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
