import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const formData = await req.formData();
    const images: string[] = [];
    const files = formData.getAll("images") as File[];
    for (const file of files) {
      const url = await uploadImage(file);
      images.push(url);
    }

    const property = await prisma.property.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        type: formData.get("type") as any,
        status: formData.get("status") as any,
        bedrooms: parseInt(formData.get("bedrooms") as string) || null,
        bathrooms: parseInt(formData.get("bathrooms") as string) || null,
        area: parseFloat(formData.get("area") as string),
        areaUnit: (formData.get("areaUnit") as string) || "marla",
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        images,
        features: JSON.parse(formData.get("features") as string || "[]"),
        userId: session.user.id,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  const where: any = { published: true };
  if (city) where.city = city;
  if (status) where.status = status;
  if (type) where.type = type;

  const properties = await prisma.property.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties);
}