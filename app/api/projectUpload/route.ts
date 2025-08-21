import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";  // ✅ use mongoose connection
import Project from "@/models/Project";

// POST - Create new project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, tags, difficulty, status, githubLink, images } = body;

    if (!title || !description || !tags || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    const newProject = await Project.create({
      title,
      description,
      tags,
      difficulty,
      status,
      githubLink,
      images,
    });

    return NextResponse.json(
      { message: "Project uploaded successfully", project: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Fetch all projects
export async function GET() {
  try {
    await connectToDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
