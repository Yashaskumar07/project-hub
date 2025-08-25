// /app/api/is-authenticated/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(tokenCookie.value, JWT_SECRET);

    return NextResponse.json({
      isAuthenticated: true,
      user: decoded, // contains id & email
    });
} catch (error) {
  console.error("Auth check failed:", error);
  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}

}
