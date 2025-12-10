from PIL import Image, ImageDraw, ImageFont
import os

class CreativeComposer:
    def __init__(self):
        self.formats = {
            "instagram_feed": (1080, 1080),
            "instagram_story": (1080, 1920),
            "facebook_link": (1200, 628)
        }

    def compose(self, model_path, packshot_path, text_data, output_dir, format_name="instagram_feed"):
        size = self.formats.get(format_name, (1080, 1080))
        
        # Canvas
        canvas = Image.new("RGB", size, (255, 255, 255))
        
        # Load assets
        try:
            model = Image.open(model_path).convert("RGBA")
            packshot = Image.open(packshot_path).convert("RGBA")
        except:
            return None

        # 1. Background / Model Layout
        # Simple layout: Model fills background or right side
        model_ratio = model.width / model.height
        target_ratio = size[0] / size[1]
        
        if format_name == "instagram_story":
            # Model full height
            scale = size[1] / model.height
            new_w = int(model.width * scale)
            model = model.resize((new_w, size[1]))
            canvas.paste(model, (size[0] - new_w, 0), model)
        else:
            # Model right half
            scale = size[1] / model.height
            new_w = int(model.width * scale)
            model = model.resize((new_w, size[1]))
            canvas.paste(model, (int(size[0] * 0.4), 0), model)

        # 2. Packshot
        # Place packshot in bottom left or center left
        packshot.thumbnail((int(size[0]*0.4), int(size[1]*0.4)))
        canvas.paste(packshot, (50, size[1] - packshot.height - 100), packshot)
        
        # 3. Typography
        draw = ImageDraw.Draw(canvas)
        # Use default font for now, ideally load custom TTF
        headline = text_data.get("headline", "NEW ARRIVAL")
        price = text_data.get("price", "£19.99")
        
        draw.text((50, 100), headline, fill=(0,0,0,255))
        draw.text((50, 100 + 50), price, fill=(200, 0, 0, 255))

        out_path = os.path.join(output_dir, f"creative_{format_name}.jpg")
        
        # Quality control for file size (Step 8)
        quality = 95
        while quality > 30:
            canvas.save(out_path, "JPEG", quality=quality)
            if os.path.getsize(out_path) < 500 * 1024: # 500KB
                break
            quality -= 5
            
        return out_path
