import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ configure allowed users via env
const ALLOWED_USERS =
  process.env.ALLOWED_USERS?.split(",") || ["admin@gmail.com", "special@gmail.com"];

// ==================== GET /api/bookmarks ====================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    // ❌ no user / not allowed → just return []
    if (!userId || !email || !ALLOWED_USERS.includes(email)) {
      return NextResponse.json([]);
    }

    const db = await connectToDB();

    // ✅ always safe: if new user → no bookmarks yet
    const userBookmarks = await db.collection("bookmarks").findOne({ userId });
    const ids: string[] = userBookmarks?.projects || [];

    if (ids.length === 0) {
      return NextResponse.json([]); // new user → empty
    }

    // ✅ fetch full project data
    const projects = await db
      .collection("projects")
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// ==================== POST /api/bookmarks ====================
export async function POST(req: Request) {
  try {
    const { userId, projectId, email } = await req.json();

    if (!userId || !projectId || !email) {
      return NextResponse.json(
        { error: "Missing userId, projectId or email" },
        { status: 400 }
      );
    }

    if (!ALLOWED_USERS.includes(email)) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const db = await connectToDB();

    // ✅ upsert ensures new users get a document only when first bookmarking
    await db.collection("bookmarks").updateOne(
      { userId },
      { $addToSet: { projects: projectId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, action: "added", projectId });
  } catch (error) {
    console.error("POST /bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to add bookmark" },
      { status: 500 }
    );
  }
}

// ==================== DELETE /api/bookmarks ====================
export async function DELETE(req: Request) {
  try {
    const { userId, projectId, email } = await req.json();

    if (!userId || !projectId || !email) {
      return NextResponse.json(
        { error: "Missing userId, projectId or email" },
        { status: 400 }
      );
    }

    if (!ALLOWED_USERS.includes(email)) {
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
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
