from rembg import remove
from PIL import Image
import io
import os

class PackshotProcessor:
    def __init__(self):
        pass

    def process_packshot(self, input_path, output_dir, size=(800, 800)):
        """
        Removes background and normalizes product image to centered PNG.
        """
        try:
            with open(input_path, 'rb') as i:
                input_data = i.read()
            
            # Remove background using rembg (machine learning)
            output_data = remove(input_data)
            
            img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Crop to content
            bbox = img.getbbox()
            if bbox:
                img = img.crop(bbox)
                
            # Resize fit
            img.thumbnail(size, Image.LANCZOS)
            
            # Center on canvas
            new_img = Image.new("RGBA", size, (0, 0, 0, 0))
            offset = ((size[0] - img.size[0]) // 2, (size[1] - img.size[1]) // 2)
            new_img.paste(img, offset)
            
            os.makedirs(output_dir, exist_ok=True)
            filename = os.path.basename(input_path)
            name, _ = os.path.splitext(filename)
            out_path = os.path.join(output_dir, f"{name}_processed.png")
            
            new_img.save(out_path, format="PNG")
            return out_path
            
        except Exception as e:
            print(f"Packshot processing error: {e}")
            return None
