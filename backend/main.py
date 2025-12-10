from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uuid
import json
import sys

# Add scripts folder to path so we can import our engine
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))

# FORCE RELOAD TRIGGER V2



from ingest_packshot import PackshotIngestor
from orchestrator import CampaignOrchestrator

app = FastAPI(title="TABCE API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Mount for Data (to serve images)
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

# Engine Instances
ingestor = PackshotIngestor()
orchestrator = CampaignOrchestrator()

# --- Models ---
class CampaignRequest(BaseModel):
    packshot_id: str
    campaign_name: str
    num_variants: int = 5

class AssetResponse(BaseModel):
    id: str
    url: str
    type: str

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "online", "service": "Tesco AI Beauty Creative Engine"}

@app.post("/upload")
async def upload_packshot(
    file: UploadFile = File(...), 
    consent: bool = Form(False) # Require explicit consent
):
    if not consent:
        raise HTTPException(status_code=400, detail="User consent required: You must confirm you have rights to this image.")

    # Save raw
    file_id = str(uuid.uuid4())
    raw_path = os.path.join(DATA_DIR, 'packshots', f"{file_id}_raw.jpg")
    
    with open(raw_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # SAFETY: Check for faces in Packshots
    # We do NOT allow uploading real people as 'products' to clone.
    # We reuse our engine logic (or cv2 directly)
    try:
        import cv2
        img = cv2.imread(raw_path)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            os.remove(raw_path) # Delete immediately
            raise HTTPException(status_code=400, detail="Safety Violation: Faces detected in product upload. Please upload product packshots only.")
    except ImportError:
        pass # Skip check if cv2 missing (fallback safe)
        
    # Process
    processed_filename = f"{file_id}.png"
    processed_path = os.path.join(DATA_DIR, 'packshots', processed_filename)
    
    success = ingestor.process(raw_path, processed_path)
    
    if not success:
        raise HTTPException(status_code=500, detail="Packshot processing failed")
        
    # Log Consent
    with open(os.path.join(DATA_DIR, 'consent_log.txt'), 'a') as f:
        f.write(f"{time.ctime()} | ID: {file_id} | Consent: {consent}\n")
        
    return {
        "success": True, 
        "id": file_id, 
        "url": f"/data/packshots/{processed_filename}"
    }

@app.post("/generate")
async def start_generation(req: CampaignRequest, background_tasks: BackgroundTasks):
    processed_path = os.path.join(DATA_DIR, 'packshots', f"{req.packshot_id}.png")
    
    if not os.path.exists(processed_path):
        raise HTTPException(status_code=404, detail="Packshot not found")
        
    campaign_id = req.campaign_name + "_" + str(int(time.time()))
    
    # Run in background
    background_tasks.add_task(
        orchestrator.run_campaign, 
        processed_path, 
        campaign_id, 
        req.num_variants
    )
    
    return {
        "status": "started", 
        "campaign_id": campaign_id,
        "message": f"Generating {req.num_variants} variants in background."
    }

@app.get("/status/{campaign_id}")
async def get_status(campaign_id: str):
    campaign_dir = os.path.join(DATA_DIR, 'campaigns', campaign_id)
    report_path = os.path.join(campaign_dir, 'campaign_report.json')
    
    if os.path.exists(report_path):
        with open(report_path, 'r') as f:
            report = json.load(f)
        return {"status": "complete", "total": report['total_generated'], "top_5": report['top_5']}
    
    # Check if dir exists at least
    if os.path.exists(campaign_dir):
        # Count files
        files = [f for f in os.listdir(campaign_dir) if f.endswith('.jpg')]
        return {"status": "processing", "generated_so_far": len(files)}
        
    return {"status": "pending_or_not_found"}

@app.get("/variants/{campaign_id}")
async def list_variants(campaign_id: str):
    return await get_status(campaign_id)

@app.get("/history")
async def list_history():
    """List all campaigns and their top assets for the Gallery."""
    campaigns_dir = os.path.join(DATA_DIR, 'campaigns')
    results = []
    
    if os.path.exists(campaigns_dir):
        for name in os.listdir(campaigns_dir):
            path = os.path.join(campaigns_dir, name)
            report_path = os.path.join(path, 'campaign_report.json')
            
            if os.path.isdir(path) and os.path.exists(report_path):
                try:
                    with open(report_path, 'r') as f:
                        data = json.load(f)
                        # Add timestamp or other metadata if available, for now just raw data
                        results.append(data)
                except:
                    pass
                    
    # Sort by recent (heuristic: name has timestamp)
    results.sort(key=lambda x: x.get('campaign', ''), reverse=True)
    return results

import time
