FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr tesseract-ocr-hin \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /srv
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY frontend/ ./frontend/

ENV FRONTEND_DIR=/srv/frontend \
    SANGYAN_DB=/tmp/saarthi-history.db \
    MURIL_MODEL_DIR=/srv/backend/models/muril-clf \
    PORT=7860

# Bake models + corpus so cold starts serve in seconds, not minutes.
# (muril-clf weights arrive via git-lfs with the repo.)
RUN cd backend \
 && python -c "from app.rag_embed import rebuild; print(rebuild(), 'docs embedded')" \
 && python kb_sync.py \
 && python -c "from app.rag_embed import rebuild; print(rebuild(), 'docs embedded')"

EXPOSE 7860
CMD ["sh", "-c", "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
