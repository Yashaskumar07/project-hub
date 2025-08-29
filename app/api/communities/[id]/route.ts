import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Community from "@/models/Community";

// Type for POST body
interface CreateCommunityBody {
  name: string;
  description?: string;
}

// Type for error response
interface ErrorResponse {
  error: string;
  details?: string;
}

// GET all communities
export async function GET() {
  try {
    await connectToDB();
    const communities = await Community.find({});
    return NextResponse.json(communities, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const payload: ErrorResponse = {
      error: "Failed to fetch communities",
      details: message,
    };
    return NextResponse.json(payload, { status: 500 });
  }
}

// POST create a new community
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body: CreateCommunityBody = (await req.json()) as CreateCommunityBody;
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCommunity = new Community({ name, description });
    await newCommunity.save();

    return NextResponse.json(newCommunity, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const payload: ErrorResponse = {
      error: "Failed to create community",
      details: message,
    };
    return NextResponse.json(payload, { status: 500 });
  }
}
