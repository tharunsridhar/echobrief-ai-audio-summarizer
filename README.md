# EchoBrief

EchoBrief is an AI-powered audio summarizer. It accepts MP3 and M4A files, transcribes speech with Faster-Whisper, and generates a professional summary with Gemini.

## Features

- Audio upload from browser
- Whisper transcription
- Gemini summary generation
- Processing progress bar
- Downloadable transcript and summary files
- Clean FastAPI backend and static frontend

## Project Structure

```text
backend/
  main.py
  whisper_service.py
  llm_service.py
  uploads/
  transcripts/
  summaries/

frontend/
  app/index.html
  component/app.js
  style/style.css
```

## Setup

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create your environment file:

```powershell
copy backend\.env.example backend\.env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run the backend:

```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Open the frontend:

```text
http://127.0.0.1:8000/frontend/app/index.html
```

## GitHub Safety

The real `.env`, virtual environment, uploaded audio, generated transcripts, and generated summaries are ignored by `.gitignore`.
