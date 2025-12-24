from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import base64
import requests
from PIL import Image
import io

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

SDXL_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"


headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image: str


@app.post("/upload")
def upload_image(data: ImageRequest):
    image_base64 = data.image.split(",")[1]
    image_bytes = base64.b64decode(image_base64)

    payload = {
        "inputs": {
            "image": base64.b64encode(image_bytes).decode("utf-8"),
            "prompt": "storybook illustration of a smiling child, soft pastel colors, children's book art style",
            "strength": 0.35,
            "guidance_scale": 7
        }
    }

    response = requests.post(
        SDXL_URL,
        headers=headers,
        json=payload,
        timeout=60
    )

    print("SDXL status:", response.status_code)
    print("SDXL headers:", response.headers.get("content-type"))

    if response.status_code != 200:
        print("SDXL error:", response.text)
        return {"error": response.text}

    result_image_bytes = response.content

    result_base64 = base64.b64encode(result_image_bytes).decode("utf-8")

    print("Returning image size:", len(result_base64))

    return {
        "status": "success",
        "image": f"data:image/png;base64,{result_base64}"
    }
