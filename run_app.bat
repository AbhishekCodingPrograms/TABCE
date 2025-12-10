@echo off
cd /d "%~dp0"
setlocal

echo ===================================================
echo   TABCE Launcher v2.0 (Optimized)
echo ===================================================

echo [1/4] Ensuring Data Directories...
if not exist "data" mkdir data
if not exist "data\packshots" mkdir data\packshots
if not exist "data\demo_face" mkdir data\demo_face
if not exist "data\campaigns" mkdir data\campaigns

echo [2/4] Installing Backend Dependencies...
pip install -r backend\requirements.txt

echo [2.5/4] Seeding Data...
python scripts/generate_mesh.py

echo [3/4] Starting Backend (Port 8000)...
start "TABCE Backend" cmd /k "python -m uvicorn backend.main:app --reload --port 8000"

echo [4/4] Starting Dashboard (Port 3000)...
cd dashboard
rem Install dependencies if missing (fast check)
if not exist "node_modules" call npm install
start "TABCE Dashboard" cmd /k "npm run dev"

echo.
echo ===================================================
echo   App is starting!
echo   Front: http://localhost:3000
echo   Back:  http://localhost:8000
echo ===================================================
pause
