"use client";

import FileUpload from "@/components/FileUpload";

export default function Home() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      alert(`Transcription failed: ${data.error.message}`);
      return;
    }

    console.log("Transcript:", data.transcript);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">EchoScribe</h1>
      <p className="text-lg text-center mb-8 max-w-xl">
        Upload your meeting recording. Get AI-powered summaries and action
        items.
      </p>
      <FileUpload onUpload={handleUpload} />
    </main>
  );
}
