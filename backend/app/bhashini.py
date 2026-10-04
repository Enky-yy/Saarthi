"""Bhashini (ULCA Dhruva) translation + TTS. All functions degrade to None
when credentials are absent or the API fails, so the app works fully offline:
templates + browser Web Speech remain the default experience."""
import base64
import json
import os
import urllib.request

_PIPELINE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"


def _creds() -> tuple[str, str] | None:
    uid = os.environ.get("BHASHINI_USER_ID", "")
    key = os.environ.get("BHASHINI_API_KEY", "")
    return (uid, key) if (uid and key) else None


def _pipeline(payload: dict, timeout: int = 30) -> dict | None:
    creds = _creds()
    if not creds:
        return None
    uid, key = creds
    try:
        req = urllib.request.Request(
            _PIPELINE_URL,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json", "userID": uid, "ulcaApiKey": key},
        )
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.load(r)
    except Exception:
        return None


def translate(text: str, target: str, source: str = "en") -> str | None:
    """Translate text into Bhashini language code (hi, mr, ta, bn, ...)."""
    if not text or target in ("en", "hinglish"):
        return None
    data = _pipeline({
        "pipelineTasks": [{"taskType": "translation", "config": {"language": {"sourceLanguage": source, "targetLanguage": target}}}],
        "inputData": {"input": [{"source": text[:1000]}]},
    })
    try:
        return data["pipelineResponse"][0]["output"][0]["target"]
    except Exception:
        return None


def tts(text: str, lang: str) -> bytes | None:
    """Server-side TTS mp3/wav bytes, or None (frontend falls back to Web Speech)."""
    if not text:
        return None
    data = _pipeline({
        "pipelineTasks": [
            {"taskType": "translation", "config": {"language": {"sourceLanguage": "en", "targetLanguage": lang}}},
            {"taskType": "tts", "config": {"language": {"sourceLanguage": lang}, "gender": "female"}},
        ],
        "inputData": {"input": [{"source": text[:600]}]},
    })
    try:
        for task in data["pipelineResponse"]:
            audio = task.get("audio", [{}])[0].get("audioContent")
            if audio:
                return base64.b64decode(audio)
        return None
    except Exception:
        return None
