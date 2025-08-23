import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import type { JwtPayload } from "jsonwebtoken";

export default async function HomePage() {
  const cookiez=await cookies()
  const token = cookiez.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const decoded = verifyToken(token);
    if (typeof decoded !== "string" && (decoded as JwtPayload).id) {
      redirect("/home");
    } else {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }
}