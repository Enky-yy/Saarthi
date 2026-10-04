"""YouTube caption fetch (stdlib only, no API key). Parses the watch page's
captionTracks and downloads a timedtext track; falls back honestly."""
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

_WATCH = "https://www.youtube.com/watch?v="


def _video_id(url: str) -> str | None:
    try:
        if "youtu.be/" in url:
            return url.split("youtu.be/")[1].split("?")[0].split("&")[0][:20]
        q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
        vid = (q.get("v") or [""])[0]
        return vid[:20] if re.fullmatch(r"[\w-]{6,20}", vid) else None
    except Exception:
        return None


def _get(url: str, timeout: int = 15) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Sangyan/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(3 * 1024 * 1024) if r.status == 200 else None
    except Exception:
        return None


def _clean_xml(data: bytes) -> str | None:
    try:
        root = ET.fromstring(data)
        parts = []
        for el in root.iter():
            if el.tag in ("text", "p", "span") and el.text:
                parts.append(el.text.strip())
        text = re.sub(r"\s+", " ", " ".join(parts)).strip()
        return text or None
    except Exception:
        return None


def _pick_track(tracks: list[dict]) -> dict | None:
    def score(t: dict) -> tuple:
        code = (t.get("languageCode") or "")
        auto = "auto" in (t.get("kind") or "") or ".asr" in (t.get("baseUrl") or "")
        pref = {"en": 0, "hi": 1, "hinglish": 2}.get(code, 9)
        return (pref, auto)
    cands = [t for t in tracks if t.get("baseUrl")]
    return min(cands, key=score) if cands else None


def extract_youtube_text(url: str) -> tuple[str | None, str | None]:
    vid = _video_id(url or "")
    if not vid:
        return None, "Link is not a recognisable YouTube URL; assessment used the link text only."
    page = _get(_WATCH + vid)
    if page:
        try:
            m = re.search(r"ytInitialPlayerResponse\s*=\s*(\{.+?\});", page.decode("utf-8", "ignore"))
            tracks = json.loads(m.group(1))["captions"]["playerCaptionsTracklistRenderer"]["captionTracks"]
            track = _pick_track(tracks)
            if track:
                data = _get(track["baseUrl"])
                text = _clean_xml(data) if data else None
                if text:
                    return text[:6000], None
        except Exception:
            pass
    # last resort: legacy timedtext (manual captions only)
    for lang in ("en", "hi"):
        data = _get(f"https://video.google.com/timedtext?lang={lang}&v={vid}")
        text = _clean_xml(data) if data else None
        if text:
            return text[:6000], None
    return None, "No captions found on this video; assessment used the link text only."
