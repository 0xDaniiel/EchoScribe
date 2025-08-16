# EchoScribe

**AI-powered meeting transcription and summarization**. Upload your audio or video recordings, and get clean transcripts, actionable bullet points, and meeting highlights instantly. Built with Next.js, Tailwind CSS, and Hugging Face models.

---

## Description

EchoScribe is a minimal, modern web app that converts your meeting recordings into readable transcripts and concise summaries. It supports **audio and video uploads**, and leverages **AI models** to provide fast, accurate results.

Whether you want to save time after meetings or quickly extract action items, EchoScribe makes it effortless.

---

## Features

- Upload **audio (MP3, WAV)** or **video (MP4, MOV)** recordings
- **Automatic audio extraction** from video files using FFmpeg
- AI-powered **transcription** using Hugging Face models
- AI-powered **summarization** into actionable bullet points
- Clean, responsive frontend built with **Next.js + Tailwind CSS**
- Minimalistic landing page and dashboard for transcript preview

---

## Workflow

1. **Upload file**

   - Users can upload audio or video files via the frontend.

2. **Audio extraction (if video)**

   - If the file is a video, FFmpeg converts it into audio (MP3/WAV).

3. **Transcription**

   - The audio file is sent to a Hugging Face **transcription model**, which returns a text transcript.

4. **Summarization**

   - The transcript is processed by a Hugging Face **summarization model** to produce action items and bullet points.

5. **Display results**
   - The frontend shows both the transcript and the summary in a clean, readable format.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes
- **AI Models:** Hugging Face Inference API (transcription + summarization)
- **Video/Audio Processing:** FFmpeg

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/0xDaniiel/echoscribe.git
cd echoscribe
```

2. Install Dependies:

```bash
npm install
```

3. Set up environment variables:

```bash
Set up environment variables:
```

4. Run the development server:

```bash
npm run dev
```

### License

This project is licensed under the BSD 3-Clause License. See the [LICENSE](LICENSE) file for details.

### Notes

- Hugging Face free-tier allows ~50–100 requests/month, suitable for demo/testing.
- Video files are automatically converted to audio for transcription.
- Summarization helps you quickly extract actionable insights from meeting recordings.
