from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

# CORS (permite frontend GitHub Pages)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta segura del modelo (CRÍTICO en Render)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "agrolyz_v5_4clases.keras")

print("Cargando modelo...")
modelo = tf.keras.models.load_model(MODEL_PATH)

CLASES = ['No_Maiz', 'Otra_Enfermedad', 'Roya', 'Sana']
print("Modelo listo")

@app.get("/")
def root():
    return {"status": "API Agrolyz activa"}

@app.post("/predecir")
async def predecir(imagen: UploadFile = File(...)):

    contenido = await imagen.read()
    img = Image.open(io.BytesIO(contenido)).convert("RGB")

    img = img.resize((300, 300))  # ⚠️ debe coincidir con tu modelo
    img_array = np.array(img, dtype=np.float32)

    img_array = np.expand_dims(img_array, axis=0)

    preds = modelo.predict(img_array, verbose=0)[0]

    confianza = float(np.max(preds))
    clase = CLASES[int(np.argmax(preds))]

    if clase == "No_Maiz" or confianza < 0.70:
        return {
            "valido": False,
            "mensaje": "No se detectó una hoja de maíz clara.",
            "sugerencia": "Tome la foto más cerca de la hoja.",
            "confianza": round(confianza * 100, 1)
        }

    return {
        "valido": True,
        "diagnostico": clase,
        "confianza": round(confianza * 100, 1),
        "desglose": {
            "Otra_Enfermedad": round(float(preds[1]) * 100, 1),
            "Roya": round(float(preds[2]) * 100, 1),
            "Sana": round(float(preds[3]) * 100, 1),
        }
    }