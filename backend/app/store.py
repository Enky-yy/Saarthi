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


WALL_TYPES = ("telegram_tip", "fake_advisor", "upi_fraud", "kyc_phishing", "loan_app", "ponzi", "other")
WALL_STATES = ("AP", "Bihar", "Delhi", "Gujarat", "Haryana", "HP", "Jharkhand", "Karnataka", "Kerala", "MP", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "TN", "Telangana", "UP", "Uttarakhand", "WB", "Other")
WALL_AMOUNTS = ("caught_in_time", "lt_1k", "1k_10k", "10k_1L", "gt_1L")

import re as _re
_DIGITS = _re.compile(r"\d{6,}")


def scrub(text: str) -> str:
    """Strip phone/account-like digit runs. Wall is anonymous by design."""
    return _DIGITS.sub("[hidden]", (text or "")[:500]).strip()


def wall_add(scam_type: str, state: str, amount: str, text: str) -> dict | None:
    if scam_type not in WALL_TYPES or state not in WALL_STATES or amount not in WALL_AMOUNTS:
        return None
    try:
        con = _connect()
        con.execute("CREATE TABLE IF NOT EXISTS wall (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, scam_type TEXT, state TEXT, amount TEXT, text TEXT)")
        cur = con.execute(
            "INSERT INTO wall (created_at, scam_type, state, amount, text) VALUES (?,?,?,?,?)",
            (datetime.now(timezone.utc).isoformat(), scam_type, state, amount, scrub(text)),
        )
        con.commit()
        rowid = cur.lastrowid
        con.close()
        return {"id": rowid}
    except Exception:
        return None


def wall_read(limit: int = 20) -> dict:
    try:
        con = _connect()
        con.execute("CREATE TABLE IF NOT EXISTS wall (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, scam_type TEXT, state TEXT, amount TEXT, text TEXT)")
        counts = dict(con.execute("SELECT scam_type, COUNT(*) FROM wall GROUP BY scam_type").fetchall())
        total = con.execute("SELECT COUNT(*) FROM wall").fetchone()[0]
        rows = con.execute("SELECT created_at, scam_type, state, amount, text FROM wall ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        con.close()
        return {"total": total, "counts": counts,
                "recent": [dict(zip(("created_at", "scam_type", "state", "amount", "text"), r)) for r in rows]}
    except Exception:
        return {"total": 0, "counts": {}, "recent": []}
