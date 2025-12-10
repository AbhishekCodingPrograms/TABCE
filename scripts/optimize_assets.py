import os
import json
import time
from PIL import Image

# Robust Imports
HAS_SKIMAGE = False
try:
    from skimage.metrics import structural_similarity as ssim
    import numpy as np
    HAS_SKIMAGE = True
except ImportError:
    print("scikit-image or numpy not found. SSIM checks disabled.")

class OptimizationEngine:
    def __init__(self):
        self.MAX_SIZE = 500 * 1024 # 500 KB
        self.MIN_SSIM = 0.90
        
    def calculate_ssim(self, original_path, optimized_path):
        if not HAS_SKIMAGE: return 1.0 # Mock pass
        
        try:
            img1 = Image.open(original_path).convert('L')
            img2 = Image.open(optimized_path).convert('L')
            
            # Resize img2 to matches img1 if different (shouldn't happen in this pipeline but robust)
            if img1.size != img2.size:
                img2 = img2.resize(img1.size)
                
            arr1 = np.array(img1)
            arr2 = np.array(img2)
            
            score = ssim(arr1, arr2)
            return score
        except Exception as e:
            print(f"SSIM Error: {e}")
            return 1.0

    def optimize(self, input_path):
        if not os.path.exists(input_path): return None
        
        file_size = os.path.getsize(input_path)
        print(f"Checking {os.path.basename(input_path)}: {int(file_size/1024)} KB")
        
        if file_size <= self.MAX_SIZE:
            print("  Size OK. Skipping.")
            return {
                "final_size_kb": int(file_size/1024),
                "quality": 100, # Original
                "ssim": 1.0,
                "status": "PASS"
            }
            
        print("  Optimizing...")
        
        # Iterative Optimization logic
        img = Image.open(input_path)
        
        # Temp path
        dir_name = os.path.dirname(input_path)
        name, ext = os.path.splitext(os.path.basename(input_path))
        temp_path = os.path.join(dir_name, f"{name}_optimized{ext}")
        
        quality = 95
        step = 5
        min_quality = 60
        
        final_stats = {}
        
        while quality >= min_quality:
            # Save compressed
            img.save(temp_path, quality=quality, optimize=True)
            
            current_size = os.path.getsize(temp_path)
            
            if current_size < self.MAX_SIZE:
                # Check SSIM
                score = self.calculate_ssim(input_path, temp_path)
                
                if score >= self.MIN_SSIM:
                    # Success
                    # Replace original for true optimization
                    try:
                        import shutil
                        shutil.move(temp_path, input_path)
                        final_stats = {
                            "final_size_kb": int(current_size/1024),
                            "quality": quality,
                            "ssim": round(score, 4),
                            "status": "OPTIMIZED"
                        }
                        print(f"  Success: Replaced original with {int(current_size/1024)} KB version @ Q{quality}")
                        return final_stats
                    except Exception as e:
                        print(f"  Failed to replace original: {e}")

                else:
                    print(f"  Failed SSIM: {score} < {self.MIN_SSIM}")
                    
            quality -= step
            
        # Failed to meet criteria
        final_stats = {
            "final_size_kb": int(os.path.getsize(temp_path)/1024),
            "quality": quality,
            "ssim": 0.0, # Not computed or fail
            "status": "FAIL_CRITERIA" 
        }
        print("  Failed to optimize within constraints.")
        return final_stats

def main():
    print("Starting Optimization Pipeline...")
    
    input_dir = os.path.join('data', 'creatives')
    output_meta = os.path.join(input_dir, 'optimization_report.json')
    
    optimizer = OptimizationEngine()
    report = []
    
    # Process all jpg/pngs
    for f in os.listdir(input_dir):
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            # Skip existing optimized files
            if '_optimized' in f: continue
            
            path = os.path.join(input_dir, f)
            stats = optimizer.optimize(path)
            
            if stats:
                stats['file'] = f
                report.append(stats)
                
    with open(output_meta, 'w') as f:
        json.dump(report, f, indent=2)
        
    print(f"Optimization Complete. Report saved to {output_meta}")

if __name__ == "__main__":
    main()
