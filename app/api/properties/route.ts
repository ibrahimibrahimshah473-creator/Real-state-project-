import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role?.toLowerCase();

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    const type = formData.get("type") as string;
    const status = formData.get("status") as string;

    const bedroomsValue = formData.get("bedrooms") as string;
    const bathroomsValue = formData.get("bathrooms") as string;

    const area = Number(formData.get("area"));
    const areaUnit = formData.get("areaUnit") as string;

    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    const featuresRaw = formData.get("features") as string;

    const features = featuresRaw
      ? JSON.parse(featuresRaw)
      : [];

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
          error:
            "Please fill all required fields",
        },
        { status: 400 }
      );
    }

    const images: string[] = [];

    const files = formData.getAll("images") as File[];

    for (const file of files) {
      if (file && file.size > 0) {
        const imageUrl = await uploadImage(file);

        images.push(imageUrl);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        {
          error: "At least one image is required",
        },
        { status: 400 }
      );
    }

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

        userId: session.user.id,
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