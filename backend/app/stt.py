"""Speech-to-text: Gnani Prisma v2.5 API first, local faster-whisper offline
fallback. Only Gnani + local whisper are used. Returns None when neither
engine can run, so callers stay honest."""
import io
import json
import os
import urllib.request

_BCP47 = {"en": "en-IN", "hi": "hi-IN", "hinglish": "hi-IN", "mr": "mr-IN",
          "ta": "ta-IN", "bn": "bn-IN", "te": "te-IN", "kn": "kn-IN",
          "ml": "ml-IN", "gu": "gu-IN", "pa": "pa-IN"}


def gnani_transcribe(audio: bytes, lang: str = "auto") -> tuple[str | None, str | None]:
    """Returns (text, language) or (None, None). Needs GNANI_API_KEY env."""
    key = os.environ.get("GNANI_API_KEY", "")
    if not key or not audio:
        return None, None
    try:
        import mimetypes
        boundary = "----sangyan99"
        code = _BCP47.get(lang, "hi-IN") if lang != "auto" else "hi-IN"
        fields = {"language_code": code, "preferred_language": code,
                  "format": "transcribe", "itn_native_numerals": "true"}
        body = io.BytesIO()
        for k, v in fields.items():
            body.write(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
        body.write(f"--{boundary}\r\nContent-Disposition: form-data; name=\"audio_file\"; filename=\"voice.webm\"\r\n"
                   f"Content-Type: audio/webm\r\n\r\n".encode())
        body.write(audio)
        body.write(f"\r\n--{boundary}--\r\n".encode())
        req = urllib.request.Request(
            "https://api.vachana.ai/stt/v3", data=body.getvalue(),
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-API-Key-ID": key},
        )
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.load(r)
        text = str(data.get("transcript") or "").strip()
        return (text[:6000], lang) if text else (None, None)
    except Exception:
        return None, None
