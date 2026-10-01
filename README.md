# 🚀 SkillBridge — Full-Stack MERN Freelance Marketplace

**SkillBridge** is a comprehensive, production-grade freelance marketplace web application built with the **MERN Stack** (MongoDB, Express, React, Node.js), inspired by Upwork and Fiverr.

Designed for high-impact software engineering portfolios and interviews, it features **Role-Based Access Control (Client, Freelancer, Admin)**, a complete **Proposal-to-Contract Milestone lifecycle**, **Socket.IO Real-Time Chat**, an **AI Compatibility Matching Algorithm**, and an interactive terminal concepts tutor (`CONCEPTS.cmd`).

---

## ⚡ Quick Start

### Option 1: 1-Click Windows Launcher
Double-click or run:
```bat
run-skillbridge.cmd
```
This automatically starts both the backend API (port 5000) and frontend React application (port 5173).

### Option 2: Interactive Concepts & Control Center
Run in terminal:
```bat
CONCEPTS.cmd
```
This interactive script teaches you all MERN concepts directly in the console and lets you seed or boot the platform with one keystroke!

### Option 3: Manual Startup

1. **Seed the database (Demo users & projects):**
   ```bash
   node backend/seed.js
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   node server.js
   ```

3. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```

4. Open browser at: **`http://localhost:5173`**

---

## 🔑 Pre-Seeded Demo Test Accounts

SkillBridge features **1-click login buttons** on the Login page, or you can use these credentials:

| Role | Email | Password | Primary Features |
|---|---|---|---|
| **👔 Client** | `client@skillbridge.com` | `password123` | Post projects, review proposals, hire freelancers, fund milestones |
| **💻 Freelancer** | `freelancer@skillbridge.com` | `password123` | Browse jobs, view AI match scores, submit bids, submit milestone work |
| **🛡️ Admin** | `admin@skillbridge.com` | `password123` | Platform analytics (Recharts), suspend accounts, moderate projects |

---

## 🌟 Key Features

### 1. Three Distinct Roles
- **Client**: Post projects, view proposals, hire talent, manage contracts & milestones, chat with applicants, release payments, and leave reviews.
- **Freelancer**: Create rich professional profile with portfolio items and hourly rate, browse projects with multi-parameter filters, submit proposals, chat with clients in real-time, submit deliverables, and track earnings.
- **Admin**: Executive dashboard with Recharts visualizations (Monthly Revenue, Categories breakdown, top freelancers), user moderation (suspension toggles), and project management.

### 2. AI Freelancer Matching Algorithm
A multi-factor algorithm scores compatibility between job requirements and freelancer profiles:
$$\text{Score} = (\text{Skill Match} \times 0.40) + (\text{Experience} \times 0.20) + (\text{Rating} \times 0.20) + (\text{Budget} \times 0.10) + (\text{Reliability} \times 0.10)$$
Shows match badges (e.g. `94% Match`) on project and freelancer cards!

### 3. Milestone & Escrow Workflow
When a client accepts a proposal, a Contract is generated with structured milestones:
- *Milestone 1*: Architecture & UI Setup (30%)
- *Milestone 2*: Core Feature Implementation (40%)
- *Milestone 3*: Polishing, Testing & Delivery (30%)

Freelancers submit work notes and links; clients review and release payments per milestone.

### 4. Real-Time Chat (Socket.IO)
- Persistent WebSocket connection with JWT authentication.
- Scoped conversation rooms and private notification channels.
- Live typing indicators ("User is typing..."), online status, and message history persistence in MongoDB.

### 5. Zero-Friction Database Architecture
The backend is configured with smart fallback:
- Automatically connects to `MONGO_URI` (MongoDB Atlas or local MongoDB).
- If local MongoDB is not installed, it automatically initializes an embedded in-memory MongoDB instance, allowing immediate testing out-of-the-box!

---

## 📚 Educational Resources & Learning Documents

- **[`EXPLANATION_GUIDE.md`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/EXPLANATION_GUIDE.md)**: In-depth code walkthrough explaining every file, middleware, and architectural design decision.
- **[`CONCEPTS.cmd`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/CONCEPTS.cmd)**: Interactive console application explaining MERN concepts and running quick commands.
- **[`docs/architecture.md`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/docs/architecture.md)**: High-level architectural diagrams and communication flows.
- **[`docs/api-documentation.md`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/docs/api-documentation.md)**: Full REST API endpoint specification.
- **[`docs/database-schema.md`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/docs/database-schema.md)**: Detailed Mongoose database schema references.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios, Socket.IO Client
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, Socket.IO, JWT, bcryptjs, Multer, Stripe SDK
- **Security**: JWT Bearer Authentication, bcrypt password hashing, RBAC, input sanitization, centralized error handling
