@echo off
cd /d "%~dp0frontend"
echo Removing Tailwind v4...
call npm uninstall tailwindcss @tailwindcss/postcss
echo Installing Tailwind v3...
call npm install -D tailwindcss@3.4.17 postcss autoprefixer

echo Fixing PostCSS Config...
(
echo export default {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo }
) > postcss.config.js

echo.
echo Tailwind downgraded success!
pause
