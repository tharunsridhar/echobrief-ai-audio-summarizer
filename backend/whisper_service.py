from faster_whisper import WhisperModel

model = WhisperModel("base")


def transcribe_audio(file_path):
    segments, info = model.transcribe(file_path)
    transcript_parts = []

    for segment in segments:
        text = segment.text.strip()
        if text:
            transcript_parts.append(text)

    return " ".join(transcript_parts)
