# DEPLOY — Saarthi

Two static-ish pieces: a FastAPI backend and dependency-free static files.
No database server, no keys, no external APIs (Gnani STT key optional).

## Option A — single VPS (recommended demo path)

Minimum: 2 vCPU / 8 GB RAM (holds MuRIL + e5 + Qwen-1.5B + whisper-tiny).
GPU optional (faster RAG answers; everything works on CPU).

```bash
# 1. code + python deps (CPU-only torch on CPU boxes — default requirements
#    pull CUDA wheels; swap with: pip install torch --index-url https://download.pytorch.org/whl/cpu)
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
#
# Rules-only mode (512MB boxes, free PaaS): disable every model —
#   MURIL_MODEL_DIR=/none EMBED_MODEL=/none LOCAL_GEN_MODEL=
# The app stays fully functional on rules + templates + TF-IDF.
```

Serve `frontend/` with nginx/caddy and proxy `/api/*` → `127.0.0.1:8001`
(or set the `API` base in `app.js`). Enable HTTPS — mic + service worker need it.

## Option B — free split (no paid plan anywhere)
**Verified Oct 2026: Hugging Face Docker/Gradio Spaces need a paid plan.**
Free accounts get Static Spaces + ZeroGPU demos only — so:

- Frontend → **Hugging Face Static Space** or Cloudflare Pages (free, fast,
  offline-capable). Point the `API` base in `app.js` at your backend URL.
- Backend → **Oracle Cloud Always-Free VPS** (4 ARM cores + 24GB RAM, free
  forever, persistent disk) following Option A. Full ML stack at ₹0.

The root `Dockerfile` stays for VPS/PaaS Docker deploys.

## Option C — Render / Railway free tier (rules-only, easiest permanent link)

The repo ships a slim image + configs: `Dockerfile.slim`
(torch-free: no torch/transformers/whisper packages), `railway.toml`, `render.yaml`. One container serves
UI + API on `$PORT`, rules + templates + TF-IDF + OCR — no keys needed.

**Render:** Dashboard → New → Web Service → point at the repo (it auto-reads
`render.yaml`) → free plan → Deploy. Health check is `/health`.

**Railway:** `railway up` in the repo (uses `railway.toml`) or New Project →
Repo → variables are pre-set. Note: Railway free tier sleeps; first load
wakes it in ~30s.

Limits to know: 512MB RAM (ML engines stay off by env), disks are ephemeral
(wall/history reset on redeploy — fine for demo), Tesseract Hindi included.

## Walkthrough — Oracle VPS + static frontend (do this together)

1. **Oracle account** (free): cloud.oracle.com → Always Free → create an
   Ampere A1 instance (4 OCPU / 24GB), Ubuntu 24.04. Open ingress for 80/443.
2. **On the box:**
   ```bash
   git clone <repo> sangyan-sebi && cd sangyan-sebi
   bash backend/deploy/setup.sh
   scp -r <dev-machine>:sangyan-sebi/backend/models backend/models   # trained MuRIL weights
   mkdir -p ~/.config/systemd/user
   cp backend/deploy/saarthi.service ~/.config/systemd/user/
   systemctl --user enable --now saarthi && loginctl enable-linger $USER
   sudo cp backend/deploy/saarthi-api.conf /etc/nginx/sites-available/
   # edit server_name, enable site, then:
   sudo certbot --nginx -d api.yourdomain.in && sudo systemctl reload nginx
   ```
3. **Frontend** (Cloudflare Pages / HF Static Space / any static host):
   upload `frontend/` as-is, then set your backend origin in
   `frontend/config.js`: `window.SAARTHI_API_URL = "https://api.yourdomain.in";`
4. Verify: `GET https://api.yourdomain.in/api/providers`, one Hindi check,
   post 2–3 fraud-wall seeds.

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
