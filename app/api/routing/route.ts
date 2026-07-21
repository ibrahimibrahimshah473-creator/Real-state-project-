import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { uploadImage } from "@/lib/cloudinary";

// GET - Saari properties fetch karna
export async function GET(req: Request) {
  try {
    const allProperties = await db.select().from(properties).where(eq(properties.published, true));
    return NextResponse.json({ properties: allProperties });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Nayi property banana
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, location, latitude, longitude, images, features } = body;

    const [newProperty] = await db.insert(properties).values({
      title,
      description,
      price: parseInt(price),
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      images: images || [],
      features: features || [],
      published: false,
      userId: session.user.id,
    }).returning();

    return NextResponse.json({ property: newProperty });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}