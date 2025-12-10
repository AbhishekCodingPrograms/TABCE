import os
import sys
import time
import json
from PIL import Image, ImageOps

# Robust Import for Background Removal
HAS_REMBG = False
try:
    from rembg import remove
    HAS_REMBG = True
except ImportError:
    print("rembg not installed. Falling back to simple heuristic transparency.")

class PackshotIngestor:
    def __init__(self):
        self.target_size = (500, 500)
        self.padding = 20
        
    def process(self, input_path, output_path):
        print(f"Processing {input_path}...")
        
        try:
            img = Image.open(input_path).convert('RGBA')
        except Exception as e:
            print(f"Error opening image: {e}")
            return False
            
        # 1. Background Removal
        if HAS_REMBG:
            print("Removing background using AI (rembg)...")
            try:
                img = remove(img)
            except Exception as e:
                print(f"AI Background removal failed ({e}), using fallback.")
                img = self.simple_bg_removal(img)
        else:
            print("rembg not detected. Skipping background removal to preserve image details.")
            # img = self.simple_bg_removal(img) # Disabled: Naive removal destroys highlights
            
        # 2. Trim Whitespace
        img = self.trim(img)
        
        # 3. Normalize Size (Fit within 500x500 maintaining aspect ratio)
        img = self.normalize_size(img)
        
        # 4. Save Optimized
        img.save(output_path, "PNG", optimize=True)
        return True
        
    def simple_bg_removal(self, img):
        # Naive approach: Convert white pixels to transparent
        # Only feasible if we assume white background packshots
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Change all white (also shades of whites) to transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        return img
        
    def trim(self, img):
        # Get bounding box of non-zero alpha
        bbox = img.getbbox()
        if bbox:
            return img.crop(bbox)
        return img
        
    def normalize_size(self, img):
        # Resize to fit within target_size with padding
        ratio = min((self.target_size[0] - self.padding*2) / img.width, 
                   (self.target_size[1] - self.padding*2) / img.height)
                   
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Create canvas
        canvas = Image.new('RGBA', self.target_size, (0,0,0,0))
        # Paste centered
        x = (self.target_size[0] - new_size[0]) // 2
        y = (self.target_size[1] - new_size[1]) // 2
        canvas.paste(img, (x, y))
        
        return canvas

def main():
    print("Starting Packshot Ingestion Service...")
    
    input_path = os.path.join('data', 'packshots', 'sample_product.jpg')
    output_path = os.path.join('data', 'packshots', 'processed_product.png')
    meta_path = os.path.join('data', 'packshots', 'metadata.json')
    
    ingestor = PackshotIngestor()
    
    start_time = time.time()
    success = ingestor.process(input_path, output_path)
    end_time = time.time()
    
    if success:
        file_size = os.path.getsize(output_path)
        meta = {
            "original_file": input_path,
            "processed_file": output_path,
            "size_bytes": file_size,
            "dimensions": "500x500",
            "processing_time": round(end_time - start_time, 2),
            "bg_removal_method": "AI (rembg)" if HAS_REMBG else "Heuristic"
        }
        
        with open(meta_path, 'w') as f:
            json.dump(meta, f, indent=2)
            
        print(f"Success! Processed packshot saved to {output_path}")
        print(json.dumps(meta, indent=2))
    else:
        print("Failed to process packshot.")

if __name__ == "__main__":
    main()
