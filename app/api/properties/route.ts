import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Authentication check
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user ID safely
    const userId = (session.user as { id?: string }).id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 401 }
      );
    }

    // Get role safely
    const userRole = (
      session.user as { role?: string }
    ).role?.toLowerCase();

    // Admin-only access
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    // Basic fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    // Property details
    const type = formData.get("type") as string;
    const status = formData.get("status") as string;

    const bedroomsValue = formData.get("bedrooms") as string;
    const bathroomsValue = formData.get("bathrooms") as string;

    const area = Number(formData.get("area"));
    const areaUnit = formData.get("areaUnit") as string;

    // Location
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    // Features
    const featuresRaw = formData.get("features") as string;

    let features: unknown[] = [];

    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw);
      } catch {
        return NextResponse.json(
          { error: "Invalid features data" },
          { status: 400 }
        );
      }
    }

    // Validate required fields
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

    // Get uploaded files
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          error: "At least one image is required",
        },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const images: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const imageUrl = await uploadImage(file);
        images.push(imageUrl);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        {
          error: "Image upload failed",
        },
        { status: 400 }
      );
    }

    // Create property in database
    const [property] = await db
      .insert(properties)
      .values({
        title,
        description,
        price: Math.round(price),

        type,
        status,

        bedrooms: bedroomsValue
          ? Number(bedroomsValue)
          : null,

        bathrooms: bathroomsValue
          ? Number(bathroomsValue)
          : null,

        area: Math.round(area),
        areaUnit,

        address,
        city,
        state,

        images,
        features,

        userId,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        property,
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