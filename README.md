# Tesco AI Beauty Try-On Creative Engine (TABCE)

**Project Manager:** Antigravity  
**Date:** 2025-12-08  
**Status:** Inception / Planning Phase

---

## 1. Tech Stack Decision

Based on the project requirements for a visually premium, high-performance, and responsive application, we have selected the following technology stack.

*   **Frontend Core**: **Vanilla HTML5, CSS3, JavaScript (ES6+)**.
    *   *Reasoning*: Ensures maximum control over the "Premium Design" and exact pixel-perfect implementation of the Glassmorphism UI without framework overhead. Meets the "HTML CSS ONLY" constraint for visual structure.
*   **Computer Vision / AI**: **MediaPipe Face Mesh** (Client-side).
    *   *Reasoning*: Provides real-time, high-fidelity 478-point facial landmarks directly in the browser. Zero latency, high privacy (no images sent to server for basic try-on).
*   **Image Processing**: **HTML5 Canvas + html2canvas**.
    *   *Reasoning*: Allows for dynamic composition of the model, makeup layers, and Tesco branding overlays into a single downloadable asset.
*   **Deployment**: **Vercel / Static Hosting**.
    *   *Reasoning*: The core engine is client-side, allowing for fast, cost-effective global distribution.
*   **Backend (Future / Optional for MVP)**: **FastAPI (Python)**.
    *   *Reasoning*: If advanced "Creative Performance Prediction" (ML) requires server-side inference later, Python is the industry standard. For MVP, we will simulate this or use TensorFlow.js.

---

## 2. High-Level Architecture

```mermaid
graph TD
    User[Agency / Brand Manager] -->|Uploads Packshot| UI[Web Interface (Glassmorphism)]
    UI -->|Selects Model Demographics| ModelEngine[Virtual Model Generator]
    UI -->|Selects Beauty Product| VTO[Virtual Try-On Engine]
    
    ModelEngine -->|Generates/Selects Base Image| Canvas[Composition Canvas]
    VTO -->|Detects Landmarks (MediaPipe)| Canvas
    VTO -->|Applies Makeup Layer| Canvas
    
    UI -->|Adjusts Parameters| CreativeEngine[Tesco Creative Composer]
    CreativeEngine -->|Applies Branding & Layouts| Canvas
    
    Canvas -->|Exports| Output[Final Ad Creative (JPG/PNG)]
    Canvas -->|Analyzes| Predictor[Performance AI (simulated)]
    Predictor -->|Feedback| UI
```

---

## 3. Epics & MVP Tasks

### Epic 1: Core Foundation & UI (Sprint 1)
- [ ] **Task 1.1**: Setup Project Repo & CI/CD Skeleton.
- [ ] **Task 1.2**: Implement "Glassmorphism" Design System (CSS Variables, Animations).
- [ ] **Task 1.3**: Build Main Layout (Sidebar, Canvas, Toolbar).

### Epic 2: Virtual Model & Try-On Engine (Sprint 1)
- [ ] **Task 2.1**: Implement Model Switcher (Diverse demographics).
- [ ] **Task 2.2**: Integrate MediaPipe Face Mesh for landmark detection.
- [ ] **Task 2.3**: Develop Makeup Rendering Logic (Lip tints, Blushes).

### Epic 3: Creative Composer & Export (Sprint 1)
- [ ] **Task 3.1**: Implement Product Packshot Upload & Positioning.
- [ ] **Task 3.2**: Add Tesco Branding Overlays (Clubcard Prices, Logos - Responsive).
- [ ] **Task 3.3**: Build High-Res Export Functionality (html2canvas).

### Epic 4: Intelligence & Optimization (Sprint 2 - Planned)
- [ ] **Task 4.1**: Implement Simulated Performance Predictor (CTR, Relevance Scores).
- [ ] **Task 4.2**: Add "Generate Variants" Loop (Batch creation).

---

## 4. 7-Day Sprint Plan (MVP)

**Goal**: Deliver a fully functional "End-to-End" Prototype by Day 7.

| Day | Owner | Focus Area | Tasks | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Day 1** | Antigravity | **Foundation** | Repo Setup, Design System (CSS), Basic Layout | Project runs locally; Dark/Glass UI is visible and responsive. |
| **Day 2** | Antigravity | **Face Engine** | Integrate MediaPipe, Landmarks Visualization | Webcam/Image stream detects face with mesh overlay. |
| **Day 3** | Antigravity | **Makeup** | Lip Tint Rendering, Color Picker Logic | User can change lip color accurately on a static model. |
| **Day 4** | Antigravity | **Creative** | Packshot Upload, Overlay System | Uploaded product appears on canvas; Tesco overlays toggle correctly. |
| **Day 5** | Antigravity | **Composer** | Canvas Composition, Scaling Logic | All elements (Model, Makeup, Overlay, Product) align perfectly. |
| **Day 6** | Antigravity | **Export** | Export to PNG, Download Flow | "Download" button saves a correct <500KB image. |
| **Day 7** | Antigravity | **Polish** | Animations, Performance KPI UI, Final Testing | Smooth transitions; Fake AI stats update on change; No bugs. |

---

## Getting Started

1.  Clone the repository.
2.  Open `index.html` in your browser.
3.  Start creating!
