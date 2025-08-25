// app/api/projects/[id]/like/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Types } from "mongoose";

interface Context {
  params: { id: string };
}

export async function POST(req: Request, { params }: Context) {
  try {
    await connectToDB();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Ensure likes is an array of ObjectIds
    const likes = project.likes as Types.ObjectId[];

    const alreadyLiked = likes.some((uid) => uid.toString() === userId);

    if (alreadyLiked) {
      project.likes = likes.filter((uid) => uid.toString() !== userId);
    } else {
      project.likes.push(new Types.ObjectId(userId));
    }

    await project.save();

    return NextResponse.json({
      likes: project.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error: unknown) {
    console.error("LIKE API ERROR:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
