import random

class PerformancePredictor:
    def __init__(self):
        # In a real system, load a trained sklearn model here
        pass

    def extract_features(self, image_path):
        """
        Extract naive features: Histogram, Contrast, Faces.
        """
        # Placeholder for CV extraction
        return [0.5, 0.2, 0.8] 

    def predict(self, image_path):
        """
        Returns CTR prediction (0-100) and rationale.
        """
        features = self.extract_features(image_path)
        
        # Naive random forest simulation
        base_ctr = 3.5
        variance = random.uniform(-1.0, 1.5)
        ctr = base_ctr + variance
        
        return {
            "ctr_prediction": round(ctr, 2),
            "visual_appeal": random.randint(80, 99),
            "insights": [
                "Good contrast detected",
                "Product visibility is high"
            ]
        }
