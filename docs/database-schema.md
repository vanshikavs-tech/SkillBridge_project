# SkillBridge — Database Schema Documentation

SkillBridge uses MongoDB with Mongoose object data modeling.

---

## 1. Collections Diagram

```text
  ┌──────────────┐             ┌──────────────┐
  │     User     │ 1 ────────* │   Project    │
  └──────┬───────┘             └──────┬───────┘
         │ 1                          │ 1
         │                            │
         ▼ *                          ▼ *
  ┌──────────────┐             ┌──────────────┐
  │   Proposal   │ * ──────── 1│   Contract   │
  └──────────────┘             └──────┬───────┘
                                      │ 1
                                      ▼ *
                               ┌──────────────┐
                               │  Milestone   │ (Embedded in Contract)
                               └──────────────┘
```

---

## 2. Collections Overview

### 1. `users`
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, hashed with bcrypt)
- `role` ('CLIENT' | 'FREELANCER' | 'ADMIN')
- `avatar`, `bio`, `title`, `location`
- `skills` ([String])
- `hourlyRate` (Number)
- `experienceLevel` ('ENTRY' | 'INTERMEDIATE' | 'EXPERT')
- `portfolio` ([{ title, description, projectUrl, imageUrl }])
- `rating` (Number, 1.0 to 5.0)
- `totalReviews`, `totalEarnings`, `totalSpent`, `completedProjectsCount`
- `isVerified`, `isSuspended`

### 2. `projects`
- `clientId` (ObjectId ref User)
- `title`, `description`, `category`
- `skills` ([String])
- `budget` ({ min: Number, max: Number })
- `deadline` (Date)
- `experienceLevel` ('ENTRY' | 'INTERMEDIATE' | 'EXPERT')
- `attachments` ([{ name, url }])
- `status` ('OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')
- `proposalsCount` (Number)
- `hiredFreelancer` (ObjectId ref User)

### 3. `proposals`
- `projectId` (ObjectId ref Project)
- `freelancerId` (ObjectId ref User)
- `coverLetter` (String)
- `bidAmount` (Number)
- `estimatedDays` (Number)
- `status` ('PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN')
- Compound Unique Index: `{ projectId: 1, freelancerId: 1 }`

### 4. `contracts`
- `projectId` (ObjectId ref Project)
- `clientId` (ObjectId ref User)
- `freelancerId` (ObjectId ref User)
- `proposalId` (ObjectId ref Proposal)
- `amount` (Number), `totalPaid` (Number)
- `status` ('ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED')
- `milestones`: Subdocument array containing:
  - `title`, `description`, `amount`, `status` ('PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'PAID')
  - `deliverables` ([{ notes, fileUrl, submittedAt }])

### 5. `conversations` & `messages`
- `Conversation`: `participants` ([ObjectId ref User]), `projectId`, `lastMessage`, `lastMessageAt`
- `Message`: `conversationId`, `senderId`, `receiverId`, `message`, `attachments`, `read`

### 6. `reviews`
- `contractId` (ObjectId ref Contract)
- `reviewerId`, `revieweeId` (ObjectId ref User)
- `rating` (1 to 5)
- `comment` (String)

### 7. `payments`
- `contractId`, `milestoneId`, `payerId`, `payeeId`
- `amount`, `currency`, `paymentMethod`, `stripePaymentIntentId`, `status`

### 8. `notifications`
- `userId`, `type`, `title`, `message`, `relatedId`, `isRead`
