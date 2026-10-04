"""Screenshot OCR for tip-group forwards. Downloads the image (5 MB cap),
runs Tesseract if present, else returns None so the pipeline stays honest."""
import shutil
import subprocess
import tempfile
import urllib.request

_MAX_BYTES = 5 * 1024 * 1024


def _download(url: str) -> str | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Sangyan/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status != 200:
                return None
            data = r.read(_MAX_BYTES + 1)
        if not data or len(data) > _MAX_BYTES:
            return None
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".img")
        tmp.write(data)
        tmp.close()
        return tmp.name
    except Exception:
        return None


def _run_tesseract(path: str) -> str | None:
    if not shutil.which("tesseract"):
        return None
    for langs in ("hin+eng", "eng"):  # Hindi pack often absent; fall back cleanly
        try:
            out = subprocess.run(
                ["tesseract", path, "stdout", "-l", langs, "--psm", "6"],
                capture_output=True, text=True, timeout=60,
            )
            text = (out.stdout or "").strip()
            if text:
                return text
        except Exception:
            continue
    return None


def extract_image_text(url: str) -> tuple[str | None, str | None]:
    """Returns (text, note). text None => caller falls back to URL string."""
    path = _download(url)
    if not path:
        return None, "Image could not be downloaded; assessment used the link text only."
    try:
        with open(path, "rb") as f:
            text = ocr_bytes(f.read())
    finally:
        try:
            import os
            os.unlink(path)
        except Exception:
            pass
    if not text:
        return None, "No readable text found in the image (OCR empty or unavailable)."
    return text, None


def ocr_bytes(data: bytes) -> str | None:
    """OCR raw image bytes (upload path). None when engine missing/empty."""
    import os
    import tempfile
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".img")
    try:
        tmp.write(data)
        tmp.close()
        return _run_tesseract(tmp.name)
    except Exception:
        return None
    finally:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass
