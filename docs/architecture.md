# TABCE System Architecture

## Overview
The Tesco AI Beauty Try-On Creative Engine (TABCE) is a modular system designed to autonomously generate high-performance retail media creatives. It separates **Content Generation** (Python) from **User Interaction** (React/FastAPI).

## Core Modules (`/scripts`)

### 1. Ingestion Engine (`ingest_packshot.py`)
*   **Purpose**: Prepares raw product images for composition.
*   **Process**:
    1.  Loads image via Pillow.
    2.  Attempts AI Background Removal via `rembg`.
    3.  Falls back to Heuristic Removal (White -> Transparent) if AI fails.
    4.  Trims whitespace and pads to 500x500px.

### 2. Face Engine (`generate_mesh.py`)
*   **Purpose**: Bootstraps the 3D understanding of a face.
*   **Process**:
    1.  Uses **MediaPipe Face Mesh** to detect 478 landmarks.
    2.  Exports `landmarks.json` (normalized coordinates) and `mesh.obj`.
    3.  Includes a "Simulation Mode" for environments where MediaPipe/CV2 cannot run.

### 3. Synthetic Model Generator (`model_generator.py`)
*   **Purpose**: Creates demographic variations from a single base face.
*   **Technique**:
    *   **Skin Tone**: Uses alpha-blended RGB layers masked by a Gaussian-blurred face oval.
    *   **Aging**: Applies contrast enhancement (wrinkles) for seniors and smoothing for youth.
    *   **Morphing**: Uses `ImageOps` to slightly warp aspect ratios for facial structure variance.

### 4. Makeup Renderer (`apply_makeup.py`)
*   **Purpose**: Digital cosmetics application.
*   **Technique**:
    *   Uses vector polygons defined by landmarks for Lips and Eyeliner.
    *   Uses Gaussian Splats for Blush.
    *   Supports opacity blending for "Intensity" control.

### 5. Layout Engine (`compose_creatives.py`)
*   **Purpose**: Assembles final assets.
*   **Formats**:
    *   **Social (1:1)**: Stacked layout (Model Top, Product Bottom).
    *   **Banner (1.91:1)**: Split layout (Model Left, Product Right).
*   **Branding**:
    *   Injects Tesco Clubcard Price Lozenge.
    *   Enforces Brand Colors (`#00539F`).

### 6. Optimization Engine (`optimize_assets.py`)
*   **Purpose**: Quality & Size Control.
*   **Process**:
    1.  Checks file size limit (500KB).
    2.  Iteratively reduces JPEG quality (95 -> 60) until consistent.
    3.  Calculates **SSIM** (Structural Similarity) against original to preventing visual degradation below 0.90.

### 7. Performance Predictor (`predict_performance.py`)
*   **Purpose**: Scoring & Ranking.
*   **Technique**:
    *   Extracts features: Brightness, Contrast, Color Vibrancy.
    *   Uses a **Random Forest Regressor** (Scikit-Learn) trained on synthetic heuristics (Vibrancy + Contrast correlation to CTR).

## Data Flow
```
[User Upload] -> [Ingest] -> [Processed Packshot]
                                     |
                                     v
                            [Campaign Orchestrator]
                                     |
           +-------------------------+-------------------------+
           v                         v                         v
    [Model Gen] ------------> [Makeup Gen] ------------> [Layout Gen]
    (Base -> Variants)       (Apply Constants)          (Combine Assets)
                                                               |
                                                               v
                                                      [Optimization] -> [Predictor] -> [Ranking]
```
