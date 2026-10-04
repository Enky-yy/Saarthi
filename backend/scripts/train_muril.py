"""Fine-tune MuRIL for education/mixed/promotion. GPU or CPU.
Usage: python3 scripts/train_muril.py  -> models/muril-clf
Eval: stratified accuracy + per-class F1 printed at the end."""
import json
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data", "train.jsonl")
OUT = os.environ.get("MURIL_MODEL_DIR", os.path.join(HERE, "..", "models", "muril-clf"))
LABELS = {"education": 0, "mixed": 1, "promotion": 2}


def main() -> None:
    from datasets import Dataset
    from sklearn.model_selection import train_test_split
    from transformers import (AutoModelForSequenceClassification, AutoTokenizer,
                              Trainer, TrainingArguments)

    rows = [json.loads(l) for l in open(DATA, encoding="utf-8")]
    texts = [r["text"] for r in rows]
    y = [LABELS[r["label"]] for r in rows]
    tr_x, ev_x, tr_y, ev_y = train_test_split(texts, y, test_size=0.1, random_state=7, stratify=y)
    print(f"train {len(tr_x)} / eval {len(ev_x)}")

    tok = AutoTokenizer.from_pretrained("google/muril-base-cased")
    model = AutoModelForSequenceClassification.from_pretrained("google/muril-base-cased", num_labels=3)
    # LoRA: train ~1% of weights so training fits beside the live server on 6GB VRAM.
    from peft import LoraConfig, TaskType, get_peft_model
    model = get_peft_model(model, LoraConfig(task_type=TaskType.SEQ_CLS, r=32, lora_alpha=64, lora_dropout=0.05,
                                             target_modules=["query", "key", "value", "dense"]))
    model.print_trainable_parameters()

    def enc(batch):
        return tok(batch["text"], truncation=True, padding="max_length", max_length=128)
    train_ds = Dataset.from_dict({"text": tr_x, "labels": tr_y}).map(enc, batched=True)
    eval_ds = Dataset.from_dict({"text": ev_x, "labels": ev_y}).map(enc, batched=True)
    train_ds.set_format("torch", columns=["input_ids", "attention_mask", "labels"])
    eval_ds.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

    import torch
    args = TrainingArguments(
        output_dir=OUT + "-ckpt", num_train_epochs=5, per_device_train_batch_size=8,
        gradient_accumulation_steps=2,
        per_device_eval_batch_size=32, learning_rate=1e-4, weight_decay=0.01,
        eval_strategy="epoch", save_strategy="epoch", load_best_model_at_end=True,
        fp16=torch.cuda.is_available(), seed=7, report_to="none", save_total_limit=1,
    )
    from sklearn.metrics import accuracy_score, f1_score

    def metrics(p):
        pred = np.argmax(p.predictions, axis=1)
        return {"accuracy": accuracy_score(p.label_ids, pred),
                "macro_f1": f1_score(p.label_ids, pred, average="macro")}

    Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=eval_ds,
            compute_metrics=metrics).train()
    model = model.merge_and_unload()
    model.save_pretrained(OUT)
    tok.save_pretrained(OUT)
    print("saved ->", OUT)


if __name__ == "__main__":
    main()
