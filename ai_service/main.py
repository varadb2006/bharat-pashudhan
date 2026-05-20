from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from torchvision import transforms, models
from PIL import Image
import io
import json
import torch.nn as nn
from pathlib import Path


MODEL_DIR      = Path("model")
MODEL_PATH     = MODEL_DIR / "bpa_b4_final.pt"
METADATA_PATH  = MODEL_DIR / "model_metadata (1).json"

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)

CLASS_NAMES = metadata["class_names"]
NUM_CLASSES  = metadata["num_classes"]
IMG_SIZE     = metadata["image_size"]
NORM_MEAN    = metadata["normalisation_mean"]
NORM_STD     = metadata["normalisation_std"]

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"  Inference device: {DEVICE}")

model = models.efficientnet_b4(weights=None)
num_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.4, inplace=True),
    nn.Linear(num_features, 512),
    nn.ReLU(inplace=True),
    nn.Dropout(p=0.3),
    nn.Linear(512, NUM_CLASSES),
)

model.load_state_dict(
    torch.load(MODEL_PATH, map_location=DEVICE)
)

model.eval()
model = model.to(DEVICE)

print(f"  Model loaded: {NUM_CLASSES} breeds")
print(f"  Model ready for inference.")

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=NORM_MEAN, std=NORM_STD),
])

app = FastAPI(
    title       = "Bharat Pashudhan — Breed Identification API",
    description = "Identifies indigenous Indian cattle and buffalo breeds from images",
    version     = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class BreedPrediction(BaseModel):
    rank       : int    # 1, 2, or 3
    breed      : str    # "Gir", "Sahiwal", etc.
    confidence : float  # 87.24 (percentage, not decimal)

class PredictionResponse(BaseModel):
    success       : bool
    top_predictions : list[BreedPrediction]
    model_version : str

@app.get("/health")
def health_check():
    return {
        "status"     : "online",
        "model"      : "EfficientNet-B4",
        "breeds"     : NUM_CLASSES,
        "device"     : str(DEVICE)
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_breed(
    file: UploadFile = File(...)
):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(
            status_code = 400,
            detail      = f"Invalid file type: {file.content_type}. Upload a JPG or PNG image."
        )

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")

    except Exception as e:
        raise HTTPException(
            status_code = 400,
            detail      = f"Could not read image file: {str(e)}"
        )

    try:
        tensor = preprocess(image)
        tensor = tensor.unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            outputs = model(tensor)

        probabilities = torch.softmax(outputs[0], dim=0)

        top3_values, top3_indices = torch.topk(probabilities, k=3)

        predictions = []
        for rank, (confidence, class_idx) in enumerate(
            zip(top3_values.tolist(), top3_indices.tolist()),
            start=1
        ):
            predictions.append(BreedPrediction(
                rank       = rank,
                breed      = CLASS_NAMES[class_idx],
                confidence = round(confidence * 100, 2)
            ))

        return PredictionResponse(
            success            = True,
            top_predictions    = predictions,
            model_version      = "1.0.0"
        )

    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail      = f"Inference failed: {str(e)}"
        )