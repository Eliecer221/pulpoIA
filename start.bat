@echo off
REM PulpoAI - Launcher
REM Independent AI Development Hub

echo ========================================
echo    PulpoAI - Unified AI Hub
echo ========================================
echo.

cd /d C:\Users\sa\Desktop\pulpoai

echo Installing dependencies (first time only)...
call npm install

echo.
echo Starting PulpoAI on http://localhost:3000
echo.
npm run dev

pause
