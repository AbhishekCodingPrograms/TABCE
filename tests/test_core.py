import sys
import os
import pytest
from fastapi.testclient import TestClient
from PIL import Image

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.main import app

client = TestClient(app)
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

# Ensure demo data exists
def setup_module(module):
    if not os.path.exists(os.path.join(DATA_DIR, 'demo_face', 'landmarks.json')):
        pytest.skip("Skipping tests: Demo data missing (Step 3 not run)")

# --- 1. API Tests ---
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_upload_without_consent():
    # Attempt to upload a dummy file without consent flag
    path = os.path.join(DATA_DIR, 'test_dummy.txt')
    with open(path, 'w') as f: f.write("dummy")
    
    with open(path, 'rb') as f:
        response = client.post("/upload", files={"file": f})
    
    os.remove(path)
    assert response.status_code == 400
    assert "consent required" in response.json()["detail"]

# --- 2. Module Tests ---
def test_predictor_scoring():
    from scripts.predict_performance import CreativePredictor
    pred = CreativePredictor()
    # Mock image path
    score = pred.predict("non_existent.jpg")
    assert score == 0.0 or isinstance(score, dict) # Fallback handling

def test_composer_safe_zones():
    from scripts.compose_creatives import LayoutEngine, Image
    engine = LayoutEngine()
    
    # Create dummy assets
    assets = {
        "model": Image.new("RGB", (1000, 1000), "white"),
        "packshot": Image.new("RGB", (200, 200), "red"),
        "headline": "Test",
        "subhead": "Sub",
        "price": "£10"
    }
    
    out_path = os.path.join(DATA_DIR, 'test_creative.jpg')
    success = engine.compose("social", assets, out_path)
    
    assert success == True
    assert os.path.exists(out_path)
    os.remove(out_path) # Cleanup

def test_model_generator_init():
    from scripts.model_generator import SyntheticModelGenerator
    base = os.path.join(DATA_DIR, 'demo_face', 'test_face.jpg')
    lm = os.path.join(DATA_DIR, 'demo_face', 'landmarks.json')
    gen = SyntheticModelGenerator(base, lm)
    assert gen.image is not None
