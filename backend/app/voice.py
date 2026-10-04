from .schemas import Lang

# Stage-5 voice hook. No TTS keys wired yet — frontend uses Web Speech API
# fallback, backend swaps this stub for server TTS without changing /api/analyze.


def stub_audio_url(job_id: str, voice_requested: bool, lang: Lang, text: str) -> str | None:
    if not voice_requested:
        return None
    # Server-TTS plug-in point: (text, lang) -> mp3 -> return f"/api/audio/{job_id}.mp3"
    return None
