import os
import sys
import json
import random
from PIL import Image

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))

from ingest_packshot import PackshotIngestor
from optimize_assets import OptimizationEngine
from predict_performance import CreativePredictor

def run_qa():
    print("--- TABCE Final QA Checklist ---")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'qa_test')
    if not os.path.exists(data_dir): os.makedirs(data_dir)
    
    # 1. Processing 5 Packshots
    print("\n[QA-1] Bulk Processing 5 Packshots...")
    ingestor = PackshotIngestor()
    success_count = 0
    for i in range(5):
        # Create dummy dummy packshots (white bg)
        raw_path = os.path.join(data_dir, f"raw_{i}.jpg")
        img = Image.new('RGB', (800, 800), (255, 255, 255))
        # Add a 'product' (red square)
        for x in range(200, 600):
            for y in range(200, 600):
                img.putpixel((x,y), (255, 0, 0))
        img.save(raw_path)
        
        out_path = os.path.join(data_dir, f"proc_{i}.png")
        if ingestor.process(raw_path, out_path):
            success_count += 1
            
    print(f"Result: {success_count}/5 processed successfully.")
    
    # 2 & 3. Content Checks (Variants & Sizes)
    print("\n[QA-2 & QA-3] Verifying Generated Assets & Sizes...")
    campaign_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'campaigns')
    
    total_checked = 0
    passed_size = 0
    
    for root, dirs, files in os.walk(campaign_dir):
        for f in files:
            if f.endswith('.jpg') or f.endswith('.png'):
                total_checked += 1
                size_kb = os.path.getsize(os.path.join(root, f)) / 1024
                if size_kb < 500:
                    passed_size += 1
                else:
                    print(f"FAIL: {f} is {size_kb}KB")
                    
    print(f"Result: {passed_size}/{total_checked} assets are under 500KB.")
    
    # 4. Predictor Logic
    print("\n[QA-4] Verifying Predictor Logic...")
    predictor = CreativePredictor()
    # Create Good vs Bad image
    good_path = os.path.join(data_dir, "good.jpg")
    bad_path = os.path.join(data_dir, "bad.jpg")
    
    # Vibration/Contrast
    Image.new('RGB', (100, 100), (255, 0, 0)).save(good_path) # Vibrant Red
    Image.new('RGB', (100, 100), (100, 100, 100)).save(bad_path) # Gray
    
    score_good = predictor.predict(good_path)['score']
    score_bad = predictor.predict(bad_path)['score']
    
    print(f"Vibrant Score: {score_good}")
    print(f"Gray Score: {score_bad}")
    
    if score_good > score_bad:
        print("Result: Predictor correctly ranks high vibrancy/contrast higher.")
    else:
        print("Result: Predictor Fail.")

if __name__ == "__main__":
    run_qa()
