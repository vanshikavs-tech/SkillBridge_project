# SkillBridge — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user (`name, email, password, role`) |
| `POST` | `/api/auth/login` | Public | Login with email and password |
| `POST` | `/api/auth/logout` | Private | Clear session |
| `GET` | `/api/auth/me` | Private | Get current authenticated user |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset instructions |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token |

---

## 2. Projects (`/api/projects`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Public | Browse projects with search and filters |
| `GET` | `/api/projects/:id` | Public | Get single project details |
| `POST` | `/api/projects` | Private (Client) | Create new project posting |
| `PUT` | `/api/projects/:id` | Private (Client) | Update existing project |
| `DELETE` | `/api/projects/:id` | Private (Client/Admin) | Delete project posting |
| `GET` | `/api/projects/client/my-projects` | Private (Client) | List projects posted by current client |
| `GET` | `/api/projects/recommended` | Private (Freelancer) | Get AI recommended projects |

---

## 3. Proposals (`/api/proposals` & `/api/projects/:id/proposals`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/projects/:id/proposals` | Private (Freelancer) | Submit proposal on project |
| `GET` | `/api/projects/:id/proposals` | Private (Client/Admin) | View all bids on project |
| `GET` | `/api/proposals/my-proposals` | Private (Freelancer) | View all submitted proposals |
| `POST` | `/api/proposals/:id/accept` | Private (Client) | Accept proposal & generate contract |
| `POST` | `/api/proposals/:id/reject` | Private (Client) | Reject proposal |
| `DELETE` | `/api/proposals/:id` | Private (Freelancer) | Withdraw proposal |

---

## 4. Contracts & Milestones (`/api/contracts`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/contracts` | Private | List active contracts for user |
| `GET` | `/api/contracts/:id` | Private | Get single contract with milestones |
| `PUT` | `/api/contracts/:id/milestones/:mId` | Private | Update milestone status (`SUBMITTED`/`PAID`) |
| `POST` | `/api/contracts/:id/complete` | Private (Client/Admin) | Complete contract |

---

## 5. Real-Time Chat & Messages (`/api/conversations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/conversations` | Private | Get user's conversation threads |
| `POST` | `/api/conversations` | Private | Get or create conversation thread |
| `GET` | `/api/conversations/:id/messages` | Private | Get message history |
| `POST` | `/api/messages` | Private | Send chat message (HTTP fallback) |

---

## 6. Payments (`/api/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-checkout` | Private (Client) | Create Stripe checkout / simulated payment |
| `GET` | `/api/payments/history` | Private | Get user's transaction records |
| `POST` | `/api/payments/webhook` | Public | Stripe webhook listener |

---

## 7. Admin Moderation (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Private (Admin) | Platform aggregate statistics & charts |
| `GET` | `/api/admin/users` | Private (Admin) | Paginated user management table |
| `PUT` | `/api/admin/users/:id/suspend` | Private (Admin) | Toggle user account suspension |
| `GET` | `/api/admin/projects` | Private (Admin) | Moderate project postings |
| `DELETE` | `/api/admin/projects/:id` | Private (Admin) | Permanently remove project |
