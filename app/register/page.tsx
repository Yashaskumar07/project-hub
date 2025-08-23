"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
   
  });
  const [loading, setLoading] = useState(false); // Loader state

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) router.push("/login");
      
      else alert("Registration failed");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false); // Stop loader
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <form
  onSubmit={handleRegister}
  className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
>
  <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
    Register for Aushadhi Mitra
  </h2>

  <div className="mb-4">
    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
      Name
    </label>
    <input
      type="text"
      id="name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      required
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
      placeholder="Your Name"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
      Email
    </label>
    <input
      type="email"
      id="email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      required
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
      placeholder="you@example.com"
    />
  </div>

  <div className="mb-6">
    <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
      Password
    </label>
    <input
      type="password"
      id="password"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      required
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
      placeholder="••••••••"
    />
  </div>

  

  <div className="mb-4">
    <label htmlFor="gender" className="block text-sm font-medium mb-1 text-gray-700">
      Gender
    </label>
    <select
      id="gender"
      value={form.gender}
      onChange={(e) => setForm({ ...form, gender: e.target.value })}
      required
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <button
          type="submit"
          className={`w-full font-semibold py-2 px-4 rounded transition 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}