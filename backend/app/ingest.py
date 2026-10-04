"""URL ingestion: classify link kind + extract readable text (article pages)."""
import re
import urllib.request

_IMG = re.compile(r"\.(png|jpe?g|webp|bmp|gif)(\?|$)", re.IGNORECASE)


def kind_of(url: str) -> str:
    u = (url or "").lower()
    if "youtube.com" in u or "youtu.be" in u:
        return "youtube"
    if _IMG.search(u):
        return "image"
    if u.startswith("http://") or u.startswith("https://"):
        return "article"
    return "unknown"


def extract_article_text(url: str, limit: int = 6000) -> tuple[str | None, str | None]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Sangyan/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status != 200:
                return None, "Page could not be opened; paste the message text instead."
            html = r.read(1_500_000).decode("utf-8", "ignore")
        title = ""
        m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        if m:
            title = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()
        text = re.sub(r"(?is)<(script|style|nav|footer|header)[^>]*>.*?</\1>", " ", html)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) < 200:
            return None, "Page had too little readable text; paste the message text instead."
        out = (title + "\n" + text) if title else text
        return out[:limit], None
    except Exception:
        return None, "Page could not be opened; paste the message text instead."
