import toast from "react-hot-toast";

export const handleUpload = async (
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

  // Track upload progress
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(percent);
    }
  };

  xhr.onload = async () => {
    // Upload completed → show transcribing immediately
    setUploadProgress(100);
    setIsTranscribing(true);

    try {
      const data = JSON.parse(xhr.responseText);

      if (xhr.status !== 200) {
        toast.error("Upload failed");
        return;
      }

      // Ensure the "Transcribing..." message is visible for at least 1.5s
      await new Promise((res) => setTimeout(res, 1500));

      if (data.error) {
        toast.error("Transcription failed");
      } else {
        setTranscript(data.transcript);
        setSummary(data.summary);
        toast.success("Transcription completed!");
      }
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
