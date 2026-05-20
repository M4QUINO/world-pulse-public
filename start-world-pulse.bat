@echo off
TITLE World Pulse - System Launcher
SETLOCAL

echo ==========================================
echo    WORLD PULSE - PREMIUM NEWS SYSTEM
echo ==========================================
echo.

:: Checking for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [1/2] Starting Backend...
start "World Pulse - Backend" cmd /k "cd backend && if not exist node_modules (echo Installing backend dependencies... && npm install) else (echo Backend dependencies already installed.) && echo Starting server... && npm start"

echo [2/2] Starting Frontend...
start "World Pulse - Frontend" cmd /k "cd frontend && if not exist node_modules (echo Installing frontend dependencies... && npm install) else (echo Frontend dependencies already installed.) && echo Starting frontend on the local network... && npm run dev -- --host 0.0.0.0"

echo.
echo ==========================================
echo    SYSTEM IS STARTING UP!
echo ==========================================
echo 1. Backend: http://localhost:3001
echo 2. Frontend: http://localhost:5173
echo 3. To share on the same network, use your computer IP instead of localhost.
echo 4. If older windows are open, close them before launching again.
echo.
echo Keep the backend and frontend windows open while using the app.
echo ==========================================
pause
