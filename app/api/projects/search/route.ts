// app/api/projects/search/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb"; // your MongoDB connection helper
import type { Filter, Document } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const difficulty = searchParams.get("difficulty");
  const tags = searchParams.get("tags")?.split(",") || [];

  try {
    const client = await connectToDB();
    const collection = client.collection("projects");

    // ✅ Use proper MongoDB filter typing
    const filter: Filter<Document> = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { difficulty: { $regex: query, $options: "i" } },
      ],
    };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const results = await collection.find(filter).limit(20).toArray();

    return NextResponse.json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to search projects" },
      { status: 500 }
    );
  }
}
