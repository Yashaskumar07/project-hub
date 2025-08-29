import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ make params a Promise
) {
  try {
    await connectToDB();

    const body = await req.json();
    const { userId } = body as { userId?: string };

    // Await the params promise
    const { id: communityId } = await context.params;

    // Validation
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    if (!mongoose.isValidObjectId(communityId))
      return NextResponse.json({ error: "Invalid community id" }, { status: 400 });
    if (!mongoose.isValidObjectId(userId))
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

    const community = await Community.findById(communityId);
    if (!community) return NextResponse.json({ error: "Community not found" }, { status: 404 });

    community.members ??= [];

    const alreadyMember = community.members.some(
  (m: mongoose.Types.ObjectId | string | undefined) => m?.toString() === userId
);

    if (!alreadyMember) {
      community.members.push(new mongoose.Types.ObjectId(userId));
      await community.save();
    }

    return NextResponse.json({
      success: true,
      joined: !alreadyMember,
      communityId,
    });
  } catch (err: unknown) {
    console.error("Join community error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}
