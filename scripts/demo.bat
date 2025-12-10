@echo off

echo ===================================================
echo   Starting TABCE Demo (Windows)
echo ===================================================

:: 1. Setup Environment
echo [1/5] Setting up environment...
if not exist "data\packshots" mkdir data\packshots
if not exist "data\demo_face" mkdir data\demo_face
if not exist "data\campaigns" mkdir data\campaigns

:: 2. Pre-seed Data
echo [2/5] Seeding data...
call python scripts/ingest_packshot.py
call python scripts/generate_mesh.py

:: 3. Run Demo Campaign (Direct Script Execution for Demo Simplicity)
echo [3/5] Running End-to-End Campaign Generation...
call python scripts/orchestrator.py

:: 4. Package Results
echo [4/5] Packaging Results...
if exist demo_results.zip del demo_results.zip
powershell -Command "Compress-Archive -Path 'data\campaigns\Summer_Launch_2025\*' -DestinationPath 'demo_results.zip'"

:: 5. Finish
if exist demo_results.zip (
    echo ===================================================
    echo   SUCCESS! Demo complete.
    echo   Results saved to: demo_results.zip
    echo ===================================================
) else (
    echo [ERROR] Demo failed to produce zip.
)
pause
