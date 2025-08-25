// app/upload/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function UploadProject() {
  const [form, setForm] = useState({
    title: "",
    domain: "",
    shortDescription: "",
    description: "",
    github: "",
    demo: "",
    tags: "",
    difficulty: "",
    status: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) formData.append("image", imageFile);

    await fetch("/api/projects", {
      method: "POST",
      body: formData,
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

      {/* Basic Inputs */}
      {[
        { name: "title", placeholder: "Project Title" },
        { name: "domain", placeholder: "Domain (AI, Web, IoT...)" },
        { name: "shortDescription", placeholder: "Short Description" },
        { name: "github", placeholder: "GitHub Repo Link" },
        { name: "demo", placeholder: "Live Demo Link (Optional)" },
        { name: "tags", placeholder: "Tags (comma separated: AI, Web, IoT...)" },
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

      {/* Difficulty */}
      <motion.select
        name="difficulty"
        className="w-full border p-3 rounded-xl text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        onChange={handleChange}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <option value="">Select Difficulty</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </motion.select>

      {/* Status */}
      <motion.select
        name="status"
        className="w-full border p-3 rounded-xl text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        onChange={handleChange}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <option value="">Select Status</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Planned">Planned</option>
      </motion.select>

      {/* Image Upload */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-2"
      >
        <label className="block text-gray-700 font-medium">Project Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-3 rounded-xl shadow-sm bg-white"
        />
        
{preview && (
  <div className="mt-2 w-full h-40 relative">
    <Image
      src={preview}
      alt="Preview"
      fill
      className="object-cover rounded-xl border shadow-sm"
    />
  </div>
)}
      </motion.div>

      {/* Description */}
      <motion.textarea
        name="description"
        placeholder="Full Project Description"
        className="w-full border p-3 rounded-xl text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows={4}
        onChange={handleChange}
        whileFocus={{ scale: 1.02 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}
      ></motion.textarea>

      {/* Submit */}
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
