@echo off
setlocal
echo ===================================================
echo   AI Career Platform - REPAIR & START
echo ===================================================

echo.
echo [1/3] Repairing Backend Environment...
echo --------------------------------------
cd /d "%~dp0backend"
if not exist venv (
    echo Creating venv...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing ALL requirements (including psycopg2 and email-validator)...
pip install -r requirements.txt
pip install psycopg2-binary email-validator
echo Backend repair complete.

echo.
echo [2/3] Repairing Frontend Environment...
echo ---------------------------------------
cd /d "%~dp0frontend"
echo Installing missing UI components...
call npm install
call npm install @radix-ui/react-label @tailwindcss/postcss tailwindcss-animate class-variance-authority clsx tailwind-merge
echo Frontend repair complete.

echo.
echo [3/3] Launching Servers...
echo --------------------------
echo Starting Backend...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Starting Frontend...
start "Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

cd /d "%~dp0"
echo.
echo ===================================================
echo   Repairs finished and servers started!
echo   Please check the new windows for any red errors.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000/docs
echo ===================================================
pause
