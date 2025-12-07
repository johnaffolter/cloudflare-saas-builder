import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { views, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/views/[id] - Get a specific view
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const view = await db
      .select()
      .from(views)
      .where(eq(views.id, params.id))
      .limit(1);

    if (!view || view.length === 0) {
      return NextResponse.json({ error: "View not found" }, { status: 404 });
    }

    return NextResponse.json({ view: view[0] });
  } catch (error) {
    console.error("Error fetching view:", error);
    return NextResponse.json(
      { error: "Failed to fetch view" },
      { status: 500 }
    );
  }
}
