import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Posts";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    await connectToDB();

    const { content, userId } = await req.json();
    const { id: communityId } = await context.params; // await the params promise

    const community = await Community.findById(communityId);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Only allow members to post
    const isMember = community.members.some(
      (m: mongoose.Types.ObjectId | string | undefined) => m?.toString() === userId
    );

    if (!isMember) {
      return NextResponse.json({ error: "Join community to post" }, { status: 403 });
    }

    const newPost = new Post({
      content,
      createdBy: userId,
      community: communityId,
    });

    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (err: unknown) {
    console.error("POST CREATION ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    await connectToDB();

    const { id: communityId } = await context.params; // await the params promise

    const posts = await Post.find({ community: communityId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (err: unknown) {
    console.error("FETCH POSTS ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}
