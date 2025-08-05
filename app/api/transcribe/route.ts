import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const runtime = "edge"; // or 'nodejs' if using local filesystem

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert file to stream to send to OpenAI
  const stream = file.stream() as ReadableStream;

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: createWhisperFormData(file),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  return NextResponse.json({ transcript: data.text });
}

// Utility: OpenAI wants multipart/form-data with the file
function createWhisperFormData(file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("model", "whisper-1");
  form.append("language", "en");
  return form;
}
