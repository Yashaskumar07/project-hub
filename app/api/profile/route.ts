// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const db = await connectToDB();
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Use native MongoDB collection query instead of Mongoose
    const user = await db.collection("users").findOne(
      { email },
      { projection: { password: 0 } } // exclude password
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
