# Project Fixes & Run Instructions

## Summary of Fixes
1.  **Dependencies**: Added missing `opencv-python` and `rembg` to `backend/requirements.txt`. These are required for face detection and background removal.
2.  **Pathing**: Patched `scripts/orchestrator.py` to use absolute paths. This ensures the backend can find model data and campaign folders regardless of where it is run from.
3.  **Build**: Verified `dashboard` (frontend) builds successfully.
4.  **Launcher**: Created `run_app.bat` to automate the startup process.

## How to Run
Simply double-click **`run_app.bat`** in the root directory.

It will:
1.  Create necessary data folders.
2.  Install Python dependencies.
3.  Launch the Backend Server (FastAPI) on port 8000.
4.  Launch the Dashboard (Next.js) on port 3000.

## Troubleshooting
- If the backend fails to start, ensure you have Python installed and added to PATH.
- If the dashboard fails, ensure you have Node.js installed.
- Check the opened terminal windows for any specific error messages.
