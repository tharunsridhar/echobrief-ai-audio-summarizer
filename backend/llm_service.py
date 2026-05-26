import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_client = None


def get_client():
    global _client

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing. Add it to backend/.env or your environment.")

    if _client is None:
        _client = genai.Client(api_key=api_key)

    return _client


def generate_summary(transcript):
    if not transcript or not transcript.strip():
        return "No transcript text was provided to summarize."

    prompt = f"""
    Convert this transcript into a concise professional response.

    Format:
    1. Clean Transcript
    2. Short Summary
    3. Key Points

    Rules:
    - Keep the response brief and readable.
    - Remove filler words and repeated phrases.
    - Fix grammar without changing the meaning.
    - Use bullet points for key points.

    Transcript:
    {transcript}
    """

    try:
        response = get_client().models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2
            )
        )

        return response.text

    except Exception as e:
        return f"Summary generation failed: {e}"
