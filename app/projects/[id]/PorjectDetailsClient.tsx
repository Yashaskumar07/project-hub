"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  domain?: string;
  github?: string;
  demo?: string;
  image?: string; // ✅ add image field
}

export default function ProjectDetailsClient({ project }: { project: Project }) {
  const [bookmarked, setBookmarked] = useState(false);

  // ⚡ later: replace with session.user.id / session.user.email
  const userId = "12345";
  const email = "admin@gmail.com";

  // ✅ Check if this project is already bookmarked on mount
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const res = await fetch(
          `/api/bookmarks?userId=${userId}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookmarked(data.includes(project._id));
        }
      } catch (err) {
        console.error("Error checking bookmark:", err);
      }
    };

    fetchBookmarkStatus();
  }, [project._id]);

  const handleBookmark = async () => {
    const method = bookmarked ? "DELETE" : "POST";
    const res = await fetch("/api/bookmarks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, projectId: project._id, email }),
    });

    const data = await res.json();
    if (data.success) {
      setBookmarked(!bookmarked);

      // ✅ trigger global refresh for BookmarksPage
      window.dispatchEvent(new Event("bookmarksUpdated"));
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ✅ Image Preview */}
      {project.image && (
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        />
      )}

      {/* Title + Bookmark */}
      <div className="flex items-center justify-between">
        <motion.h1
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {project.title}
        </motion.h1>

        {/* ✅ Bookmark Button */}
        <motion.button
          onClick={handleBookmark}
          className={`px-3 py-1 rounded-lg shadow text-sm font-medium transition ${
            bookmarked ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-800"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </motion.button>
      </div>

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
