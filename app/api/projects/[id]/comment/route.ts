// app/api/projects/[id]/comment/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/Project";

interface Context {
  params: {
    id: string;
  };
}

export async function POST(req: Request, { params }: Context) {
  try {
    await connectToDB();
    const { userId, text } = await req.json();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    project.comments.push({ userId, text, createdAt: new Date() });
    await project.save();

    return NextResponse.json({ comments: project.comments }); // ✅ Always return JSON
  } catch (error) {
    console.error("COMMENT API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
