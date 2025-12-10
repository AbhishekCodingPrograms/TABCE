import cv2
import numpy as np
import os

class SyntheticModelGen:
    def __init__(self):
        pass

    def adjust_skin_tone(self, image_path, tone_factor=0.0):
        """
        Simulates skin tone adjustment by shifting hue/saturation in YCrCb or HSV space.
        tone_factor: -0.2 (lighter) to 0.2 (darker/warmer)
        """
        img = cv2.imread(image_path)
        if img is None:
            return None
            
        # Convert to HSV
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
        
        # Simple heuristic: adjust saturation and value to simulate skin depth
        # Real implementation would use segmentation masks to only target skin
        hsv[:, :, 1] = hsv[:, :, 1] * (1.0 + tone_factor) # Saturation
        hsv[:, :, 2] = hsv[:, :, 2] * (1.0 - (tone_factor * 0.5)) # Value
        
        hsv = np.clip(hsv, 0, 255)
        img_out = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        return img_out

    def generate_variants(self, base_image_path, output_dir):
        """
        Generates 5 demographic variants.
        """
        os.makedirs(output_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(base_image_path))[0]
        
        variants = [
            {"name": "fair", "factor": -0.3},
            {"name": "medium", "factor": 0.0},
            {"name": "tan", "factor": 0.2},
            {"name": "deep", "factor": 0.4},
            {"name": "cool", "factor": -0.1} 
        ]
        
        files = []
        for v in variants:
            img_var = self.adjust_skin_tone(base_image_path, v["factor"])
            if img_var is not None:
                out_path = os.path.join(output_dir, f"{base_name}_{v['name']}.jpg")
                cv2.imwrite(out_path, img_var)
                files.append({"path": out_path, "meta": v})
                
        return files

if __name__ == "__main__":
    gen = SyntheticModelGen()
    print("Synthetic Generator Ready")
