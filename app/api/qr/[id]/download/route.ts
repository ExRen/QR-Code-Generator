import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "png";

  const qrCode = await prisma.qrCode.findFirst({
    where: { id, userId: session.user.id, deletedAt: null },
  });

  if (!qrCode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let url: string;
  let contentType: string;
  let filename: string;

  switch (format) {
    case "svg":
      url = qrCode.renderedSvgUrl || "";
      contentType = "image/svg+xml";
      filename = `${qrCode.label || "qr"}.svg`;
      break;
    case "jpeg":
      url = qrCode.renderedJpegUrl || "";
      contentType = "image/jpeg";
      filename = `${qrCode.label || "qr"}.jpeg`;
      break;
    default:
      url = qrCode.renderedPngUrl;
      contentType = "image/png";
      filename = `${qrCode.label || "qr"}.png`;
  }

  if (!url) {
    return NextResponse.json({ error: "Format not available" }, { status: 404 });
  }

  // Fetch from Blob and stream back
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
