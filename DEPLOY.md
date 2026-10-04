# DEPLOY — Saarthi

Two static-ish pieces: a FastAPI backend and dependency-free static files.
No database server, no keys, no external APIs (Gnani STT key optional).

## Option A — single VPS (recommended demo path)

Minimum: 2 vCPU / 8 GB RAM (holds MuRIL + e5 + Qwen-1.5B + whisper-tiny).
GPU optional (faster RAG answers; everything works on CPU).

```bash
# 1. code + python deps
git clone <repo> && cd sangyan-sebi/backend
pip install -r requirements.txt
sudo apt install -y tesseract-ocr tesseract-ocr-hin  # screenshot OCR (+Hindi)

# 2. one-time model + corpus warmup (~2GB downloads, ~15 min)
python -c "from app.rag_embed import rebuild; print(rebuild(), 'docs')"
python scripts/fetch_real.py && python scripts/build_dataset.py
python scripts/train_muril.py        # or copy a trained models/muril-clf/
python kb_sync.py                    # refresh SEBI corpus

# 3. run behind systemd (port 8001) + any static server for frontend/
# env (all optional): SANGYAN_DB, GNANI_API_KEY, MURIL_MODEL_DIR,
#   EMBED_MODEL, LOCAL_GEN_MODEL (blank = disable that engine)
```

Serve `frontend/` with nginx/caddy and proxy `/api/*` → `127.0.0.1:8001`
(or set the `API` base in `app.js`). Enable HTTPS — mic + service worker need it.

## Option B — Railway / PaaS

- Backend: Dockerfile below; set start command
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (root dir `backend/`).
- Free tiers fit rules + templates + TF-IDF only: skip model downloads and
  the app still fully works (providers endpoint says so honestly).
- For full ML: a paid CPU box per Option A; keep static frontend on the free tier.

```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y tesseract-ocr && rm -rf /var/lib/apt/lists/*
WORKDIR /srv
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}"]
```

## Checklist before demo day

- [ ] `GET /api/providers` shows the engines you expect
- [ ] One Hindi + one scam check end-to-end (evidence native, stamp correct)
- [ ] First search warms the answer cache; first TTS-voice load warms models
- [ ] Post 2–3 seed entries on the fraud wall (empty walls teach nothing)
- [ ] `data/` (SQLite) is backed up or rebuilt — it is gitignored by design
