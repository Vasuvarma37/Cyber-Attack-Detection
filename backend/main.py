from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import joblib
import io
from collections import Counter

app = FastAPI(title="CyberGuard API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model   = joblib.load("xgboost_multiclass.pkl")
encoder = joblib.load("label_encoder.pkl")

# ── Exact 52 features the model was trained on (order matters) ──────────────
MODEL_FEATURES = [
    "DESTINATION PORT", "FLOW DURATION", "TOTAL FWD PACKETS",
    "TOTAL LENGTH OF FWD PACKETS", "FWD PACKET LENGTH MAX",
    "FWD PACKET LENGTH MIN", "FWD PACKET LENGTH MEAN", "FWD PACKET LENGTH STD",
    "BWD PACKET LENGTH MAX", "BWD PACKET LENGTH MIN", "BWD PACKET LENGTH MEAN",
    "BWD PACKET LENGTH STD", "FLOW BYTES/S", "FLOW PACKETS/S",
    "FLOW IAT MEAN", "FLOW IAT STD", "FLOW IAT MAX", "FLOW IAT MIN",
    "FWD IAT TOTAL", "FWD IAT MEAN", "FWD IAT STD", "FWD IAT MAX",
    "FWD IAT MIN", "BWD IAT TOTAL", "BWD IAT MEAN", "BWD IAT STD",
    "BWD IAT MAX", "BWD IAT MIN", "FWD HEADER LENGTH", "BWD HEADER LENGTH",
    "FWD PACKETS/S", "BWD PACKETS/S", "MIN PACKET LENGTH", "MAX PACKET LENGTH",
    "PACKET LENGTH MEAN", "PACKET LENGTH STD", "PACKET LENGTH VARIANCE",
    "FIN FLAG COUNT", "PSH FLAG COUNT", "ACK FLAG COUNT",
    "AVERAGE PACKET SIZE", "SUBFLOW FWD BYTES", "INIT_WIN_BYTES_FORWARD",
    "INIT_WIN_BYTES_BACKWARD", "ACT_DATA_PKT_FWD", "MIN_SEG_SIZE_FORWARD",
    "ACTIVE MEAN", "ACTIVE MAX", "ACTIVE MIN",
    "IDLE MEAN", "IDLE MAX", "IDLE MIN",
]

BENIGN_LABELS = {"BENIGN", "NORMAL", "NORMAL.", "BENIGN.", "NORMAL TRAFFIC"}


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """
    Align any CICIDS-style CSV to the 52 features the model expects:
      1. Strip whitespace + upper-case all column names
      2. Add any missing features as 0
      3. Drop everything not in MODEL_FEATURES, enforce order
      4. Coerce to float, kill inf / NaN
    """
    df = df.copy()
    df.columns = [c.strip().upper() for c in df.columns]

    for feat in MODEL_FEATURES:
        if feat not in df.columns:
            df[feat] = 0.0

    df = df[MODEL_FEATURES]
    df = df.apply(pd.to_numeric, errors="coerce")
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)
    return df


# ────────────────────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {
        "status": "online",
        "message": "CyberGuard Detection API v2.0",
        "model": "XGBoost Multiclass",
        "features": len(MODEL_FEATURES),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Upload a CICIDS-format CSV.
    Returns:
      - total_rows      : int
      - attack_summary  : { label: count, ... }  (ALL labels)
      - benign_count    : int
      - attack_count    : int
      - detection_rate  : float  (0–100 %)
      - predictions     : [{ row, prediction }, ...]  — ALL rows
    """
    try:
        raw_bytes = await file.read()
        df = pd.read_csv(io.BytesIO(raw_bytes))

        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded CSV is empty.")

        df_processed = preprocess(df)
        # Pass numpy array to bypass XGBoost internal feature-name validation
        predictions  = model.predict(df_processed.values)
        labels       = encoder.inverse_transform(predictions)

        # Build summary
        counts = dict(Counter(labels))

        # Classify each label as benign or attack
        benign_count = sum(
            v for k, v in counts.items()
            if k.strip().upper() in BENIGN_LABELS
        )
        attack_count    = len(labels) - benign_count
        detection_rate  = round((attack_count / max(len(labels), 1)) * 100, 2)

        results = [
            {"row": i, "prediction": str(label)}
            for i, label in enumerate(labels)
        ]

        return {
            "total_rows":     len(df),
            "attack_summary": counts,
            "benign_count":   int(benign_count),
            "attack_count":   int(attack_count),
            "detection_rate": detection_rate,
            "predictions":    results,          # ← ALL rows, no cap
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export")
async def export_predictions(file: UploadFile = File(...)):
    """
    Same as /predict but returns a downloadable CSV with predictions appended.
    """
    try:
        raw_bytes = await file.read()
        df = pd.read_csv(io.BytesIO(raw_bytes))

        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded CSV is empty.")

        df_processed = preprocess(df)
        # Pass numpy array to bypass XGBoost internal feature-name validation
        predictions  = model.predict(df_processed.values)
        labels       = encoder.inverse_transform(predictions)

        df["PREDICTED_LABEL"] = labels
        df["IS_ATTACK"] = [
            "NO" if str(l).strip().upper() in BENIGN_LABELS else "YES"
            for l in labels
        ]

        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=predictions.csv"},
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))