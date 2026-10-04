"""SQLite history store (stdlib only). Replaces the in-memory list so checks
survive :8001 restarts. Stores hashes + labels only — never input text."""
import os
import sqlite3
from datetime import datetime, timezone

_DB = os.environ.get("SANGYAN_DB", os.path.join(os.path.dirname(__file__), "..", "data", "history.db"))


def _connect() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(os.path.abspath(_DB)), exist_ok=True)
    con = sqlite3.connect(_DB)
    con.execute(
        "CREATE TABLE IF NOT EXISTS history ("
        "job_id TEXT PRIMARY KEY, created_at TEXT, lang TEXT, "
        "input_hash TEXT, promo_label TEXT, evidence_level TEXT)"
    )
    return con


def save(job_id: str, lang: str, input_hash: str, promo_label: str, evidence_level: str) -> None:
    try:
        con = _connect()
        con.execute(
            "INSERT OR IGNORE INTO history VALUES (?,?,?,?,?,?)",
            (job_id, datetime.now(timezone.utc).isoformat(), lang, input_hash, promo_label, evidence_level),
        )
        con.commit()
        con.close()
    except Exception:
        pass


def recent(limit: int = 50) -> list[dict]:
    try:
        con = _connect()
        rows = con.execute(
            "SELECT job_id, created_at, lang, input_hash, promo_label, evidence_level "
            "FROM history ORDER BY created_at DESC LIMIT ?", (limit,),
        ).fetchall()
        con.close()
        return [dict(zip(("job_id", "created_at", "lang", "input_hash", "promo_label", "evidence_level"), r)) for r in rows]
    except Exception:
        return []
