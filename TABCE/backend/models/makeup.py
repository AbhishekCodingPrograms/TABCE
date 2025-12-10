import cv2
import numpy as np

class VirtualMakeup:
    def __init__(self):
        # Indices for MediaPipe Face Mesh
        self.LIPS_INDICES = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185]
        # Simplified cheek indices (approximate)
        self.LEFT_CHEEK = [123, 50, 36, 137, 205, 206]
        self.RIGHT_CHEEK = [352, 280, 266, 366, 425, 426]

    def apply_lipstick(self, image, landmarks, color=(0, 0, 255), intensity=0.4):
        """
        Apply lipstick using landmark mask.
        Color is BGR.
        """
        h, w, _ = image.shape
        mask = np.zeros((h, w), dtype=np.uint8)
        
        points = []
        for idx in self.LIPS_INDICES:
            lm = landmarks[idx]
            points.append((int(lm['x'] * w), int(lm['y'] * h)))
            
        if not points:
            return image
            
        points = np.array(points, dtype=np.int32)
        cv2.fillPoly(mask, [points], 255)
        
        # Soften edges
        mask = cv2.GaussianBlur(mask, (7, 7), 5)
        
        # Color layer
        overlay = image.copy()
        overlay[:] = color # Set entire image to color
        
        # Blend
        alpha = (mask.astype(float) / 255.0) * intensity
        alpha = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)
        
        out = (overlay * alpha + image * (1.0 - alpha)).astype(np.uint8)
        return out

    def process_look(self, image_path, landmarks, look_config):
        img = cv2.imread(image_path)
        if img is None: return None
        
        # Apply lipstick
        if 'lipstick' in look_config:
            c = look_config['lipstick'].get('color', (0, 0, 180)) # BGR red default
            i = look_config['lipstick'].get('intensity', 0.5)
            img = self.apply_lipstick(img, landmarks, c, i)
            
        return img
