"use client";

import { useState } from "react";
interface FileUploadProps {
  onUpload: (
    file: File,
    setUploadProgress: (p: number) => void,
    setIsTranscribing: (b: boolean) => void
  ) => void;
  className?: string;
}

export default function FileUpload({ onUpload, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
      setIsTranscribing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file, setUploadProgress, setIsTranscribing);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {/* Upload progress bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {uploadProgress === 100 && isTranscribing && (
        <p className="text-gray-700 mt-2">Transcribing, please wait...</p>
      )}

      <button
        type="submit"
        disabled={!file || uploadProgress > 0}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploadProgress > 0 && uploadProgress < 100
          ? `Uploading ${uploadProgress}%`
          : uploadProgress === 100 && isTranscribing
          ? "Transcribing..."
          : "Upload & Transcribe"}
      </button>
    </form>
  );
}
