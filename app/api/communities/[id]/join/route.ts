// app/api/communities/[id]/join/route.ts
import { NextResponse } from "next/server";
import {connectToDB} from "@/lib/mongodb";
import Community from "@/models/Community";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();

    const { userId } = await req.json(); // frontend should send { userId }
    const { id } = params;

    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({ message: "Community not found" }, { status: 404 });
    }

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    return NextResponse.json({ success: true, community });
  } catch (error) {
    console.error("Join community error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
