import os
import json
import random
from PIL import Image, ImageEnhance, ImageDraw, ImageOps, ImageFilter

class SyntheticModelGenerator:
    def __init__(self, base_image_path, landmarks_path):
        self.base_image_path = base_image_path
        self.landmarks_path = landmarks_path
        self.image = None
        self.landmarks = []
        
        self.load_assets()

    def load_assets(self):
        # Load Image
        if os.path.exists(self.base_image_path):
            self.image = Image.open(self.base_image_path).convert('RGB')
        else:
            print(f"Error: Base image not found at {self.base_image_path}")
            # Create dummy
            self.image = Image.new('RGB', (500, 500), color='gray')
            
        # Load Landmarks
        if os.path.exists(self.landmarks_path):
            with open(self.landmarks_path, 'r') as f:
                self.landmarks = json.load(f)
        else:
            print("Warning: Landmarks not found, using empty list.")
            self.landmarks = []

    def get_face_mask(self):
        # Create a soft mask for the face area
        # If landmarks exist, use them. Else, center oval.
        w, h = self.image.size
        mask = Image.new('L', (w, h), 0)
        draw = ImageDraw.Draw(mask)
        
        if self.landmarks:
            # Try to find convex hull or just min/max
            # Simple fallback: assume face is roughly centered 
            # or try to use landmarks if they are not mock grid
            xs = [p['x'] for p in self.landmarks]
            ys = [p['y'] for p in self.landmarks]
            
            # Use mock implementation: Center weighted ellipse
            # Since real landmarks might be mock grid
            pass
            
        # Default smooth center mask
        draw.ellipse((w*0.2, h*0.1, w*0.8, h*0.9), fill=255)
        # Blur the mask for soft blending
        mask = mask.filter(ImageFilter.GaussianBlur(30))
        return mask

    def apply_skin_tone(self, img, tone_hex, intensity=0.5):
        # Parse hex
        color = tuple(int(tone_hex[i:i+2], 16) for i in (1, 3, 5))
        
        # Create solid color layer
        tone_layer = Image.new('RGB', img.size, color)
        
        # Get Face Mask to only apply to face
        mask = self.get_face_mask()
        
        # Blend: Composite the tone over the image using 'Color' or 'Overlay' logic
        # PIL's blend is simple linear interpolation.
        # Let's use simple alpha blending masked by the face mask
        
        # 1. Blend image with color
        blended = Image.blend(img, tone_layer, alpha=0.3 * intensity)
        
        # 2. Composite back onto original using mask
        final = Image.composite(blended, img, mask)
        
        return final

    def apply_age_effects(self, img, age_group):
        # Age groups: 'young', 'adult', 'senior'
        
        if age_group == 'young':
            # Soften skin (Blur slightly + Brighten)
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(1.05)
            img = img.filter(ImageFilter.SMOOTH)
            
        elif age_group == 'senior':
            # Add contrast (simulate wrinkles/texture definition)
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.2)
            
            # Add noise (grain)
            # Create noise layer
            noise = Image.effect_noise(img.size, 15) # Gaussian noise requires recent PIL or numpy
            # Fallback simple noise:
            # We skip heavy noise generation to stay pure PIL simple
            
            # Desaturate slightly
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(0.7)
            
        return img

    def apply_morphs(self, img, feature_intensity):
        # Simulate morphs by slight resizing/cropping (warp simulation)
        w, h = img.size
        
        # If high intensity, assume 'wider' or 'narrower'
        # Just a simple scale transform for demo
        scale_x = 1.0 + (feature_intensity - 0.5) * 0.1 # +/- 5%
        
        new_w = int(w * scale_x)
        resized = img.resize((new_w, h), Image.Resampling.BICUBIC)
        
        # Crop back to center
        left = (new_w - w) // 2
        if left >= 0:
            img = resized.crop((left, 0, left + w, h))
        else:
            # Pad if smaller
            img = ImageOps.pad(resized, (w, h))
            
        return img

    def generate_variant(self, params):
        # Pipeline
        img = self.image.copy()
        
        # 1. Morphs (Geometry first)
        if 'feature_intensity' in params:
            img = self.apply_morphs(img, params['feature_intensity'])
            
        # 2. Skin Tone
        if 'skin_tone' in params:
            img = self.apply_skin_tone(img, params['skin_tone'], params.get('tone_intensity', 0.5))
            
        # 3. Age
        if 'age_group' in params:
            img = self.apply_age_effects(img, params['age_group'])
            
        return img

def main():
    print("Initialize Synthetic Model Generator...")
    base_path = os.path.join('data', 'demo_face', 'test_face.jpg')
    landmarks_path = os.path.join('data', 'demo_face', 'landmarks.json')
    output_dir = os.path.join('data', 'variants')
    
    generator = SyntheticModelGenerator(base_path, landmarks_path)
    
    # Define 5 Variants
    variants = [
        {
            "id": "v1_original",
            "skin_tone": "#FFE0BD", # Light
            "tone_intensity": 0.1,
            "age_group": "young",
            "feature_intensity": 0.5
        },
        {
            "id": "v2_tan_adult",
            "skin_tone": "#EAC086", # Tan
            "tone_intensity": 0.6,
            "age_group": "adult",
            "feature_intensity": 0.5
        },
        {
            "id": "v3_deep_senior",
            "skin_tone": "#8D5524", # Deep
            "tone_intensity": 0.7,
            "age_group": "senior",
            "feature_intensity": 0.5
        },
        {
            "id": "v4_pale_young",
            "skin_tone": "#FFDFC4", # Pale
            "tone_intensity": 0.4,
            "age_group": "young",
            "feature_intensity": 0.4
        },
        {
            "id": "v5_warm_adult",
            "skin_tone": "#C68642", # Warm
            "tone_intensity": 0.5,
            "age_group": "adult",
            "feature_intensity": 0.6
        }
    ]
    
    generated_meta = []
    
    for v in variants:
        print(f"Generating {v['id']}...")
        result_img = generator.generate_variant(v)
        
        filename = f"{v['id']}.png"
        save_path = os.path.join(output_dir, filename)
        result_img.save(save_path)
        
        v['file_path'] = save_path
        generated_meta.append(v)
        
    # Save Metadata
    meta_path = os.path.join(output_dir, 'variants_metadata.json')
    with open(meta_path, 'w') as f:
        json.dump(generated_meta, f, indent=2)
        
    print(f"Successfully generated 5 variants in {output_dir}")

if __name__ == "__main__":
    main()
