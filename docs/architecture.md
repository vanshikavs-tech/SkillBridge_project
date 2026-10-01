# SkillBridge — Architecture Documentation

## 1. System Overview

SkillBridge is an end-to-end full-stack MERN freelance marketplace platform connecting Clients, Freelancers, and Administrators.

```text
                               SKILLBRIDGE
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                 CLIENT        FREELANCER         ADMIN
                    │               │               │
               Post Project    Create Profile   Manage Users
                    │               │               │
               Receive Bids    Browse Projects  Manage Projects
                    │               │               │
               Hire            Submit Proposal   Reports
                    │               │               │
               Contract        Complete Work    Analytics
                    │               │
               Payment         Get Paid
                    │
               Review
```

---

## 2. Component Topology

```text
                     ┌──────────────────┐
                     │   React (Vite)   │
                     │  Tailwind CSS    │
                     └─────────┬────────┘
                               │
                      HTTP / WebSockets
                               │
                     ┌─────────▼────────┐
                     │ Express API App  │
                     │  Node.js Server  │
                     └────┬────────┬────┘
                          │        │
             ┌────────────┘        └────────────┐
             ▼                                  ▼
     ┌───────────────┐                  ┌───────────────┐
     │ MongoDB Atlas │                  │   Socket.IO   │
     │ / Memory DB   │                  │  Chat Server  │
     └───────────────┘                  └───────────────┘
```

---

## 3. Communication Protocols

| Channel | Protocol | Port | Purpose |
|---|---|---|---|
| Frontend to Backend | HTTP/1.1 (JSON) | 5000 / 5173 | RESTful queries and mutations |
| Real-time Messaging | WebSockets / WSS | 5000 | Chat messages, typing status, notifications |
| File Uploads | Multipart / Form-Data | 5000 | Avatar, portfolio attachments via Multer |
| Payments | HTTPS | External | Stripe Checkout Sessions / Webhooks |
