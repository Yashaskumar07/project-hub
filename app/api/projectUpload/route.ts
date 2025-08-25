import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    // ✅ Parse multipart/form-data
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const tagsRaw = formData.get("tags");
    const difficulty = formData.get("difficulty");
    const status = formData.get("status");
    const github = formData.get("github");
    const demo = formData.get("demo");

    // ✅ Handle tags safely
    const tags =
      typeof tagsRaw === "string"
        ? tagsRaw.split(",").map((t) => t.trim())
        : [];

    // ✅ Handle image file
    const file = formData.get("image");
    let imageUrl = "";

    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save to public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.name);
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${file.name}`;
    }

    // ✅ Required field check
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof difficulty !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    const newProject = await Project.create({
      title,
      description,
      tags,
      difficulty,
      status: typeof status === "string" ? status : undefined,
      github: typeof github === "string" ? github : undefined,
      demo: typeof demo === "string" ? demo : undefined,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Project uploaded successfully", project: newProject },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// GET - Fetch all projects
export async function GET() {
  try {
    await connectToDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
