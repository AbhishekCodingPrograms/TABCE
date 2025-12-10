import json
import time
import os
import sys

# Try imports with graceful fallbacks
try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    HAS_MEDIAPIPE = False

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

# Configure IO paths
INPUT_IMAGE_PATH = os.path.join('data', 'demo_face', 'test_face.jpg')
OUTPUT_MESH_PATH = os.path.join('data', 'demo_face', 'mesh.obj')
OUTPUT_JSON_PATH = os.path.join('data', 'demo_face', 'landmarks.json')

def main():
    print(f"Starting TABCE Face Engine Prototype...")
    print(f"Python: {sys.version}")
    print(f"Libs: CV2={HAS_CV2}, PIL={HAS_PIL}, MediaPipe={HAS_MEDIAPIPE}, Numpy={HAS_NUMPY}")
    
    start_time = time.time()
    
    # 1. Load Image (Abstraction)
    width, height = 800, 600 # default
    image_loaded = False
    
    if os.path.exists(INPUT_IMAGE_PATH):
        if HAS_CV2:
            img = cv2.imread(INPUT_IMAGE_PATH)
            if img is not None:
                height, width, _ = img.shape
                image_loaded = True
                print(f"Loaded image with OpenCV: {width}x{height}")
        elif HAS_PIL:
            try:
                with Image.open(INPUT_IMAGE_PATH) as img:
                    width, height = img.size
                    image_loaded = True
                    print(f"Loaded image with PIL: {width}x{height}")
            except Exception as e:
                print(f"PIL failed: {e}")
    else:
        print(f"Input image not found: {INPUT_IMAGE_PATH}")

    # 2. Process / Generate Landmarks
    landmarks_data = []
    
    if HAS_MEDIAPIPE and HAS_CV2 and image_loaded:
        print("Running MediaPipe Inference...")
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)
        results = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        
        if results.multi_face_landmarks:
            print("MediaPipe: Face Detected.")
            for i, lm in enumerate(results.multi_face_landmarks[0].landmark):
                landmarks_data.append({'id': i, 'x': lm.x, 'y': lm.y, 'z': lm.z})
        else:
            print("MediaPipe: No face detected.")
            
    # Mock / Fallback Generation if MediaPipe failed or libs missing
    if not landmarks_data:
        print("Generating Synthetic 478-Landmark Mesh (Simulation Mode)...")
        # Generate a simple simplified face-like distribution
        # 478 points. We'll make a grid around center.
        cx, cy = 0.5, 0.5
        for i in range(478):
            # Map index to a rough 2D grid
            row = (i // 22) - 10
            col = (i % 22) - 10
            
            # Simple spherical projection simulation
            x = cx + (col * 0.02)
            y = cy + (row * 0.025)
            # Create a 'nose' depth roughly
            dist = (col**2 + row**2) ** 0.5
            z = -0.1 * (1.0 - dist/15.0) if dist < 15 else 0.0
            
            landmarks_data.append({'id': i, 'x': x, 'y': y, 'z': z})

    # 3. Export JSON
    with open(OUTPUT_JSON_PATH, 'w') as f:
        json.dump(landmarks_data, f, indent=2)
    print(f"Saved {len(landmarks_data)} landmarks to {OUTPUT_JSON_PATH}")
    
    # 4. Export OBJ
    vertices = []
    for lm in landmarks_data:
        # Scale to image dims for OBJ logical coords, or keep normalized 
        # (OBJ usually world space, we'll use normalized for now)
        vertices.append(f"v {lm['x']} {-lm['y']} {lm['z']}") 

    with open(OUTPUT_MESH_PATH, 'w') as f:
        f.write(f"# FaceClone 3D Mesh Output\n")
        f.write(f"# Vertices: {len(vertices)}\n")
        for v in vertices:
            f.write(f"{v}\n")
    
    print(f"Saved 3D Mesh to {OUTPUT_MESH_PATH}")
    print(f"Runtime: {round(time.time() - start_time, 4)}s")

if __name__ == "__main__":
    main()
