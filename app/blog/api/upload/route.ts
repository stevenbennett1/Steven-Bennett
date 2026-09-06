import { NextResponse } from "next/server";
import { uploadFile, MAX_IMAGE_BYTES, MAX_PDF_BYTES } from "@/lib/storage";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const kindRaw = formData.get("kind");
  const kind = kindRaw === "pdf" ? "pdf" : "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const maxBytes = kind === "pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${Math.round(maxBytes / (1024 * 1024))}MB)` },
      { status: 400 }
    );
  }

  if (kind === "image" && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Expected an image file" }, { status: 400 });
  }
  if (kind === "pdf" && file.type !== "application/pdf") {
    return NextResponse.json({ error: "Expected a PDF file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let result;
  try {
    result = await uploadFile(buffer, file.name, kind);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ...result, fileName: file.name, kind });
}
