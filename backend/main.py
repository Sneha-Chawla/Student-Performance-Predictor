from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load your model
model = pickle.load(open("model (1).pkl", "rb"))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class StudentData(BaseModel):
    Hours_Studied: float
    Attendance: float
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: float
    Tutoring_Sessions: float

@app.get("/")
def home():
    return {"message": "API running"}

@app.post("/predict")
def predict(data: StudentData):
    try:
        # Prepare features for the model
        features = pd.DataFrame([{
            "Hours_Studied": data.Hours_Studied,
            "Attendance": data.Attendance,
            "Sleep_Hours": data.Sleep_Hours,
            "Previous_Scores": data.Previous_Scores,
            "Motivation_Level": data.Motivation_Level,
            "Tutoring_Sessions": data.Tutoring_Sessions
        }])

        prediction = model.predict(features)[0]
        prediction = prediction * 1.1  # optional scaling
        performance = "Good" if prediction > 75 else "Average" if prediction > 50 else "Poor"

        return {
            "predicted_score": round(prediction, 2),
            "performance": performance
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))