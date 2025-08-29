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

    const { commentText, userId } = await req.json();
    const { id: projectId } = await context.params;

    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    project.comments ??= [];
    project.comments.push({
      text: commentText,
      createdBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
    });

    await project.save();
    return NextResponse.json({ comments: project.comments }, { status: 201 });
  } catch (err: unknown) {
    console.error("COMMENT POST ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
