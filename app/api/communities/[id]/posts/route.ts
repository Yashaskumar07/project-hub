import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Posts";

interface Context {
  params: {
    id: string; // communityId
  };
}

export async function POST(req: Request, { params }: Context) {
  try {
    await connectToDB();
    const { content, userId } = await req.json();

    const community = await Community.findById(params.id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // ✅ Only allow members to post
    if (!community.members.includes(userId)) {
      return NextResponse.json({ error: "Join community to post" }, { status: 403 });
    }

    const newPost = new Post({
      content,
      createdBy: userId,
      community: params.id,
    });

    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST CREATION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: Context) {
  try {
    await connectToDB();
    const posts = await Post.find({ community: params.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("FETCH POSTS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
