import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { userId } = await req.json();
    const { id: projectId } = await context.params;

    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    project.likes ??= [];

    const alreadyLiked = project.likes.some(
      (m: mongoose.Types.ObjectId | string | undefined) => m?.toString() === userId
    );

    if (!alreadyLiked) {
      project.likes.push(new mongoose.Types.ObjectId(userId));
      await project.save();
    }

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: project.likes.length,
    });
  } catch (err: unknown) {
    console.error("LIKE POST ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
