import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// GET - Saari published properties fetch karna
export async function GET() {
  try {
    const allProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.published, true))
      .orderBy(desc(properties.createdAt));

    return NextResponse.json({
      properties: allProperties,
    });
  } catch (error) {
    console.error("Properties fetch error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}

// POST - Nayi property banana
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Authentication check
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // User ID safely get karna
    const userId = (session.user as { id?: string }).id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      areaUnit,
      address,
      city,
      state,
      images,
      features,
    } = body;

    // Required fields validation
    if (
      !title ||
      !description ||
      !price ||
      !type ||
      !status ||
      !area ||
      !address ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        {
          error: "Please fill all required fields",
        },
        { status: 400 }
      );
    }

    // Property create
    const [newProperty] = await db
      .insert(properties)
      .values({
        title,
        description,

        price: Math.round(Number(price)),

        type,
        status,

        bedrooms:
          bedrooms !== undefined &&
          bedrooms !== null &&
          bedrooms !== ""
            ? Number(bedrooms)
            : null,

        bathrooms:
          bathrooms !== undefined &&
          bathrooms !== null &&
          bathrooms !== ""
            ? Number(bathrooms)
            : null,

        area: Math.round(Number(area)),
        areaUnit,

        address,
        city,
        state,

        images: images || [],
        features: features || [],

        published: false,

        userId,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        property: newProperty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Property creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create property",
      },
      { status: 500 }
    );
  }
}