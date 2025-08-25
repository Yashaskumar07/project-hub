"use client";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  content: string;
  createdBy?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

export default function CommunityPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // null until loaded

  // ✅ fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile"); // adjust to your auth endpoint
        if (!res.ok) return;
        const user = await res.json();
        setUserId(user._id); // or user.id depending on your schema
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ fetch posts
  useEffect(() => {
    fetch(`/api/communities/${id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data as Post[]);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts as Post[]);
        } else {
          setPosts([]);
        }
      })
      .catch(() => setPosts([]));
  }, [id]);

  const handlePost = async () => {
    if (!userId) {
      alert("You must be logged in to post.");
      return;
    }

    const res = await fetch(`/api/communities/${id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId }),
    });

    if (res.ok) {
      const data = await res.json();
      const newPost: Post = data.post ?? data;
      setPosts([newPost, ...posts]);
      setContent("");
    } else {
      alert("Join community before posting!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Community {id}</h1>

      {/* Post form */}
      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          className="w-full border rounded-lg p-2"
        />
        <button
          onClick={handlePost}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          disabled={!userId} // disable until user loads
        >
          Post
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded-lg shadow">
            <p className="font-semibold">
              {post.createdBy?.name ?? "Anonymous"}
            </p>
            <p>{post.content}</p>
            <small className="text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
