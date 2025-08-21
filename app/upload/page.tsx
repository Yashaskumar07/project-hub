// app/upload/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function UploadProject() {
  const [form, setForm] = useState({
    title: "",
    domain: "",
    shortDescription: "",
    description: "",
    github: "",
    demo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("✅ Project uploaded!");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-lg space-y-4"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center text-blue-700"
      >
        🚀 Upload Your Project
      </motion.h1>

      {[
        { name: "title", placeholder: "Project Title" },
        { name: "domain", placeholder: "Domain (AI, Web, IoT...)" },
        { name: "shortDescription", placeholder: "Short Description" },
        { name: "github", placeholder: "GitHub Repo Link" },
        { name: "demo", placeholder: "Live Demo Link (Optional)" },
      ].map((field, idx) => (
        <motion.input
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          className="w-full border p-3 rounded-xl text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
          whileFocus={{ scale: 1.02 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * idx }}
        />
      ))}

      <motion.textarea
        name="description"
        placeholder="Full Project Description"
        className="w-full border p-3 rounded-xl text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows={4}
        onChange={handleChange}
        whileFocus={{ scale: 1.02 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      ></motion.textarea>

      <motion.button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Upload 🚀
      </motion.button>
    </motion.form>
  );
}
