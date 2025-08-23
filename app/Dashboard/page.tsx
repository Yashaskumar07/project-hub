"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router

type Project = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
};

type Activity = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    }

    async function fetchActivities() {
      try {
        const res = await fetch("/api/projects"); // Ensure this endpoint is correct
        const data = await res.json();

        // Check if the response is an array
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error("Expected an array but got:", data);
          setActivities([]); // Set to an empty array if the response is not as expected
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]); // Set to an empty array on error
      }
    }

    fetchProjects();
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📊 Dashboard Overview</h1>

      {/* Quick Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-start">
          <h2 className="text-gray-500">Total Projects</h2>
          <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-start">
          <h2 className="text-gray-500">Collaborators</h2>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-start">
          <h2 className="text-gray-500">Comments</h2>
          <p className="text-2xl font-bold text-purple-600">45</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-start">
          <h2 className="text-gray-500">Likes</h2>
          <p className="text-2xl font-bold text-pink-600">78</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🕒 Recent Activity</h2>
        <ul className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
          <li
  key={activity._id}
  className="flex flex-col gap-2 p-4 rounded-2xl shadow-sm bg-white border border-gray-200 hover:shadow-md transition"
>
  <div className="flex justify-between items-center">
    <span className="text-gray-700 text-sm md:text-base">
      <span className="font-semibold text-blue-600">{activity.title}</span>
      <span className="text-gray-500"> — {activity.description}</span>
    </span>
    <span className="text-xs text-gray-400">{activity.createdAt}</span>
  </div>

  <div className="flex flex-wrap gap-2">
    {activity.tags?.map((tag: string, idx: number) => (
      <span
        key={idx}
        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium"
      >
        {tag}
      </span>
    ))}
  </div>
</li>

            ))
          ) : (
            <li className="text-gray-500">No recent activity</li>
          )}
        </ul>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-full shadow-lg transition-all flex items-center gap-2"
      >
        ⬅ Back
      </button>
    </div>
  );
}
