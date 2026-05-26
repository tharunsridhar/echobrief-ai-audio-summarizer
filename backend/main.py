from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os

from whisper_service import transcribe_audio
from llm_service import generate_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
UPLOAD_DIR = BASE_DIR / "uploads"
TRANSCRIPT_DIR = BASE_DIR / "transcripts"
SUMMARY_DIR = BASE_DIR / "summaries"
UPLOAD_DIR.mkdir(exist_ok=True)
TRANSCRIPT_DIR.mkdir(exist_ok=True)
SUMMARY_DIR.mkdir(exist_ok=True)

app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")
app.mount("/transcripts", StaticFiles(directory=TRANSCRIPT_DIR), name="transcripts")
app.mount("/summaries", StaticFiles(directory=SUMMARY_DIR), name="summaries")

# Supported audio formats
ALLOWED_EXTENSIONS = [".mp3", ".m4a"]


def format_output_file(title, source_filename, body):
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return f"""{title}
Source file: {source_filename}
Created at: {created_at}

{"=" * 72}

{body.strip()}
"""


@app.get("/")
def home():
    return {
        "message": "AI Audio Backend Running"
    }


@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):

    # Get file extension
    file_extension = os.path.splitext(file.filename)[1].lower()

    # Validate file type
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only MP3 and M4A files are supported"
        )

    # Save uploaded file
    safe_filename = os.path.basename(file.filename)
    file_path = UPLOAD_DIR / safe_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert audio to text using Whisper
    transcription = transcribe_audio(str(file_path))

    # Generate summary using Gemini
    summary = generate_summary(transcription)

    output_name = Path(safe_filename).stem
    transcript_path = TRANSCRIPT_DIR / f"{output_name}.txt"
    summary_path = SUMMARY_DIR / f"{output_name}.txt"

    transcript_path.write_text(
        format_output_file("AI Audio Transcript", safe_filename, transcription),
        encoding="utf-8"
    )
    summary_path.write_text(
        format_output_file("AI Audio Summary", safe_filename, summary),
        encoding="utf-8"
    )

    # Return response
    return {
        "filename": safe_filename,
        "transcription": transcription,
        "summary": summary,
        "transcript_file": str(transcript_path),
        "summary_file": str(summary_path),
        "transcript_download_url": f"/transcripts/{transcript_path.name}",
        "summary_download_url": f"/summaries/{summary_path.name}"
    }
