---
title: Saarthi Investor Resilience
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Saarthi — Investor Resilience Portal

Built for the **SANGYAN Investor Resilience Hackathon** (SEBI · NSDL · IIT BHU) —
**Track C: Investor Education for Bharat + Track E: Misinformation Literacy**.

Saarthi answers one villager's question: *"I got this message on WhatsApp — is it
dangerous, and what exactly do I do now?"* — in 11 languages, with zero API keys
and zero network dependency.

## What it does

| Route | Feature |
|---|---|
| `#/` Assess | Paste text / image URL / YouTube link / upload screenshot / speak — decisive **stop / verify / learn / other** stamp, plain-words verdict, friendly tags, evidence with honest uncertainty, action steps (incl. 1930 helpline) |
| `#/play` | **Spot-the-scam** game: 6 real-pattern cards, red-flag coaching, best score |
| `#/learn` | Voice-first lessons (10 topics × 11 languages) with listen button |
| `#/simulate` | Hype-vs-steady simulator: scam presets, inflation line, 30% crash toggle, rupee-gap verdict |
| `#/calculators` | SIP, compound, inflation, EMI, CAGR, bond yield, retirement — with plain-words teaching |
| `#/ask` | RAG search over 180 docs (16 hand-written + 148 SEBI booklet chunks), English grounded answers |
| `#/recover` | Already-paid wizard: situation steps + SCORES complaint draft generator |
| `#/wall` | Anonymous community fraud wall (digit-scrubbed, enum-validated) |

## Quickstart (2 minutes, no keys)

```bash
# backend :8001
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001

# frontend :8080 (separate terminal, repo root)
cd frontend && python -m http.server 8080
```

Open http://127.0.0.1:8080 — everything works offline except YouTube/article
fetching. First ML loads take ~30s (models download once from Hugging Face).

## API (all `POST` JSON unless noted)

| Endpoint | Purpose |
|---|---|
| `/api/analyze` | Full pipeline: classify → tags → action → evidence → explainer → simulator |
| `/api/learn` | One lesson (topic + lang) |
| `/api/simulate` | Hype/steady/inflation/crash projection |
| `/api/calc` + `GET /api/calcs` | 7 calculators + their field specs |
| `/api/search` | RAG answers with sources |
| `/api/ocr` | Screenshot upload → text (Tesseract) |
| `/api/transcribe` | Voice-note upload → text (Gnani keyed, else local whisper) |
| `/api/ingest-url` | Read a YouTube / image / article link |
| `/api/topics`, `/api/history`, `/api/wall`, `GET /api/providers` | Lists, history, fraud wall, engine status |

## Machine learning (all local)

- **MuRIL classifier** (4 classes: education / mixed / promotion / other) —
  fine-tuned with LoRA on 18.4k rows: 1.9k real public scam rows
  (Indian scam SMS + Hinglish scam calls) + synthetic templates in 5 languages
  + benign chatter. Scam recall is the optimized metric; rules own
  signals/tags/actions so every verdict stays explainable.
- **Embeddings**: multilingual-e5-small over 180 docs, hybrid with TF-IDF.
- **Qwen-1.5B**: English grounded RAG answers only (its Hindi failed eval —
  evidence ships hand-written in 11 langs instead; see ARCHITECTURE.md).
- Scripts: `scripts/fetch_real.py`, `build_dataset.py`, `train_muril.py`,
  `eval_muril.py`; corpus sync: `kb_sync.py`.

## Tests

```bash
cd backend && python -m pytest tests/ -q   # 11 contract + action tests
```

## Layout

```
backend/app/    FastAPI: classifier, evidence, explainer, simulator, calcs,
                kb_data, kb_official, rag(+embed), llm(local), stt, store, ingest, ocr, youtube
backend/scripts/ data + training pipeline (models/ and data/ are gitignored)
frontend/       static govt-portal UI (index.html, styles.css, app.js, sw.js)
ps/             hackathon brief (untracked reference)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for design and [DEPLOY.md](DEPLOY.md) for hosting.
