import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

// ✅ configure allowed users via env
const ALLOWED_USERS =
  process.env.ALLOWED_USERS?.split(",") || ["admin@gmail.com", "special@gmail.com"];

// ==================== GET /api/bookmarks ====================
export async function GET() {
  try {
    const cookieStore = await cookies(); // no await
    const userId = cookieStore.get("userId")?.value;
    const email = cookieStore.get("email")?.value;

    if (!userId) {
      console.warn("GET /bookmarks → missing userId");
      return NextResponse.json([]);
    }

    if (email && !ALLOWED_USERS.includes(email)) {
      console.warn("GET /bookmarks → email not allowed:", email);
      return NextResponse.json([]);
    }

    const db = await connectToDB();

    const userBookmarks = await db.collection("bookmarks").findOne({ userId });
    const ids: string[] = userBookmarks?.projects || [];

    if (ids.length === 0) {
      return NextResponse.json([]);
    }

    const projects = await db
      .collection("projects")
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /bookmarks error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

// ==================== POST /api/bookmarks ====================
export async function POST(req: Request) {
  try {
    const cookieStore =await cookies();
    const userId = cookieStore.get("userId")?.value;
    const email = cookieStore.get("email")?.value;

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { projectId } = body;

    if (!userId || !projectId) {
      console.warn("POST /bookmarks → missing userId or projectId", { userId, projectId });
      return NextResponse.json(
        { error: "Missing userId or projectId" },
        { status: 400 }
      );
    }

    if (email && !ALLOWED_USERS.includes(email)) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const db = await connectToDB();

    await db.collection("bookmarks").updateOne(
      { userId },
      { $addToSet: { projects: projectId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, action: "added", projectId });
  } catch (error) {
    console.error("POST /bookmarks error:", error);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}

// ==================== DELETE /api/bookmarks ====================
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const email = cookieStore.get("email")?.value;

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { projectId } = body;

    if (!userId || !projectId) {
      console.warn("DELETE /bookmarks → missing userId or projectId", { userId, projectId });
      return NextResponse.json(
        { error: "Missing userId or projectId" },
        { status: 400 }
      );
    }

    if (email && !ALLOWED_USERS.includes(email)) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const db = await connectToDB();

    await db.collection("bookmarks").updateOne(
      { userId },
      { $pull: { projects: projectId } }
    );

    return NextResponse.json({ success: true, action: "removed", projectId });
  } catch (error) {
    console.error("DELETE /bookmarks error:", error);
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
