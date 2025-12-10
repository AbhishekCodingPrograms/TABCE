# Technology Stack Decision Record

## 1. Core Framework & Language
*   **Selected**: React (Vite) + JavaScript/ES6+
*   **Reasoning**:
    *   **Performance**: Vite offers lightning-fast HMR and build times.
    *   **Ecosystem**: React has the largest library of component primitives.
    *   **Talent**: High availability of developers familiar with this stack.
    *   **Interactivity**: Essential for the dynamic "Creative Studio" interface.

## 2. Computer Vision & Machine Learning
*   **Selected**: TensorFlow.js (Client-Side)
    *   `@tensorflow-models/face-landmarks-detection` (MediaPipe)
    *   `@tensorflow-models/mobilenet` (Image Classification)
*   **Alternatives Considered**: PyTorch (Python Backend), OpenCV.
*   **Reasoning**:
    *   **Privacy & Speed**: Processing happens entirely in the user's browser. Zero latency from network round-trips.
    *   **Cost**: No expensive GPU backend infrastructure required for inference.
    *   **Experience**: Real-time feedback overlay (Face Mesh) is only possible with client-side execution.

## 3. Styling & UI
*   **Selected**: Vanilla CSS + Glassmorphism Variables
*   **Reasoning**:
    *   **Customization**: Complete control over the specific "Premium Beauty" aesthetic required by Tesco standards.
    *   **Performance**: Zero runtime overhead compared to CSS-in-JS libraries.
    *   **Maintainability**: Scoped CSS modules (if needed) or BEM naming conventions.

## 4. State Management
*   **Selected**: React Context API + Local State
*   **Reasoning**:
    *   **Simplicity**: sufficient for the current scale (Creative Studio workflow).
    *   **Overhead**: Avoids the boilerplate of Redux for this specific prototype.

## 5. Deployment & Infrastructure
*   **Selected**: Docker + Static Hosting (Vercel/Netlify for demo)
*   **Containerization**: `Dockerfile` provided for standardizing the build environment.
*   **Storage**: Browser LocalStorage for prototype session retention. AWS S3 (mocked) for asset storage in production architecture.
