@echo off
echo ===================================================
echo   AI Career & Skill Intelligence Platform Launcher
echo ===================================================

echo.
echo [1/2] Launching Backend Server...
echo ---------------------------------
cd /d "%~dp0backend"
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Starting FastAPI Server...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [2/2] Launching Frontend Server...
echo ----------------------------------
cd /d "%~dp0frontend"
echo Installing Node modules...
call npm install
echo Starting Vite Server...
start "Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

cd /d "%~dp0"
echo.
echo ===================================================
echo   Servers launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000/docs
echo ===================================================
pause
