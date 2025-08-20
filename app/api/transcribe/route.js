// app/api/transcribe/route.js
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { default: fs } = await import("fs");
    const { default: path } = await import("path");
    const ffmpeg = (await import("fluent-ffmpeg")).default;
    const ffmpegPath = (await import("@ffmpeg-installer/ffmpeg")).path;
    const { InferenceClient } = await import("@huggingface/inference");

    // Setup FFmpeg path
    ffmpeg.setFfmpegPath(ffmpegPath);

    // Initialize Hugging Face client
    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    // Get uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    // Create temp folder
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Generate unique filename to prevent collisions
    const uniqueId =
      Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    const filePath = path.join(tempDir, uniqueId + "-" + file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    let audioPath = filePath;

    // Extract audio if it's a video
    if (file.type.startsWith("video/")) {
      const outputAudioPath = path.join(tempDir, uniqueId + "-output.wav");
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .noVideo()
          .audioCodec("pcm_s16le")
          .save(outputAudioPath)
          .on("end", () => resolve())
          .on("error", (err) => reject(err));
      });
      audioPath = outputAudioPath;
    }

    const audioBuffer = fs.readFileSync(audioPath);

    // Transcription
    const transcriptResponse = await client.audioToText({
      model: "openai/whisper-small",
      file: audioBuffer,
    });
    const transcript = transcriptResponse.text;

    // Summarization
    const summaryResponse = await client.textGeneration({
      model: "facebook/bart-large-cnn",
      inputs: `Summarize into bullet points:\n${transcript}`,
      parameters: { max_new_tokens: 150 },
    });

    const generatedText = summaryResponse[0].generated_text;
    const summary = generatedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Cleanup temp files
    fs.unlinkSync(filePath);
    if (audioPath !== filePath) fs.unlinkSync(audioPath);

    return new Response(JSON.stringify({ transcript, summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Transcription failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
