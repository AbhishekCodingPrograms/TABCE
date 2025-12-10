import cv2
import mediapipe as mp
import numpy as np
import json
import os

class FaceMeshExtractor:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )

    def process_image(self, image_path, output_dir=None):
        """
        Extracts 478 landmarks from an image.
        Returns path to saved JSON and mesh OBJ (simulated).
        """
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        results = self.face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        if not results.multi_face_landmarks:
            print(f"No faces detected in {image_path}")
            return None, None

        landmarks = results.multi_face_landmarks[0]
        
        # Convert landmarks to JSON serializable list
        landmark_list = []
        for lm in landmarks.landmark:
            landmark_list.append({
                'x': lm.x,
                'y': lm.y,
                'z': lm.z
            })
            
        # Simulate OBJ generation (in a real app, this would reconstruct 3D geometry)
        # Here we just save landmarks
        
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            
            json_path = os.path.join(output_dir, f"{base_name}_landmarks.json")
            with open(json_path, 'w') as f:
                json.dump(landmark_list, f, indent=2)
                
            # Create a dummy OBJ file for the "mesh" requirement
            obj_path = os.path.join(output_dir, f"{base_name}_mesh.obj")
            with open(obj_path, 'w') as f:
                f.write(f"# Simple Face Mesh for {base_name}\n")
                for lm in landmark_list:
                    f.write(f"v {lm['x']} {lm['y']} {lm['z']}\n")
            
            return json_path, obj_path
            
        return landmark_list

if __name__ == "__main__":
    # Test block
    print("Initializing FaceMeshExtractor...")
    extractor = FaceMeshExtractor()
    # Mock run would go here
    print("FaceMesh ready.")
