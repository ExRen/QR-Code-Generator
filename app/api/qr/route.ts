import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQrPng, generateQrSvg } from "@/lib/qr";
import { uploadToBlob } from "@/lib/blob";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const url = formData.get("url") as string;
    const label = (formData.get("label") as string) || null;
    const logo = formData.get("logo") as File | null;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const id = randomUUID();

    // Generate base QR
    const qrPngBuffer = await generateQrPng(url, 512);
    let logoUrl: string | null = null;

    // Upload logo if provided (logo overlay will be done client-side)
    if (logo && logo.size > 0) {
      const logoArrayBuffer = await logo.arrayBuffer();
      const logoBuffer = Buffer.from(new Uint8Array(logoArrayBuffer));
      logoUrl = await uploadToBlob(`logos/${id}`, logoBuffer, logo.type);
    }

    // Generate SVG
    const qrSvg = await generateQrSvg(url);

    // Upload to Blob
    const [pngUrl, svgUrl] = await Promise.all([
      uploadToBlob(`qr/${id}.png`, qrPngBuffer, "image/png"),
      uploadToBlob(`qr/${id}.svg`, qrSvg, "image/svg+xml"),
    ]);

    // Save to DB
    const qrCode = await prisma.qrCode.create({
      data: {
        id,
        label,
        destinationUrl: url,
        logoUrl,
        renderedPngUrl: pngUrl,
        renderedSvgUrl: svgUrl,
        renderedJpegUrl: pngUrl, // Use PNG as fallback for JPEG
        widthPx: 512,
        heightPx: 512,
        userId: session.user.id,
      },
    });

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate QR" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = {
    userId: session.user.id,
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { label: { contains: search, mode: "insensitive" as const } },
            { destinationUrl: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [qrCodes, total] = await Promise.all([
    prisma.qrCode.findMany({
      where,
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.qrCode.count({ where }),
  ]);

  return NextResponse.json({ qrCodes, total, page, totalPages: Math.ceil(total / limit) });
}
