#!/usr/bin/env bash
# Saarthi one-shot setup for Oracle Always-Free (Ubuntu 24.04 ARM) or any Ubuntu box.
# Run as a sudo-capable user:  bash backend/deploy/setup.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

sudo apt-get update
sudo apt-get install -y python3-venv python3-pip tesseract-ocr tesseract-ocr-hin nginx certbot python3-certbot-nginx

python3 -m venv .venv
.venv/bin/pip install --upgrade pip
# CPU-only torch (ARM+x86) — CUDA wheels waste gigabytes here:
.venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
.venv/bin/pip install -r backend/requirements.txt

cd backend
../.venv/bin/python -c "from app.rag_embed import rebuild; print(rebuild(), 'docs embedded')"
../.venv/bin/python kb_sync.py
../.venv/bin/python -c "from app.rag_embed import rebuild; print(rebuild(), 'docs embedded')"
echo "Copy trained weights from your dev machine (or retrain here):"
echo "  scp -r backend/models <user>@<host>:~/sangyan-sebi/backend/models"
