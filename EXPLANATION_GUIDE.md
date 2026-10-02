# SkillBridge — Architectural & Code Walkthrough Guide

Welcome to **SkillBridge**! This comprehensive guide is written specifically for you to **read, learn, and master every layer of this full-stack MERN freelance marketplace codebase**. 

Whether you are preparing for software engineering interviews, discussing this project on your portfolio, or building new features, this guide walks you through the core concepts, patterns, data flows, and design decisions.

---

## Table of Contents
1. [The Big Picture: Full-Stack MERN Architecture](#1-the-big-picture-full-stack-mern-architecture)
2. [Folder Structure & Component Responsibilities](#2-folder-structure--component-responsibilities)
3. [The Core Marketplace Lifecycle](#3-the-core-marketplace-lifecycle)
4. [Security: Authentication & Role-Based Access Control (RBAC)](#4-security-authentication--role-based-access-control-rbac)
5. [Database Modeling: Schemas & Relationships](#5-database-modeling-schemas--relationships)
6. [Real-Time WebSockets with Socket.IO](#6-real-time-websockets-with-socketio)
7. [The AI Recommendation & Matching Algorithm](#7-the-ai-recommendation--matching-algorithm)
8. [Escrow & Milestone Payment Architecture](#8-escrow--milestone-payment-architecture)
9. [Frontend State Management & React Architecture](#9-frontend-state-management--react-architecture)
10. [Portfolio Interview Talking Points](#10-portfolio-interview-talking-points)

---

## 1. The Big Picture: Full-Stack MERN Architecture

The **MERN stack** consists of four key technologies working together:
- **M - MongoDB**: A NoSQL document database storing JSON-like documents.
- **E - Express.js**: A minimalist web application framework for Node.js handling HTTP routing and middleware.
- **R - React.js**: A component-based frontend library managing state, UI interactions, and routing.
- **N - Node.js**: The JavaScript runtime environment executing backend server code.

### High-Level Request Flow

```text
  [ React Browser ]
         │
         │ (1) HTTP REST Request (with JWT Bearer Token in Authorization header)
         ▼
  [ Express API Server (Node.js) ]
         │
         ├──► (2) CORS Middleware (validates allowed origins)
         ├──► (3) authMiddleware (decodes JWT, validates user, checks suspension)
         ├──► (4) roleMiddleware (ensures CLIENT, FREELANCER, or ADMIN permissions)
         ├──► (5) Controller Handler (executes business logic)
         │           │
         │           ▼
         │       (6) Mongoose Models & MongoDB Queries
         │
         ├──► (7) JSON Response returned to React
         │
  [ WebSocket Layer (Socket.IO) ]
         │
         └──► Full-duplex persistent connection for instant messaging & notifications
```

---

## 2. Folder Structure & Component Responsibilities

### Backend (`/backend`)
```text
backend/
├── config/
│   ├── db.js             # Mongoose connection with automatic in-memory fallback
│   ├── cloudinary.js     # Cloud file storage configuration
│   └── stripe.js         # Stripe API client & test simulation handler
├── controllers/          # Business logic handlers (auth, user, project, proposal, contract, etc.)
├── middleware/
│   ├── authMiddleware.js # Protects routes using jsonwebtoken verification
│   ├── roleMiddleware.js # Enforces RBAC ('CLIENT', 'FREELANCER', 'ADMIN')
│   ├── errorMiddleware.js# Centralized error handler converting exceptions to clean JSON
│   └── uploadMiddleware.js# Multer multi-part form data parser with file size limits
├── models/               # Mongoose data schemas (User, Project, Proposal, Contract, Message, Review)
├── routes/               # Express router modules defining API URLs and middleware chains
├── services/             # Reusable business services (Recommendation engine, payments, notifications)
├── sockets/
│   └── chatSocket.js     # Socket.IO connection events, rooms, typing indicators
├── utils/
│   ├── ApiError.js       # Standardized custom error class with HTTP status codes
│   ├── generateToken.js  # Signs JWT tokens with payload { id, role }
│   └── pagination.js     # Helper for skip/limit slicing and metadata
├── app.js                # Express app setup, middleware, and route mounting
├── server.js             # HTTP and WebSocket server startup
└── seed.js               # Database seeder with realistic test accounts
```

### Frontend (`/frontend`)
```text
frontend/src/
├── components/           # Reusable UI widgets (Navbar, Footer, Button, Modal, Cards, ProtectedRoute)
├── layouts/              # Role-specific layout wrappers (ClientLayout, FreelancerLayout, AdminLayout)
├── pages/
│   ├── Home/             # Public landing page with hero, categories, and featured talent
│   ├── Auth/             # Login (with 1-click demo buttons), Register, ForgotPassword
│   ├── Client/           # PostProject, ClientDashboard, MyProjects, ProjectDetails, Contracts
│   ├── Freelancer/       # BrowseProjects, FreelancerDashboard, SubmitProposal, MyProposals, Earnings
│   ├── Profile/          # Public profile view & EditProfile
│   ├── Messages/         # Real-time chat interface with active conversation list
│   ├── Payments/         # Transaction history and milestone billing
│   └── Admin/            # Executive analytics dashboard (Recharts), Users, Projects moderation
├── services/             # Axios API calls grouped by resource
├── store/
│   ├── authStore.jsx     # React Context for session token, user state, and permissions
│   └── notificationStore.jsx # Socket.IO connection and notification toast dispatcher
└── routes/
    └── AppRoutes.jsx     # React Router v6 tree with role-protected route guards
```

---

## 3. The Core Marketplace Lifecycle

Understanding this lifecycle is crucial for explaining the project:

```text
 1. Post Project       Client creates job posting (Title, Category, Budget range, Skills).
       │
       ▼
 2. Discover & Match   Freelancers browse jobs; AI algorithm ranks compatibility (0 - 100%).
       │
       ▼
 3. Submit Proposal    Freelancer submits a bid with bid amount, delivery days, and cover letter.
       │
       ▼
 4. Review & Chat      Client reviews bids, checks freelancer profile, and chats via WebSockets.
       │
       ▼
 5. Hire & Contract    Client clicks "Accept Proposal":
                       - Proposal status becomes ACCEPTED (others REJECTED).
                       - Project status becomes IN_PROGRESS.
                       - A Contract is created automatically with 3 structured Milestones!
       │
       ▼
 6. Submit Work        Freelancer implements Milestone 1 and submits work with deliverable notes.
       │
       ▼
 7. Approve & Pay      Client reviews deliverables, clicks "Approve & Pay":
                       - Payment is processed (Stripe / Escrow release).
                       - Milestone is marked PAID, funds credited to freelancer earnings.
       │
       ▼
 8. Completion & Review Contract is marked COMPLETED. Both parties leave 1-to-5 star reviews.
```

---

## 4. Security: Authentication & Role-Based Access Control (RBAC)

### Password Hashing
We never store plain text passwords in MongoDB.
In [`backend/models/User.js`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/backend/models/User.js):
```javascript
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
- A cryptographic **salt** is generated to protect against rainbow table attacks.
- `select: false` prevents the hashed password from ever accidentally leaking into query results.

### JWT Token Verification
When a user logs in, the server signs a token:
```javascript
jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
```
When requests arrive:
1. `authMiddleware.js` extracts `Bearer <token>` from the HTTP `Authorization` header.
2. It verifies the signature with `JWT_SECRET`.
3. It loads the user from the database and confirms `isSuspended: false`.
4. It attaches the user to `req.user`.

### Role-Based Access Control (RBAC)
In [`backend/middleware/roleMiddleware.js`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/backend/middleware/roleMiddleware.js):
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }
    next();
  };
};
```
Endpoints like `POST /api/projects` are guarded by `authorize('CLIENT', 'ADMIN')`, ensuring a freelancer cannot post a project, and clients cannot submit bids.

---

## 5. Database Modeling: Schemas & Relationships

### Key Relational References in MongoDB:
- **Project**: References `clientId` (`User._id`) and `hiredFreelancer` (`User._id`).
- **Proposal**: References `projectId` and `freelancerId`. Compound unique index `{ projectId: 1, freelancerId: 1 }` prevents a freelancer from submitting duplicate bids on the same job.
- **Contract**: References `projectId`, `clientId`, `freelancerId`, `proposalId`, and contains an embedded array of `milestones`.
- **Review**: References `contractId`, `reviewerId`, and `revieweeId`. When saved, it automatically recalculates the reviewee's average rating in MongoDB.

---

## 6. Real-Time WebSockets with Socket.IO

HTTP is request-response. If Client A sends a message to Freelancer B, without WebSockets, Freelancer B would have to poll the server every few seconds.

With **Socket.IO**:
1. When the client logs in, `NotificationProvider` establishes a persistent connection passing `{ auth: { token } }`.
2. The server verifies the JWT and adds the socket to a private room: `socket.join('user_' + userId)`.
3. When inside a chat thread, the client joins `conversation_${conversationId}`.
4. When `send_message` fires:
   - The message is saved to MongoDB.
   - It is broadcast instantly to `conversation_${conversationId}`.
   - A notification is pushed to the recipient's private room.
   - Typing events (`typing_start` / `typing_stop`) provide live feedback.

---

## 7. The AI Recommendation & Matching Algorithm

Located in [`backend/services/recommendationService.js`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/backend/services/recommendationService.js).

### The Mathematical Formula:
$$\text{Score} = (\text{Skill Match} \times 0.40) + (\text{Experience} \times 0.20) + (\text{Rating} \times 0.20) + (\text{Budget} \times 0.10) + (\text{Reliability} \times 0.10)$$

1. **Skill Match (40% Weight)**:
   Measures intersection of required project skill tags vs freelancer skills:
   $$\text{Ratio} = \frac{|\text{ProjectSkills} \cap \text{FreelancerSkills}|}{|\text{ProjectSkills}|}$$
2. **Experience Level (20% Weight)**:
   Maps levels (`ENTRY`: 1, `INTERMEDIATE`: 2, `EXPERT`: 3) and applies penalties if under-qualified.
3. **Rating Score (20% Weight)**:
   Normalizes the 5-star rating: $\frac{\text{Rating}}{5.0}$.
4. **Budget Compatibility (10% Weight)**:
   Checks if the freelancer's hourly rate fits within the project's budget scope.
5. **Completion Rate & Reliability (10% Weight)**:
   Rewards verified contract completions on the platform.

Resulting score is bounded between 10% and 100% and displayed visually with a badge (e.g. `94% Match`).

---

## 8. Escrow & Milestone Payment Architecture

1. **Escrow Philosophy**:
   The client does not pay the entire lump sum directly to the freelancer upfront.
   Instead, the contract breaks work into milestones:
   - *Milestone 1*: Prototype & Setup (e.g. ₹15,000)
   - *Milestone 2*: Core Implementation (e.g. ₹20,000)
   - *Milestone 3*: Testing & Delivery (e.g. ₹13,000)
2. **Stripe & Simulation Dual-Mode**:
   In [`backend/services/paymentService.js`](file:///c:/Users/vansh/OneDrive/Desktop/PROJECT/backend/services/paymentService.js), if live Stripe keys are provided, it constructs a real Stripe Checkout Session with webhook verification.
   If running offline or in development without Stripe keys, the system executes a safe test payment simulation, updating the contract status, recording the transaction, and crediting earnings in MongoDB immediately.

---

## 9. Frontend State Management & React Architecture

1. **`authStore.jsx` (Global Context)**:
   Maintains user authentication across page refreshes using `localStorage`. Provides `user`, `token`, `isClient`, `isFreelancer`, `isAdmin`, `login`, `register`, and `logout`.
2. **`notificationStore.jsx`**:
   Connects the React app to the backend Socket.IO server, listens for incoming messages and alerts, and maintains unread counts.
3. **`ProtectedRoute.jsx`**:
   Inspects `allowedRoles` to ensure users cannot tamper with the URL bar to view unauthorized pages.
4. **Reverse Proxy Configuration (`vite.config.js`)**:
   Vite proxies `/api` and `/uploads` directly to `http://localhost:5000`, eliminating CORS issues during development.

---

## 10. Portfolio Interview Talking Points

When presenting this project in technical interviews:

- **Architecture**: *"I designed SkillBridge as a modular full-stack MERN platform with role-based access control for Clients, Freelancers, and Admins. The backend adheres to clean controller-service-model separation with centralized error handling."*
- **Real-Time Features**: *"For communication, I integrated Socket.IO with JWT handshake authentication and room-based scoping, allowing clients and freelancers to chat with live typing indicators and instant notifications."*
- **Algorithmic Matching**: *"I engineered a multi-factor recommendation algorithm combining skill intersection ratios, experience level weights, ratings, and budget compatibility to rank top matches for clients and freelancers."*
- **Milestone Escrow**: *"To mirror real-world marketplace operations, contracts are structured into milestones where payments are released incrementally upon client deliverable approval."*
