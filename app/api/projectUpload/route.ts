import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    // ✅ Parse multipart/form-data
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string)?.split(",").map(t => t.trim()) || [];
    const difficulty = formData.get("difficulty") as string;
    const status = formData.get("status") as string;
    const github = formData.get("github") as string;
    const demo = formData.get("demo") as string;

    // ✅ Handle image file
    const file = formData.get("image") as File | null;
    let imageUrl = "";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save to public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.name);
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${file.name}`;
    }

    if (!title || !description || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    const newProject = await Project.create({
      title,
      description,
      tags,
      difficulty,
      status,
      github,
      demo,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Project uploaded successfully", project: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload Error:", error);
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
