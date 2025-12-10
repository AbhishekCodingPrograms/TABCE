import os
import json
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

class LayoutEngine:
    def __init__(self):
        # Format Definitions (WxH)
        self.formats = {
            "web_banner": (1200, 628), # Standard Hero
            "app_banner": (1080, 566), # Mobile App
            "social": (1080, 1080), # Square Post
            "screen_portrait": (1080, 1920) # In-Store Screen
        }
        
        # Tesco Brand Colors
        self.colors = {
            "tesco_blue": "#00539F",
            "tesco_red": "#E0000A",
            "text": "#FFFFFF", # White text for modern overlay
            "accent": "#00C8FF" # Cyan accent
        }
        
        # Load Fonts - Try Windows Modern Fonts
        self.fonts = {}
        try:
            # Segoe UI (Standard Windows) or Arial Bold
            self.fonts['title'] = ImageFont.truetype("C:/Windows/Fonts/seguiSb.ttf", 60)
            self.fonts['body'] = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 30)
            self.fonts['price'] = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 45)
        except:
            # Fallback
            self.fonts['title'] = ImageFont.load_default()
            self.fonts['body'] = ImageFont.load_default()
            self.fonts['price'] = ImageFont.load_default()

    def load_image(self, path):
        if os.path.exists(path):
            return Image.open(path).convert('RGBA')
        else:
            return None

    def draw_glass_panel(self, draw, x, y, w, h):
        # Simulate semi-transparent dark glass
        draw.rounded_rectangle((x, y, x+w, y+h), radius=20, fill=(0, 0, 0, 160)) # Dark semi-transparent
        draw.rounded_rectangle((x, y, x+w, y+h), radius=20, outline=(255, 255, 255, 100), width=2) # Border

    def draw_badge(self, draw, x, y, price):
        # Modern Yellow Pill
        w, h = 160, 80
        draw.rounded_rectangle((x, y, x+w, y+h), radius=40, fill="#FFC91B")
        
        # Centered Price
        try:
            # Measure text roughly (older PIL fallback)
            draw.text((x + 25, y + 15), price, font=self.fonts['price'], fill="black")
        except:
            draw.text((x + 20, y + 20), price, fill="black")

    def compose(self, format_name, assets, output_path):
        if format_name not in self.formats: return False
        
        W, H = self.formats[format_name]
        
        # 1. Base Canvas (Transparent for composition)
        canvas = Image.new('RGBA', (W, H), (0,0,0,255))
        
        model_img = assets['model']
        pack_img = assets['packshot']
        
        # --- A. Full Bleed Background ---
        if model_img:
            # Crop/Resize to Fill
            ratio = max(W / model_img.width, H / model_img.height)
            new_w = int(model_img.width * ratio)
            new_h = int(model_img.height * ratio)
            resized_model = model_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # Center Crop
            left = (new_w - W) // 2
            top = (new_h - H) // 2
            canvas.paste(resized_model.crop((left, top, left+W, top+H)), (0, 0))
        
        # --- B. Gradient Overlay (for text readability) ---
        # Create gradient image
        gradient = Image.new('L', (W, H), color=0)
        t_draw = ImageDraw.Draw(gradient)
        # Vertical gradient (bottom fade)
        for y in range(H):
            alpha = int(255 * (y / H) * 0.9) # Darker at bottom
            t_draw.line((0, y, W, y), fill=alpha)
            
        overlay = Image.new('RGBA', (W, H), (0, 10, 30, 255)) # Dark Blue tint
        overlay.putalpha(gradient)
        canvas.alpha_composite(overlay)

        draw = ImageDraw.Draw(canvas)
        
        # --- C. Layout Elements ---
        
        if format_name in ["social", "screen_portrait"]:
            # Stacked Layout (Clean Modern)
            # 1. Text (Bottom Left)
            text_x = 60
            text_y = H - 250 # Anchor point
            
            draw.text((text_x, text_y), assets['headline'], font=self.fonts['title'], fill=self.colors['text'])
            draw.text((text_x, text_y + 80), assets['subhead'].upper(), font=self.fonts['body'], fill=self.colors['accent'])
            
            # 2. Product (Bottom Right)
            if pack_img:
                # Max height 30% of canvas
                pack_h = int(H * 0.3)
                ratio = pack_h / pack_img.height
                pack_w = int(pack_img.width * ratio)
                resized_pack = pack_img.resize((pack_w, pack_h), Image.Resampling.LANCZOS)
                
                # Position: Bottom Right with padding
                px = W - pack_w - 50
                py = H - pack_h - 50
                
                # Glow effect behind product
                glow_size = int(max(pack_w, pack_h) * 1.2)
                glow = Image.new('RGBA', (glow_size, glow_size), (0,0,0,0))
                g_draw = ImageDraw.Draw(glow)
                # Radial gradient simulation for glow
                g_draw.ellipse((0, 0, glow_size, glow_size), fill=(255, 255, 255, 40))
                g_draw.ellipse((20, 20, glow_size-20, glow_size-20), fill=(255, 255, 255, 10))
                
                # Center glow coord
                gx = px + (pack_w - glow_size)//2
                gy = py + (pack_h - glow_size)//2
                canvas.paste(glow, (gx, gy), glow)
                
                # Paste Product
                canvas.paste(resized_pack, (px, py), resized_pack) # Use mask if PNG has it
                
                # Badge (Verified Position: Above Product)
                self.draw_badge(draw, px + (pack_w - 160)//2, py - 60, assets['price'])
                
        else:
            # Landscape (Web Banner)
            # Modern Split: Text Left, Product Right (Glass)
            
            # Glass Panel Background (Right Side)
            panel_w = int(W * 0.4)
            panel_h = int(H * 0.85)
            panel_x = W - panel_w - 60
            panel_y = (H - panel_h) // 2
            
            self.draw_glass_panel(draw, panel_x, panel_y, panel_w, panel_h)
            
            if pack_img:
                pack_h = int(panel_h * 0.6)
                ratio = pack_h / pack_img.height
                pack_w = int(pack_img.width * ratio)
                resized_pack = pack_img.resize((pack_w, pack_h), Image.Resampling.LANCZOS)
                
                px = panel_x + (panel_w - pack_w) // 2
                py = panel_y + (panel_h - pack_h) // 2 - 20
                
                canvas.paste(resized_pack, (px, py), resized_pack)
                
                # Price Pill Centered below product
                self.draw_badge(draw, panel_x + (panel_w - 160)//2, py + pack_h + 30, assets['price'])

            # Text on Left (Vertically Centered)
            text_x = 100
            text_y = (H // 2) - 60
            draw.text((text_x, text_y), assets['headline'], font=self.fonts['title'], fill=self.colors['text'])
            draw.text((text_x, text_y + 80), assets['subhead'].upper(), font=self.fonts['body'], fill=self.colors['accent'])

        # 3. Branding (Top Left Standard)
        draw.text((40, 40), "TESCO Beauty", font=self.fonts['body'], fill="white")

        # 4. Export
        canvas.convert('RGB').save(output_path, "JPEG", quality=95, optimize=True)
        return True

def main():
    print("Starting Creative Composer...")
    # Test logic if needed, usually called by orchestrator
    pass

if __name__ == "__main__":
    main()
