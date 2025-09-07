import toast from "react-hot-toast";

export const handleUpload = (
  file: File,
  setUploadProgress: (p: number) => void,
  setIsTranscribing: (b: boolean) => void,
  setTranscript: (t: string) => void,
  setSummary: (s: string[] | null) => void
) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append("file", file);

  xhr.open("POST", "/api/transcribe");

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      setUploadProgress(Math.round((event.loaded / event.total) * 100));
    }
  };

  xhr.onload = async () => {
    setUploadProgress(100);
    setIsTranscribing(true);

    try {
      const data = JSON.parse(xhr.responseText);

      if (!xhr.status.toString().startsWith("2") || data.error) {
        toast.error("Transcription failed: " + (data.error || "Unknown error"));
        return;
      }

      setTranscript(data.transcript);
      setSummary(data.summary);
      toast.success("Transcription completed!");
    } catch {
      toast.error("Transcription failed");
    } finally {
      setUploadProgress(0);
      setIsTranscribing(false);
    }
  };

  xhr.onerror = () => {
    toast.error("Upload failed");
    setUploadProgress(0);
    setIsTranscribing(false);
  };

  xhr.send(formData);
};
