@echo off
setlocal enabledelayedexpansion
title SkillBridge - Architecture Concepts and Runner
color 0B

:: Ensure Node is in PATH for this session
if exist "C:\Users\vansh\.nodejs\node.exe" (
    set "PATH=%PATH%;C:\Users\vansh\.nodejs"
)

:MENU
cls
echo ===============================================================================
echo                      SKILLBRIDGE - MERN CONCEPTS GUIDE
echo                 Full-Stack Freelance Marketplace Platform
echo ===============================================================================
echo.
echo   [1] Architecture: What is the MERN Stack and how does SkillBridge work?
echo   [2] Security: Understanding JWT Authentication and Role-Based Access Control
echo   [3] Data Flow: The Project - Proposal - Contract - Milestone Lifecycle
echo   [4] Real-Time: WebSockets (Socket.IO) vs HTTP REST
echo   [5] Algorithm: How the AI Freelancer Recommendation Engine works
echo.
echo   -------------------------- PROJECT ACTIONS ------------------------------
echo   [6] Seed Database (Creates demo Client, Freelancer, Admin accounts)
echo   [7] Start Backend Server (Express + Socket.IO on port 5000)
echo   [8] Start Frontend Server (React + Vite on port 5173)
echo   [9] Launch Full Stack (Starts both Backend and Frontend in separate windows)
echo   [10] Run System Health Check
echo.
echo   [0] Exit
echo.
echo ===============================================================================
set /p choice="Enter your selection [0-10]: "

if "%choice%"=="1" goto CONCEPT_MERN
if "%choice%"=="2" goto CONCEPT_JWT
if "%choice%"=="3" goto CONCEPT_LIFECYCLE
if "%choice%"=="4" goto CONCEPT_SOCKETS
if "%choice%"=="5" goto CONCEPT_ALGORITHM
if "%choice%"=="6" goto SEED_DB
if "%choice%"=="7" goto START_BACKEND
if "%choice%"=="8" goto START_FRONTEND
if "%choice%"=="9" goto START_BOTH
if "%choice%"=="10" goto HEALTH_CHECK
if "%choice%"=="0" exit /b
goto MENU

:CONCEPT_MERN
cls
echo ===============================================================================
echo CONCEPT 1: THE MERN STACK ARCHITECTURE
echo ===============================================================================
echo.
echo   M - MongoDB: A flexible NoSQL database storing JSON-like documents.
echo                In SkillBridge, it stores Users, Projects, Proposals, Contracts,
echo                Milestones, Messages, and Payments.
echo.
echo   E - Express: A minimalist web framework for Node.js. It manages HTTP routing,
echo                CORS headers, JSON body parsing, and error handling.
echo.
echo   R - React:   A declarative component library running in the user's browser.
echo                SkillBridge uses React 18 with Vite for blazing-fast HMR,
echo                Tailwind CSS for modern styling, and Lucide for intuitive icons.
echo.
echo   N - Node.js: The JavaScript runtime environment executing backend server code
echo                asynchronously using an event-driven non-blocking I/O model.
echo.
echo   HOW THEY COMMUNICATE:
echo   - React sends asynchronous HTTP requests (using Axios) to Express endpoints.
echo   - Express authenticates the request, queries MongoDB via Mongoose, and
echo     returns structured JSON back to React.
echo   - Socket.IO maintains a persistent WebSocket connection for instant chat.
echo.
pause
goto MENU

:CONCEPT_JWT
cls
echo ===============================================================================
echo CONCEPT 2: JWT AUTHENTICATION AND ROLE-BASED ACCESS CONTROL (RBAC)
echo ===============================================================================
echo.
echo   1. PASSWORD SECURITY:
echo      Passwords are never stored in plain text. Before saving to MongoDB,
echo      User.js uses bcrypt with a salt factor of 10 to hash passwords:
echo      UserSchema.pre('save', async function() { password = hash(password, salt) })
echo.
echo   2. JSON WEB TOKENS (JWT):
echo      When a user logs in, the server signs a cryptographic token:
echo      jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
echo.
echo   3. AUTHORIZATION HEADER:
echo      The React client saves the token in localStorage and attaches it to every
echo      outgoing request: Authorization: Bearer <token>
echo.
echo   4. ROLE-BASED ACCESS CONTROL (RBAC):
echo      SkillBridge enforces three strict roles:
echo      - CLIENT:      Can post projects, review proposals, and fund milestones.
echo      - FREELANCER:  Can submit proposals, upload portfolio, and submit work.
echo      - ADMIN:       Can moderate projects, suspend accounts, and view platform charts.
echo.
echo      Middleware roleMiddleware.js protects endpoints:
echo      router.post('/', protect, authorize('CLIENT'), createProject);
echo.
pause
goto MENU

:CONCEPT_LIFECYCLE
cls
echo ===============================================================================
echo CONCEPT 3: THE CORE MARKETPLACE LIFECYCLE
echo ===============================================================================
echo.
echo   STEP 1: PROJECT POSTING
echo   Client creates a project with Title, Category, Budget Range, Skills, and Deadline.
echo.
echo   STEP 2: DISCOVERY AND PROPOSALS
echo   Freelancers search projects and submit bids with:
echo   - Bid Amount (INR)
echo   - Estimated Delivery Time (Days)
echo   - Cover Letter Pitch
echo.
echo   STEP 3: ACCEPTANCE AND AUTO-CONTRACT GENERATION
echo   When the Client accepts a proposal:
echo   - Proposal status is marked ACCEPTED (others are marked REJECTED).
echo   - Project status changes from OPEN to IN_PROGRESS.
echo   - A Contract is created automatically, broken down into 3 realistic Milestones:
echo       * Milestone 1: Prototype / Architecture Setup (30%%)
echo       * Milestone 2: Core Feature Implementation   (40%%)
echo       * Milestone 3: Testing & Final Delivery      (30%%)
echo.
echo   STEP 4: MILESTONE DELIVERABLE WORKFLOW
echo   - Freelancer implements Milestone 1 and clicks "Submit Work" with demo notes.
echo   - Client reviews deliverable and clicks "Approve & Pay".
echo   - Escrow payment processes, milestone becomes PAID, earnings are credited.
echo.
echo   STEP 5: COMPLETION AND REVIEWS
echo   Client marks the contract COMPLETED. Both leave 1-to-5 star reviews,
echo   which automatically recalculates the freelancer's public average rating.
echo.
pause
goto MENU

:CONCEPT_SOCKETS
cls
echo ===============================================================================
echo CONCEPT 4: REAL-TIME WEBSOCKETS (SOCKET.IO) VS HTTP REST
echo ===============================================================================
echo.
echo   HTTP REST:
echo   - Unidirectional: Client requests -> Server responds -> Connection closes.
echo   - Inefficient for live chat because clients would have to poll the server
echo     every 2 seconds, overloading the database.
echo.
echo   WEBSOCKETS WITH SOCKET.IO:
echo   - Bidirectional and persistent: Single TCP connection remains open.
echo   - Either client or server can push messages instantly with zero latency.
echo.
echo   HOW SKILLBRIDGE IMPLEMENTS CHAT:
echo   1. Handshake Auth: Socket authenticates the JWT during connection.
echo   2. Scoped Rooms:
echo      - user_<id>: Private room for in-app alert notifications.
echo      - conversation_<id>: Shared room for active chat between two users.
echo   3. Events Emitted:
echo      - send_message: Stores message in MongoDB and broadcasts to room.
echo      - typing_start / typing_stop: Shows live "User is typing..." indicators.
echo      - user_status_change: Broadcasts Online / Offline presence.
echo.
pause
goto MENU

:CONCEPT_ALGORITHM
cls
echo ===============================================================================
echo CONCEPT 5: THE AI FREELANCER RECOMMENDATION ALGORITHM
echo ===============================================================================
echo.
echo   SkillBridge uses a multi-factor recommendation engine implemented in:
echo   backend/services/recommendationService.js
echo.
echo   THE FORMULA:
echo   Score = (Skill Match x 40%%)
echo         + (Experience x 20%%)
echo         + (Rating Score x 20%%)
echo         + (Budget Compatibility x 10%%)
echo         + (Reliability Rate x 10%%)
echo.
echo   1. Skill Match (40%%):
echo      Measures intersection of required project tags vs freelancer skills:
echo      Matched Skills / Total Required Skills
echo.
echo   2. Experience Level (20%%):
echo      Compares project requirements (Entry, Intermediate, Expert) with the
echo      freelancer's verified experience level.
echo.
echo   3. Rating Score (20%%):
echo      Normalizes the freelancer's 5-star rating (Rating / 5.0).
echo.
echo   4. Budget Compatibility (10%%):
echo      Checks whether the freelancer's hourly rate fits within client budget.
echo.
echo   5. Reliability & Completion Rate (10%%):
echo      Rewards proven completion of past contracts on the platform.
echo.
echo   Resulting score is shown on project and freelancer cards (e.g. "94%% Match").
echo.
pause
goto MENU

:SEED_DB
cls
echo ===============================================================================
echo SEEDING DATABASE WITH REALISTIC DEMO ACCOUNTS
echo ===============================================================================
echo.
echo Running node backend/seed.js...
echo.
node backend/seed.js
echo.
pause
goto MENU

:START_BACKEND
cls
echo ===============================================================================
echo STARTING BACKEND API SERVER (PORT 5000)
echo ===============================================================================
echo.
cd /d "%~dp0backend"
node server.js
pause
goto MENU

:START_FRONTEND
cls
echo ===============================================================================
echo STARTING FRONTEND REACT SERVER (PORT 5173)
echo ===============================================================================
echo.
cd /d "%~dp0frontend"
npm run dev
pause
goto MENU

:START_BOTH
cls
echo ===============================================================================
echo LAUNCHING SKILLBRIDGE FULL-STACK PLATFORM
echo ===============================================================================
echo.
echo Starting Backend API server on http://localhost:5000 in a new window...
start "SkillBridge Backend (Port 5000)" cmd /k "cd /d %~dp0backend && set PATH=%PATH%;C:\Users\vansh\.nodejs && node server.js"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo Starting Frontend React application on http://localhost:5173 in a new window...
start "SkillBridge Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && set PATH=%PATH%;C:\Users\vansh\.nodejs && npm run dev"

echo.
echo ===============================================================================
echo Both servers have been launched!
echo.
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:5000/api/health
echo.
echo Demo Test Credentials:
echo   Client:     client@skillbridge.com     / password123
echo   Freelancer: freelancer@skillbridge.com / password123
echo   Admin:      admin@skillbridge.com      / password123
echo ===============================================================================
echo.
pause
goto MENU

:HEALTH_CHECK
cls
echo ===============================================================================
echo RUNNING SYSTEM HEALTH CHECK
echo ===============================================================================
echo.
echo Checking Node version:
node -v
echo Checking npm version:
npm -v
echo.
echo Checking Backend package.json:
if exist "%~dp0backend\package.json" (echo [OK] backend/package.json exists) else (echo [FAIL] backend/package.json missing)
echo Checking Frontend package.json:
if exist "%~dp0frontend\package.json" (echo [OK] frontend/package.json exists) else (echo [FAIL] frontend/package.json missing)
echo Checking Frontend production build dist:
if exist "%~dp0frontend\dist\index.html" (echo [OK] frontend/dist/index.html built successfully) else (echo [INFO] Build not generated yet)
echo.
pause
goto MENU
