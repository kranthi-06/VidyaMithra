@echo off
echo ===================================================
echo   AI Career Platform - FINAL FIX AND LAUNCH
echo ===================================================

echo [1/2] Downgrading Tailwind (Fixing CSS)...
call "%~dp0downgrade_tailwind.bat"

echo.
echo [2/2] Launching Application...
cd /d "%~dp0"
call "%~dp0start_app.bat"
