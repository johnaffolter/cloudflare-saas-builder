import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { views, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

// GET /api/views - List all views
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allViews = await db.select().from(views);
    return NextResponse.json({ views: allViews });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}

// POST /api/views - Create a new view
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user is super admin
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.length === 0 || user[0].role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can create views" },
        { status: 403 }
      );
    }

    const body = await request.json() as {
      name: string;
      displayName: string;
      description?: string;
      sqlDefinition: string;
      semanticMetadata?: unknown;
    };
    const { name, displayName, description, sqlDefinition, semanticMetadata } =
      body;

    if (!name || !displayName || !sqlDefinition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newView = await db
      .insert(views)
      .values({
        name,
        displayName,
        description,
        sqlDefinition,
        semanticMetadata: semanticMetadata
          ? JSON.stringify(semanticMetadata)
          : null,
        createdBy: session.user.id,
        status: "draft",
      })
      .returning();

    return NextResponse.json({ view: newView[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating view:", error);
    return NextResponse.json(
      { error: "Failed to create view" },
      { status: 500 }
    );
  }
}
