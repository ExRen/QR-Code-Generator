import { auth } from "@/lib/auth";
import { uploadToBlob } from "@/lib/blob";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  const id = randomUUID();
  const ext = file.type === "image/svg+xml" ? "svg" : file.type === "image/jpeg" ? "jpg" : "png";
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadToBlob(`logos/${id}.${ext}`, buffer, file.type);

  return NextResponse.json({ url });
}
