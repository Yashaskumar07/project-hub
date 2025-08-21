// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectToDB();
    const result = await db.collection("projects").insertOne(body);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 👇 Add GET for fetching all projects
export async function GET() {
  try {
    const db = await connectToDB();
    const projects = await db.collection("projects").find({}).toArray();
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
