@echo off
echo Starting TABCE Demo...

rem 1. Setup Data
if not exist "data\packshots" mkdir data\packshots
if not exist "data\models" mkdir data\models

rem 2. Seed Dummy Data (since we don't have real files)
echo Creating dummy assets...
python -c "from PIL import Image; Image.new('RGB', (500, 500), 'red').save('data/packshots/demo_product.jpg')"
python -c "from PIL import Image; Image.new('RGB', (800, 1200), 'pink').save('data/models/default_model.jpg')"

rem 3. Start Backend (Background)
echo Starting Backend...
start "TABCE Backend" cmd /k "cd backend && uvicorn main:app --reload"

echo Backend launching on http://localhost:8000
echo Open http://localhost:8000/docs to test API
echo.
echo Demo Setup Complete.
echo To run full pipeline:
echo 1. POST /upload/packshot (use demo_product.jpg)
echo 2. POST /generate (use returned ID)
pause
