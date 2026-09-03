@echo off
echo ========================================
echo Cleaning up old processes...
echo ========================================

REM Kill all old Python and Node processes
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

REM Delete lock file if it exists
if exist backend\.server.lock (
    del /F backend\.server.lock
    echo Removed old lock file
)

echo Waiting for cleanup...
timeout /t 3 /nobreak > nul

echo.
echo Starting Backend Server (Port 8090)
echo ========================================
start "Backend Server - Signature Forgery Detection" cmd /k "cd /d %~dp0 && set PYTHONIOENCODING=utf-8 && .\.venv_new\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8090"

echo Waiting for backend to start...
timeout /t 8 /nobreak > nul

REM Check if backend is healthy
echo Checking backend health...
curl -s http://localhost:8090/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ ERROR: Backend failed to start!
    echo ========================================
    echo Please check the Backend Server window for errors
    echo.
    pause
    exit /b 1
)

echo ✓ Backend is running and healthy!

echo.
echo ========================================
echo Starting Frontend Server (Port 3000)
echo ========================================
start "Frontend Server - Signature Forgery Detection" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo ✓ Both Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8090
echo Frontend: http://localhost:3000
echo.
echo Open your browser and navigate to:
echo    http://localhost:3000
echo.
echo ========================================
pause
