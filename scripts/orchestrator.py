import os
import json
import random
import time
import shutil

# Import our functional modules
from model_generator import SyntheticModelGenerator
from apply_makeup import MakeupRenderer
from compose_creatives import LayoutEngine, Image
from optimize_assets import OptimizationEngine
from predict_performance import CreativePredictor

class CampaignOrchestrator:
    def __init__(self):
        self.layout_engine = LayoutEngine()
        self.optimizer = OptimizationEngine()
        self.predictor = CreativePredictor()
        
        # Determine Project Root (scripts/.. -> Root)
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Generator instances
        base_path = os.path.join(self.root_dir, 'data', 'demo_face', 'test_face.jpg')
        landmarks_path = os.path.join(self.root_dir, 'data', 'demo_face', 'landmarks.json')
        self.model_gen = SyntheticModelGenerator(base_path, landmarks_path)
        self.makeup_gen = MakeupRenderer(landmarks_path)

    def run_campaign(self, packshot_path, campaign_name, num_variants=10):
        print(f"--- Starting Campaign: {campaign_name} ---")
        
        try:
            campaign_dir = os.path.join(self.root_dir, 'data', 'campaigns', campaign_name)
            if not os.path.exists(campaign_dir):
                os.makedirs(campaign_dir)
                
            generated_assets = []
            
            # 1. Generate Variant Matrix
            # Models x Makeup Styles x Layouts
            
            model_vars = [
                {"skin_tone": "#FFE0BD", "age": "young", "feature": 0.5, "name": "Light_Young"},
                {"skin_tone": "#EAC086", "age": "adult", "feature": 0.5, "name": "Tan_Adult"},
                {"skin_tone": "#8D5524", "age": "adult", "feature": 0.6, "name": "Deep_Adult"},
                {"skin_tone": "#C68642", "age": "senior", "feature": 0.5, "name": "Warm_Senior"},
            ]
            
            makeup_vars = [
                {"preset": "Indian", "lips": "#B80F0A"},
                {"preset": "Western", "lips": "#EFA8B8"},
                {"preset": "Bold", "lips": "#800020"}
            ]
            
            print(f"Generating {num_variants} Ideas x 3 Formats = {num_variants*3} Total Assets...")
            
            target_formats = ["social", "screen_portrait", "web_banner"]
            
            for i in range(num_variants):
                # Pick random combination (Concept)
                model_cfg = random.choice(model_vars)
                makeup_cfg = random.choice(makeup_vars)
                
                # Step A: Generate Model (Base for this concept)
                model_img_path = os.path.join(campaign_dir, f"temp_model_{i}.png")
                model_img = self.model_gen.generate_variant({
                    "skin_tone": model_cfg['skin_tone'], 
                    "age_group": model_cfg['age'],
                    "feature_intensity": model_cfg['feature']
                })
                model_img.save(model_img_path)
                
                # Step B: Apply Makeup
                makeup_params = {
                    "lips": {"color": makeup_cfg['lips'], "intensity": random.uniform(0.5, 0.9)},
                    "blush": {"color": "#D38888", "intensity": 0.4}
                }
                makeup_img_path = os.path.join(campaign_dir, f"temp_makeup_{i}.png")
                self.makeup_gen.render(model_img_path, makeup_img_path, makeup_params)
                
                # Load assets ONCE per concept
                final_model = self.layout_engine.load_image(makeup_img_path)
                
                if not os.path.exists(packshot_path):
                     print(f"Warning: Packshot not found at {packshot_path}")
                packshot = self.layout_engine.load_image(packshot_path)
                
                assets = {
                    "model": final_model,
                    "packshot": packshot,
                    "headline": f"Beauty for {model_cfg['name']}",
                    "subhead": f"{makeup_cfg['preset']} Look",
                    "price": "£12.50"
                }

                # Step C: Iterate Formats
                for fmt in target_formats:
                    # Naming: variant_ID_Format.jpg
                    final_path = os.path.join(campaign_dir, f"variant_{i}_{fmt}.jpg")
                    
                    self.layout_engine.compose(fmt, assets, final_path)
                    
                    # Step D: Optimize
                    self.optimizer.optimize(final_path)
                    
                    # Step E: Predict
                    prediction = self.predictor.predict(final_path)
                    
                    generated_assets.append({
                        "id": f"v{i}_{fmt}",
                        "file_path": final_path,
                        "score": prediction['score'],
                        "meta": {
                            "model": model_cfg['name'],
                            "makeup": makeup_cfg['preset'],
                            "layout": fmt
                        }
                    })
                
                # Cleanup temps
                if os.path.exists(model_img_path): os.remove(model_img_path)
                if os.path.exists(makeup_img_path): os.remove(makeup_img_path)
                
                print(f"  Generated Concept {i+1}/{num_variants}")

            # 2. Ranking & Selection
            generated_assets.sort(key=lambda x: x['score'], reverse=True)
            top_5 = generated_assets[:5]
            
            # Save Report
            report_path = os.path.join(campaign_dir, 'campaign_report.json')
            with open(report_path, 'w') as f:
                json.dump({
                    "campaign": campaign_name,
                    "total_generated": len(generated_assets),
                    "top_5": top_5,
                    "all_variants": generated_assets
                }, f, indent=2)
                
            print(f"\n--- Campaign '{campaign_name}' Complete ---")
            print("Top 5 Performing Variants:")
            for v in top_5:
                print(f"  #{v['id']} ({v['meta']['model']}/{v['meta']['makeup']}/{v['meta']['layout']}): {v['score']}/100")
        
        except Exception as e:
            import traceback
            error_msg = f"CRITICAL ERROR in Campaign '{campaign_name}': {str(e)}\n{traceback.format_exc()}"
            print(error_msg)
            
            # Log to file
            log_path = os.path.join(self.root_dir, 'data', 'error_log.txt')
            with open(log_path, 'a') as f:
                f.write(f"\n\n[{time.ctime()}] {error_msg}")


def main():
    orchestrator = CampaignOrchestrator()
    sample_packshot = os.path.join('data', 'packshots', 'processed_product.png')
    
    if os.path.exists(sample_packshot):
        orchestrator.run_campaign(sample_packshot, "Summer_Launch_2025", num_variants=15)
    else:
        print("Please run Step 6 (Packshot Ingestion) first.")

if __name__ == "__main__":
    main()
