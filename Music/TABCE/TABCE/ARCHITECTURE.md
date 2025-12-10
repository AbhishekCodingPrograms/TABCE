# High-Level Architecture

```mermaid
graph TD
    User[Creative Director / Marketer] -->|Interacts| UI[Web Frontend (React)]
    
    subgraph "Client-Side Application (Browser)"
        UI -->|Uploads Product| Assets[Asset Manager]
        UI -->|Configures| Config[Configuration State]
        
        subgraph "AI Core (TensorFlow.js)"
            Config -->|Trigger| FaceMesh[Face Landmarks Model]
            Config -->|Trigger| MobileNet[MobileNet Vision Model]
            
            FaceMesh -->|3D Point Data| Visualizer[Face Mesh Visualizer]
            MobileNet -->|Classifications| Predictor[Performance Predictor]
        end
        
        subgraph "Creative Engine"
            Assets & Config --> Composer[Variant Composer]
            Visualizer --> Composer
            Predictor --> Composer
        end
        
        Composer -->|Generates| Variants[Creative Variants (Canvas/DOM)]
    end
    
    subgraph "Data Persistence"
        Variants -->|Export| ZIP[Zip Archive]
        Assets -->|Cache| LocalStorage[Browser Storage]
    end
```

## Data Flow
1.  **Input**: User provides Product Image + Selects Virtual Model + Defines Makeup Config.
2.  **Processing**:
    *   **Vision**: MobileNet scans Product Image to understand context (e.g., "Lipstick").
    *   **Geometry**: FaceMesh scans Virtual Model Image to map 478 landmarks.
3.  **Synthesis**:
    *   Makeup is rendered physically-correctly onto the Model using FaceMesh coordinates.
    *   Product is composited into scene.
4.  **Prediction**:
    *   Performance Predictor calculates CTR and Engagement scores based on Visual Attributes (Contrast, Face Area, Brand Prominence).
5.  **Output**:
    *   Multiple variants (Square, Vertical, Landscape) generated and ranked by predicted score.
