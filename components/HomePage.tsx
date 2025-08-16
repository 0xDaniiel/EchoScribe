"use client";

import FileUpload from "@/components/FileUpload";

export default function HomePage() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      alert(`Transcription failed: ${data.error.message || data.error}`);
      return;
    }

    console.log("Transcript:", data.transcript);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white text-gray-900 px-6">
      {/* Hero Section */}
      <section className="text-center max-w-2xl space-y-4 mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight">EchoScribe</h1>
        <p className="text-lg text-gray-700">
          Turn meeting recordings into actionable summaries in seconds.
          AI-powered, fast, and easy.
        </p>
        <FileUpload onUpload={handleUpload} className="mt-6" />
      </section>

      {/* Features Section */}
      <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Fast & Accurate</h3>
          <p className="text-gray-600">
            Transcripts generated instantly with high accuracy.
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Actionable Summaries</h3>
          <p className="text-gray-600">
            Focus on tasks, not long meeting notes.
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Clean UI</h3>
          <p className="text-gray-600">
            Easy-to-read transcripts and highlights without clutter.
          </p>
        </div>
      </section>
    </main>
  );
}
