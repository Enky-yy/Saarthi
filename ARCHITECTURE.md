# ARCHITECTURE — Saarthi

## Request flow (`POST /api/analyze`)

```
text | image_url | youtube_url | upload/voice-note
        └─ bare URL? ── ingest (captions / OCR / article text)
                        │
              ┌─────────┴──────────┐
              │  MuRIL classifier   │── label + confidence
              │  (rules fallback)   │
              └─────────┬──────────┘
              rule signals + tags (guarantee, urgency, group_cta, …)
                        │
              action gate: promotion/guarantee/funnel → STOP
                           group-invite/tip/funnel → VERIFY (never green)
                           education, no pressure → LEARN
                           chit-chat → OTHER (grey stamp)
                        │
     evidence (official/weak/none + native uncertainty) ─ always present
     explainer (template, 11 langs) ─ simulator ─ verdict + steps (11 langs)
```

Rules own **everything the user reads** (signals, tags, actions, evidence,
explanations). ML owns **one judgment**: which of 4 buckets the text falls in.
If any model is missing, slow, or errors, the pipeline degrades to rules +
templates with identical API shape. Nothing ever 500s because a model sneezed.

## Why this shape (measured, not assumed)

| Decision | Evidence |
|---|---|
| MuRIL over regex/XLM-R | Handles Hinglish/code-mix + typos; 8/11 tricky incl. 4/4 scam recall |
| 4th `other` class | v2 read 100/100 benign chats as scams; chatter is now grey-stamped |
| e5-small + TF-IDF hybrid | Hindi queries retrieve English SEBI docs (verified) |
| Qwen-1.5B for EN RAG answers only | Grounded answers verified good in English; its Hindi was gibberish → evidence translated by hand (4 states × 11 langs in `evidence.py`) |
| Gemini/Bhashini: zero | Dropped entirely — per-call cost was never the issue; offline reliability, privacy, and demo safety were |
| SQLite everywhere | history, wall, answer cache — zero services to operate |

## Training loop (reproducible)

```
scripts/fetch_real.py  → data/real_promotion.jsonl (1.9k, deduped; HF hub is 93% template dupes)
scripts/build_dataset.py → data/train.jsonl (18.4k: real promo + synthetic 5 langs + formal rows + chatter)
scripts/train_muril.py   → models/muril-clf (LoRA r32, 5 epochs, eval F1 tracked)
scripts/eval_muril.py    → tricky-set + scam recall + ham false-stop gate
```

Fraud-wall reports append as future promotion rows (`wall_rows()`) — the
dataset flywheel. Each retrain round so far found the next edge (formal tone →
`other` class → funnel rule); the eval script is the gate, not vibes.

## Frontend

Static, no framework: hash routes (`#/`, `#/play`, `#/learn`, `#/simulate`,
`#/calculators`, `#/ask`, `#/recover`, `#/wall`), 11-language dictionary
(EN/HI full + 9 more), device speech + local-voice picking, canvas charts,
service-worker offline shell. Govt-portal visual system (navy/bone/saffron).

## Guardrails (non-negotiable)

- Action-guidance (stop/verify/learn), never true/false verdicts; uncertainty
  always rendered.
- No buy/sell signals, no predictions, no monetisation, no PII (wall scrubs
  6+-digit runs; history stores hashes only).
- Voice/OCR/transcribe degrade with honest messages, never silent failure.
