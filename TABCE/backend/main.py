from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
import uuid
import random
import logging

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TABCE_Backend")

app = FastAPI(title="TABCE API")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
base_dir = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(base_dir, "../data")
PACKSHOTS_DIR = os.path.join(DATA_DIR, "packshots")
MODELS_DIR = os.path.join(DATA_DIR, "models")
OUTPUT_DIR = os.path.join(DATA_DIR, "output")

os.makedirs(PACKSHOTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------------------------------------------------
# DEPENDENCY HANDLING & MOCKING
# ---------------------------------------------------------
USE_MOCKS = False

try:
    import cv2
    import numpy as np
    from models.face_mesh import FaceMeshExtractor
    from models.synthetic_gen import SyntheticModelGen
    from models.makeup import VirtualMakeup
    from models.packshot import PackshotProcessor
    from models.composer import CreativeComposer
    from models.predictor import PerformancePredictor
    
    # Initialize Real Models
    packshot_proc = PackshotProcessor()
    synthetic_gen = SyntheticModelGen()
    makeup_engine = VirtualMakeup()
    composer = CreativeComposer()
    predictor = PerformancePredictor()
    face_mesh = FaceMeshExtractor()
    logger.info("✅ All AI dependencies loaded successfully.")

except ImportError as e:
    logger.warning(f"⚠️ Missing dependency ({e}). Switching to DEMO MOCK mode.")
    logger.warning("This is expected on Python 3.12+ or if modules are not installed.")
    USE_MOCKS = True

    # Define Mocks
    class MockProcessor:
        def process_packshot(self, file_path, out_dir):
            base = os.path.basename(file_path)
            # Just pretend we processed it by copying or returning same path
            processed_name = base.replace(".jpg", "_processed.png").replace(".png", "_processed.png")
            # Create a dummy processed file if needed
            return os.path.join(out_dir, base) # Return original for simplicity

        def generate_variants(self, base_model_path, out_dir):
            # Generate dummy variant paths
            variants = []
            for i in range(2): # Generate 2 variants
                var_name = f"variant_{i}_{os.path.basename(base_model_path)}"
                var_path = os.path.join(out_dir, var_name)
                shutil.copy(base_model_path, var_path)
                variants.append({"path": var_path, "meta": {"pose": "front"}})
            return variants

        def process_image(self, path):
            # Mock landmarks
            return True 

        def process_look(self, path, landmarks, look):
            # Mock makeup application (return dummy bytes or None, handled in pipeline)
            # In mock mode, we won't actually use cv2 to write, so we rely on pipeline logic
            return None 

        def compose(self, model_path, packshot_path, metadata, out_dir, format_name):
            # Create a dummy composition
            out_name = f"final_{format_name}_{uuid.uuid4().hex[:6]}.jpg"
            out_path = os.path.join(out_dir, out_name)
            # Just copy the model image as the "final" ad
            shutil.copy(model_path, out_path)
            return out_path

        def predict(self, path):
            return round(random.uniform(0.75, 0.98), 2)

    # Initialize Mocks
    packshot_proc = MockProcessor()
    synthetic_gen = MockProcessor()
    makeup_engine = MockProcessor()
    composer = MockProcessor()
    predictor = MockProcessor()
    face_mesh = MockProcessor()


# -- Models --
class GenerationConfig(BaseModel):
    product_id: str
    model_id: str = "default_model" 
    target_segments: List[str] = ["gen-z", "millennial"]
    theme: str = "modern"
    makeup_intensity: int = 50
    consent_obtained: bool = False

class GenerationResponse(BaseModel):
    job_id: str
    status: str

# -- Endpoints --

@app.post("/upload/packshot")
async def upload_packshot(file: UploadFile = File(...)):
    """Step 6: Ingest and process packshot"""
    safe_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(PACKSHOTS_DIR, safe_name)
    
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    # Process
    processed_path = packshot_proc.process_packshot(file_path, PACKSHOTS_DIR)
    
    return {"id": safe_name, "processed_url": processed_path}

@app.post("/generate")
async def generate_variants(config: GenerationConfig, background_tasks: BackgroundTasks):
    """Step 10: Orchestrate generation"""
    if not config.consent_obtained:
        raise HTTPException(status_code=400, detail="Consent required for AI generation.")
        
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)
    
    background_tasks.add_task(run_generation_pipeline, job_id, config, job_dir)
    
    return {"job_id": job_id, "status": "processing"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    job_dir = os.path.join(OUTPUT_DIR, job_id)
    if not os.path.exists(job_dir):
        raise HTTPException(404, "Job not found")
        
    files = os.listdir(job_dir)
    # Filter for final images (assuming they start with 'final_' in mock or real)
    variants = [f for f in files if f.endswith('.jpg') and 'final' in f]
    
    # If using real logic, might just look for any jpgs
    if not variants and USE_MOCKS:
         variants = [f for f in files if f.endswith('.jpg')]

    state = "completed" if len(variants) > 0 else "processing"
    
    return {
        "status": state,
        "variants": [f"/download/{job_id}/{v}" for v in variants],
        "count": len(variants)
    }

@app.get("/download/{job_id}/{filename}")
async def download_file(job_id: str, filename: str):
    file_path = os.path.join(OUTPUT_DIR, job_id, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(404, "File not found")

# Orchestration Logic (Step 10)
def run_generation_pipeline(job_id: str, config: GenerationConfig, output_dir: str):
    logger.info(f"Starting Job {job_id}")
    
    # 1. Get Packshot
    packshot_path = os.path.join(PACKSHOTS_DIR, config.product_id)
    # Handle mock processor generic return
    if not os.path.exists(packshot_path):
        logger.warning(f"Packshot not found at {packshot_path}")
        # dummy fallback
        from PIL import Image
        img = Image.new('RGB', (500, 500), color='white')
        img.save(packshot_path)

    # 2. Get Model
    base_model_path = os.path.join(MODELS_DIR, "default_model.jpg")
    if not os.path.exists(base_model_path):
        from PIL import Image
        img = Image.new('RGB', (800, 1200), color = 'gray')
        img.save(base_model_path)

    # 3. Generate Synthetic Variants
    model_variants = synthetic_gen.generate_variants(base_model_path, output_dir)
    
    # 4. Apply Makeup & Compose
    final_variants = []
    
    for model_var in model_variants:
        # Detect landmarks
        landmarks = face_mesh.process_image(model_var["path"])
        
        active_model = model_var["path"]
        
        # Apply Makeup (Only if using real CV2, otherwise skip or use mock)
        if landmarks and not USE_MOCKS:
            look = {
                "lipstick": {"color": (0,0,150), "intensity": config.makeup_intensity / 100}
            }
            try:
                makeup_img = makeup_engine.process_look(model_var["path"], landmarks, look)
                makeup_path = model_var["path"].replace(".jpg", "_makeup.jpg")
                import cv2
                cv2.imwrite(makeup_path, makeup_img)
                active_model = makeup_path
            except Exception as e:
                logger.error(f"Makeup failed: {e}")

        # Compose
        for fmt in ["instagram_feed", "instagram_story"]:
            final_path = composer.compose(
                active_model, 
                packshot_path, 
                {"headline": f"Theme: {config.theme}", "price": "£25.00"}, 
                output_dir, 
                format_name=fmt
            )
            
            if final_path:
                score = predictor.predict(final_path)
                final_variants.append({
                    "file": os.path.basename(final_path),
                    "score": score
                })

    # Save Ranking
    import json
    with open(os.path.join(output_dir, "ranking.json"), "w") as f:
        json.dump(final_variants, f, indent=2)
        
    logger.info(f"Job {job_id} Finished. Generated {len(final_variants)} assets.")
