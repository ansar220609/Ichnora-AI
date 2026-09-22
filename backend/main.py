from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Ichnora AI API", version="0.1.0")

class Transaction(BaseModel):
    amount: float = Field(gt=0)
    country: str = "Kazakhstan"
    device: str = "iPhone 14"
    frequency_10m: int = Field(default=1, ge=0)

def score_transaction(tx: Transaction) -> int:
    score = 9
    if tx.amount > 250_000:
        score += 34
    elif tx.amount > 70_000:
        score += 22
    if tx.country != "Kazakhstan":
        score += 18
    if tx.device == "Unknown device":
        score += 18
    if tx.device == "VPN / Proxy":
        score += 24
    if tx.frequency_10m >= 5:
        score += 15
    return min(score, 99)

@app.get("/health")
def health():
    return {"status": "online", "model": "demo-risk-engine"}

@app.post("/predict")
def predict(tx: Transaction):
    score = score_transaction(tx)
    action = "Block" if score >= 72 else "Challenge" if score >= 35 else "Approve"
    return {
        "risk_score": score,
        "action": action,
        "explanations": [
            "amount_deviation" if tx.amount > 70_000 else "normal_amount",
            "country_change" if tx.country != "Kazakhstan" else "normal_country",
            "device_or_velocity_anomaly" if tx.device != "iPhone 14" or tx.frequency_10m >= 5 else "normal_device",
        ],
    }
