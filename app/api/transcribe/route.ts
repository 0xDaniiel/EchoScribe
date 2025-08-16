import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // or 'nodejs' if you switch to using fs modules

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Convert file to binary (Uint8Array)
    const buffer = await file.arrayBuffer();
    const audioBytes = new Uint8Array(buffer);

    // Send to Hugging Face API (you can change the model if needed)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": file.type || "audio/mpeg", // fallback MIME type
        },
        body: audioBytes,
      }
    );

    const data = await response.json();

    // Log full response (helps debug any failures)
    console.log("Hugging Face API response:", data);

    if (!response.ok || data.error) {
      return NextResponse.json(
        { error: data.error || "Failed to transcribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transcript: data.text || data });
  } catch (error) {
    console.error("Error transcribing file:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
