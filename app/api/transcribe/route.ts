import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const whisperForm = new FormData();
    whisperForm.append("file", new Blob([buffer]), file.name);
    whisperForm.append("model", "whisper-1");

    const whisperRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: whisperForm as unknown as BodyInit, // TypeScript hack for Node fetch
      }
    );

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await whisperRes.json();

    const summaryRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Summarize this transcript into bullet points.",
            },
            { role: "user", content: data.text },
          ],
        }),
      }
    );

    const summaryData = await summaryRes.json();
    const summary = summaryData.choices?.[0]?.message?.content
      ?.split("\n")
      .filter(Boolean);

    return NextResponse.json({ transcript: data.text, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
