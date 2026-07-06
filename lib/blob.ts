import { put } from "@vercel/blob";

export async function uploadToBlob(
  pathname: string,
  data: Buffer | string,
  contentType: string
): Promise<string> {
  const blob = await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}
