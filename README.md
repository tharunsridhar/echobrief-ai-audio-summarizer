# EchoBrief

EchoBrief is an AI-powered audio transcription and summarization platform built with FastAPI, Faster-Whisper, and Gemini AI.

The application accepts MP3 and M4A audio files, converts speech into text using Whisper AI, and generates concise professional summaries using Google Gemini.

---

# Features

- Audio upload support
- MP3 and M4A processing
- AI speech-to-text transcription
- AI-generated summaries
- Professional transcript cleanup
- Downloadable transcript files
- Downloadable summary files
- Progress tracking UI
- Drag and drop frontend
- FastAPI backend architecture
- Gemini AI integration
- Responsive frontend design

---

# Tech Stack

## Backend
- Python
- FastAPI
- Faster-Whisper
- Google Gemini API
- Uvicorn

## Frontend
- HTML
- CSS
- Vanilla JavaScript

---

# Project Architecture

```text
Audio Upload
     ↓
FastAPI Backend
     ↓
Faster-Whisper
     ↓
Transcript Generation
     ↓
Gemini AI
     ↓
Professional Summary
     ↓
Downloadable Results
```

---

# Project Structure

```text
ai-audio-project/
│
├── backend/
│   ├── main.py
│   ├── whisper_service.py
│   ├── llm_service.py
│   ├── prompts.py
│   ├── file_handler.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── uploads/
│   ├── transcripts/
│   └── summaries/
│
├── frontend/
│   ├── app/
│   │   └── index.html
│   │
│   ├── component/
│   │   └── app.js
│   │
│   └── style/
│       └── style.css
│
└── README.md
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/tharunsridhar/echobrief-ai-audio-summarizer.git

cd echobrief-ai-audio-summarizer
```

---

## 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate environment:

### Windows

```bash
.venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

# Run Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# Open Frontend

Open in browser:

```text
http://127.0.0.1:8000/frontend/app/index.html
```

---

# API Endpoint

## Upload Audio

```http
POST /upload
```

Supported formats:
- MP3
- M4A

Response:

```json
{
  "filename": "audio.m4a",
  "transcription": "Transcript text...",
  "summary": "Summary text..."
}
```

---

# AI Components

## Faster-Whisper

Used for:
- speech recognition
- transcription
- local AI inference

---

## Gemini AI

Used for:
- transcript cleanup
- grammar correction
- concise summarization
- key point extraction

---

# Future Improvements

- Live microphone recording
- Speaker diarization
- Multi-language support
- Cloud deployment
- User authentication
- AI meeting notes
- Timestamp summaries
- PDF export
- Vector search memory

---

# GitHub Safety

The following are excluded using `.gitignore`:

- `.venv`
- `.env`
- `node_modules`
- uploads
- transcripts
- summaries

---

# Author

Tharun Sridhar Natarajan

---
