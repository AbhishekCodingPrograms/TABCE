import os
import json
import random
from PIL import Image, ImageStat
import pickle

# Robust Import
HAS_SKLEARN = False
try:
    from sklearn.ensemble import RandomForestRegressor
    import numpy as np
    HAS_SKLEARN = True
except ImportError:
    pass

class CreativePredictor:
    def __init__(self):
        self.model = None
        # Heuristic weights for fallback
        self.weights = {
            "brightness": 0.2,
            "contrast": 0.3,
            "color_vibrancy": 0.3,
            "face_prominence": 0.2
        }
        
        if HAS_SKLEARN:
            # Train a mock model on startup for demonstration
            self.train_mock_model()

    def extract_features(self, img_path):
        # Extract visual features
        # 1. Histogram / Color Vibrancy
        # 2. Contrast
        # 3. Brightness
        
        try:
            img = Image.open(img_path).convert('RGB')
        except:
            return None
            
        # Feature 1: Brightness
        stat = ImageStat.Stat(img.convert('L'))
        brightness = stat.mean[0] / 255.0
        
        # Feature 2: Contrast (Std Dev of luminance)
        contrast = stat.stddev[0] / 255.0
        
        # Feature 3: Vibrancy (Saturation)
        hsv = img.convert('HSV')
        h, s, v = hsv.split()
        s_stat = ImageStat.Stat(s)
        vibrancy = s_stat.mean[0] / 255.0
        
        return [brightness, contrast, vibrancy]

    def train_mock_model(self):
        # Simulate dataset
        X = []
        y = []
        
        # We manually correlated vibrancy and contrast to higher CTR
        for _ in range(100):
            b = random.random()
            c = random.random()
            v = random.random()
            
            # Synthetic Formula: CTR = 0.3*C + 0.4*V + 0.1*B + Noise
            ctr = (0.3 * c) + (0.4 * v) + (0.1 * b) + random.uniform(-0.05, 0.05)
            ctr = max(0, min(1, ctr))
            
            X.append([b, c, v])
            y.append(ctr)
            
        self.model = RandomForestRegressor(n_estimators=10, random_state=42)
        self.model.fit(X, y)
        print("Mock Performance Model Trained.")

    def predict(self, img_path):
        features = self.extract_features(img_path)
        if not features: return 0.0
        
        if HAS_SKLEARN and self.model:
            # Predict
            score = self.model.predict([features])[0]
            
            # Explainability
            # For RF, feature importance is global, but we can infer local contribution
            # Simple heuristic explanation based on high feature values
            explanation = []
            if features[1] > 0.6: explanation.append("High Contrast")
            if features[2] > 0.5: explanation.append("Vibrant Colors")
            
        else:
            # Fallback Heuristic
            score = (
                features[0]*self.weights['brightness'] + 
                features[1]*self.weights['contrast'] + 
                features[2]*self.weights['color_vibrancy']
            )
            explanation = ["Heuristic Scoring"]
            
        return {
            "score": round(score * 100, 1), # 0-100 scale
            "features": {
                "brightness": round(features[0], 2),
                "contrast": round(features[1], 2),
                "vibrancy": round(features[2], 2)
            },
            "explanation": explanation
        }

def main():
    print("Starting ML Performance Predictor...")
    
    input_dir = os.path.join('data', 'creatives')
    predictor = CreativePredictor()
    
    ranking = []
    
    for f in os.listdir(input_dir):
        if f.lower().endswith(('.jpg', '.png')) and 'optimized' in f:
            # We score the optimized assets
            path = os.path.join(input_dir, f)
            result = predictor.predict(path)
            
            ranking.append({
                "file": f,
                "score": result['score'],
                "metrics": result['features']
            })
            
    # Sort by score desc
    ranking.sort(key=lambda x: x['score'], reverse=True)
    
    print("\n--- Creative Performance Ranking ---")
    for r in ranking:
        print(f"Top Candidate: {r['file']} | Expected CTR Score: {r['score']}/100")
        print(f"   [vib: {r['metrics']['vibrancy']}, cont: {r['metrics']['contrast']}]")

if __name__ == "__main__":
    main()
