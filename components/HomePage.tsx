"use client";
import { useState } from "react";
import  { Toaster } from "react-hot-toast";
import FileUpload from "@/components/FileUpload";
import { cards } from "@/data/cards";
import { handleUpload as uploadFile } from "@/data/uploadFile";

export default function HomePage() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<string[] | null>(null);

  const handleBack = () => {
    setTranscript(null);
    setSummary(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white text-gray-900 px-6">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Section */}
      <section className="text-center max-w-2xl space-y-4 mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight">EchoScribe</h1>
        <p className="text-lg text-gray-700">
          Turn meeting recordings into actionable summaries in seconds.
          AI-powered, fast, and easy.
        </p>
        <FileUpload
          onUpload={(file, setUploadProgress, setIsTranscribing) =>
            uploadFile(
              file,
              setUploadProgress,
              setIsTranscribing,
              setTranscript,
              setSummary
            )
          }
          className="mt-6"
        />
      </section>

      {/* Dynamic Section */}
      {transcript ? (
        <section className="max-w-4xl w-full space-y-6">
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Transcript</h2>
            <div className="h-64 overflow-y-auto text-gray-800">
              {transcript}
            </div>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <ul className="list-disc list-inside text-gray-800">
              {summary?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Features
          </button>
        </section>
      ) : (
        <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
