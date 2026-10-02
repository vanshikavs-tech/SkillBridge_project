@echo off
title Launch SkillBridge Full-Stack Application
color 0A

:: Ensure node is in PATH
if exist "C:\Users\vansh\.nodejs\node.exe" (
    set "PATH=%PATH%;C:\Users\vansh\.nodejs"
)

echo ===============================================================================
echo                SKILLBRIDGE - FULL-STACK MERN MARKETPLACE
echo ===============================================================================
echo.
echo [1/2] Starting Backend Server (Express + Socket.IO) on port 5000...
start "SkillBridge Backend (Port 5000)" cmd /k "cd /d %~dp0backend && set PATH=%PATH%;C:\Users\vansh\.nodejs && node server.js"

echo Waiting 3 seconds for database and socket initialization...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server (React + Vite) on port 5173...
start "SkillBridge Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && set PATH=%PATH%;C:\Users\vansh\.nodejs && npm run dev"

echo.
echo ===============================================================================
echo  Applications started successfully!
echo.
echo  - Frontend Browser App:  http://localhost:5173
echo  - Backend API Service:   http://localhost:5000/api/health
echo.
echo  Pre-seeded Demo Accounts:
echo    Client:     client@skillbridge.com     / password123
echo    Freelancer: freelancer@skillbridge.com / password123
echo    Admin:      admin@skillbridge.com      / password123
echo ===============================================================================
echo.
echo Press any key to exit this launcher window (servers will remain running).
pause >nul
