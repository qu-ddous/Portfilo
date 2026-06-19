# 🗳️ MASTER PROMPT — Secure Online Election Management System

**Stack:** React 18 (Vite) + Node.js + Express + Supabase + Tailwind CSS + Framer Motion + Three.js  

---

## ═══════════════════════════════════════
## PHASE 0 — PROJECT OVERVIEW & RULES
## ═══════════════════════════════════════

### What we are building
A full-stack Secure Online Election Management System where:
- Super Admins manage the whole platform
- Election Creators request approval, create polls, manage candidates
- Voters register, receive secret IDs, cast anonymous votes
- Public can see live results on a landing page

### Absolute Rules (follow in every phase)
- Every page must be fully responsive (mobile + tablet + desktop)
- Use Tailwind CSS only for styling — no inline styles
- All API calls go through `/src/services/` layer, never directly in components
- All Supabase queries use Row Level Security (RLS) — no exceptions
- All forms must have validation (react-hook-form + zod)
- All errors must be caught and shown via toast notifications (react-hot-toast)
- Use React Router v6 for routing with protected route wrappers
- Use Zustand for global state management
- Use React Query (TanStack Query) for all server state / data fetching
- Use Framer Motion for all page transitions and micro-interactions
- 3D background effects via Three.js (particle field on landing page and auth pages)
- NO hardcoded secrets — all env vars go in `.env` file
- Every module must have loading states, error states, and empty states

### Roles & Permissions Matrix
| Action | Super Admin | Election Creator | Voter | Public |
|--------|------------|-----------------|-------|--------|
| Approve/Reject creators | ✅ | ❌ | ❌ | ❌ |
| Create elections | ❌ | ✅ (after approval) | ❌ | ❌ |
| Add candidates | ❌ | ✅ | ❌ | ❌ |
| Start/Stop election | ❌ | ✅ | ❌ | ❌ |
| Cast vote | ❌ | ❌ | ✅ | ❌ |
| View live results | ✅ | ✅ | ✅ | ✅ |
| View winner details | ✅ | ✅ | ❌ | ❌ |
| Download audit logs | ✅ | ❌ | ❌ | ❌ |
| Admin override | ✅ | ❌ | ❌ | ❌ |

---

## ═══════════════════════════════════════
## PHASE 1 — PROJECT SETUP
## ═══════════════════════════════════════

### 1A — Frontend Setup
Run these commands exactly in frontend folder.

### 1B — Backend Setup
Initialize Node.js backend with Express and all dependencies.

### 1C — Folder Structure (Frontend)
```
src/
├── assets/
├── components/
│   ├── ui/                    ← Reusable UI: Button, Input, Card, Modal, Badge, etc.
│   ├── layout/                ← Navbar, Sidebar, Footer, PageWrapper
│   ├── charts/                ← VoteBarChart, TurnoutPieChart, LiveResultChart
│   ├── three/                 ← ParticleField, GlobeBackground (Three.js)
│   └── animations/            ← BubbleCard, ShimmerCard, FloatWrapper
├── pages/
│   ├── public/                ← Landing, ElectionDetail (public)
│   ├── auth/                  ← Login, Register, ForgotPassword, ResetPassword
│   ├── admin/                 ← AdminDashboard, ApprovalQueue, AuditLogs, AllElections
│   ├── creator/               ← CreatorDashboard, CreateElection, ManageCandidates, ElectionControl
│   └── voter/                 ← VoterDashboard, MyPolls, CastVote, VoteConfirmation
├── hooks/                     ← useAuth, useElection, useVote, useRealtime
├── services/                  ← api.js, auth.service.js, election.service.js, vote.service.js
├── store/                     ← authStore.js, uiStore.js, electionStore.js
├── utils/                     ← helpers.js, validators.js, constants.js, cn.js
├── router/                    ← index.jsx, ProtectedRoute.jsx, RoleRoute.jsx
└── styles/                    ← globals.css, animations.css
```

### 1D — Folder Structure (Backend)
```
src/
├── routes/                    ← auth.routes.js, election.routes.js, vote.routes.js, admin.routes.js
├── controllers/               ← auth.controller.js, election.controller.js, vote.controller.js
├── middleware/                ← auth.middleware.js, role.middleware.js, rateLimit.middleware.js, validate.middleware.js
├── services/                  ← supabase.service.js, email.service.js, secretId.service.js
├── utils/                     ← helpers.js, constants.js
└── app.js                     ← main Express app
```

### 1E — Environment Files

**Frontend `.env`:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend `.env`:**
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_256bit
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=elections@yourdomain.com
FRONTEND_URL=http://localhost:5173
```

### 1F — Tailwind Config
See configuration in TAILWIND_CONFIG.js reference below.

---

## ═══════════════════════════════════════
## PHASE 2 — SUPABASE DATABASE SCHEMA
## ═══════════════════════════════════════

### 2A — Enable Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2B — Tables to Create (in order)
1. profiles (extends auth.users)
2. creator_requests
3. elections
4. candidates
5. voter_registrations
6. votes (anonymous)
7. audit_logs
8. notifications

### 2C — Row Level Security Policies
- All tables have RLS enabled
- Profiles: users see own, admins see all
- Elections: public read published/active/completed, creator manages own
- Candidates: public read published elections
- Voter registrations: voter sees own, creator sees their elections
- Votes: anonymous, no individual read access
- Notifications: only owner access

### 2D — Database Functions (RPCs)
1. get_vote_counts(election_id) — Safe aggregate of vote counts
2. get_voter_count(election_id) — Total voter count
3. check_voter_limit() — Auto-lock when max reached

---

## ═══════════════════════════════════════
## PHASE 3 — BACKEND (Node.js + Express)
## ═══════════════════════════════════════

### API Routes Overview

**Auth Routes** `/api/auth/`
- POST /register
- POST /login
- POST /request-creator
- GET /me

**Admin Routes** `/api/admin/`
- GET /creator-requests
- PATCH /creator-requests/:id/approve
- PATCH /creator-requests/:id/reject
- GET /elections
- GET /users
- GET /audit-logs
- GET /audit-logs/download

**Election Routes** `/api/elections/`
- POST / (create)
- GET / (list)
- GET /:id (detail)
- PUT /:id (update)
- PATCH /:id/publish
- PATCH /:id/start
- PATCH /:id/stop
- GET /:id/results
- GET /:id/winner

**Candidate Routes** `/api/elections/:electionId/candidates/`
- POST /
- GET /
- PUT /:id
- DELETE /:id

**Voter Registration Routes** `/api/elections/:electionId/register/`
- POST /
- DELETE /
- GET /status

**Vote Routes** `/api/votes/`
- POST /cast
- GET /my-vote/:electionId

**Notification Routes** `/api/notifications/`
- GET /
- PATCH /:id/read
- PATCH /read-all

### Key Security Features
- Secret IDs hashed with SHA-256
- Vote tokens generated from secret_id + election_id + JWT_SECRET
- No voter_id stored in votes table
- Rate limiting: 5 votes/minute per IP
- Helmet security headers
- CORS restricted to frontend URL

---

## ═══════════════════════════════════════
## PHASE 4 — FRONTEND CORE SETUP
## ═══════════════════════════════════════

### Core Services & Stores
1. **Supabase Client** - Auto-refresh JWT sessions
2. **API Service** - Axios with JWT interceptor
3. **Auth Store** (Zustand) - User state, profile, initialization
4. **Router** - React Router v6 with protected routes

### Router Structure
- Public routes: /, /election/:id
- Auth routes: /login, /register, /forgot-password
- Admin routes: /admin/dashboard, /admin/approvals, /admin/audit-logs
- Creator routes: /creator/dashboard, /creator/create, /creator/elections/:id/...
- Voter routes: /voter/dashboard, /voter/polls, /voter/vote/:electionId

---

## ═══════════════════════════════════════
## PHASE 5 — UI DESIGN SYSTEM & COMPONENTS
## ═══════════════════════════════════════

### Design Theme
- **Color Scheme**: Dark Neon / Midnight Aurora
- **Background**: #0a0a1a (deep space)
- **Cards**: Glassmorphism with gradient borders
- **Typography**: Clash Display (headings) + Satoshi (body)
- **Effects**: Hover glow, scale transforms, particle fields

### Core Components
1. **BubbleCard** - Universal card with animations
2. **ParticleField** - Three.js background
3. **Button** - All variants (primary, danger, ghost, success)
4. **Input** - With label and error display
5. **Badge** - Status indicators
6. **Modal** - Dialog wrapper
7. **Navbar** - Public navigation
8. **Sidebar** - Authenticated navigation
9. **PageWrapper** - Page transition animation

---

## ═══════════════════════════════════════
## PHASE 6 — ALL PAGES (15 Total Pages)
## ═══════════════════════════════════════

### Public Pages (Visible to Everyone)
1. **Landing Page (/)** - Hero, stats, election grid, search
2. **Election Detail (/election/:id)** - Full election info, candidates, live results

### Auth Pages
3. **Register Page (/register)** - SignUp form, email verification
4. **Login Page (/login)** - Email + password, role-based redirect
5. **Forgot Password** - Email recovery flow

### Admin Pages
6. **Admin Dashboard (/admin/dashboard)** - Stats, quick actions, recent activity
7. **Approval Queue (/admin/approvals)** - Pending creator requests, approve/reject
8. **Audit Logs (/admin/audit-logs)** - Filterable action log, CSV export

### Creator Pages
9. **Creator Dashboard (/creator/dashboard)** - My elections, stats
10. **Create Election (/creator/create)** - Multi-step form (4 steps)
11. **Manage Candidates (/creator/elections/:id/candidates)** - Add/edit/delete
12. **Election Control (/creator/elections/:id/control)** - **CRITICAL** - Voter finalization, start/stop, live results
13. **Request Creator (/request-creator)** - Creator approval request form

### Voter Pages
14. **Voter Dashboard (/voter/dashboard)** - My polls, stats, action buttons
15. **Cast Vote (/voter/vote/:electionId)** - **CRITICAL** - Secret ID entry, candidate selection
16. **Vote Confirmation (/voter/vote/:electionId/confirmed)** - Success animation

---

## ═══════════════════════════════════════
## PHASE 7 — REAL-TIME & NOTIFICATIONS
## ═══════════════════════════════════════

### Real-time Features
- Vote count updates via Supabase Realtime
- Live voter registration count
- Live turnout percentage
- Countdown timers

### Notification System
- Approval/Rejection notifications
- Secret ID delivery notifications
- Election start notifications
- Result notifications
- Notification bell in navbar with unread badge

---

## ═══════════════════════════════════════
## PHASE 8 — LAYOUT & NAVIGATION
## ═══════════════════════════════════════

### Navigation Components
- **Navbar** - Logo, links, user menu (public & authenticated)
- **Sidebar** - Role-based navigation (admin/creator/voter)
- **Footer** - Links, copyright
- **Page Wrapper** - Framer Motion transitions

### Responsive Design
- Mobile: Full-width, collapsible sidebar
- Tablet: Optimized spacing, touch-friendly
- Desktop: Full layout, sidebar visible

---

## ═══════════════════════════════════════
## PHASE 9 — BUSINESS RULES
## ═══════════════════════════════════════

| Rule | Detail |
|------|--------|
| Voter registration | Only during `published` + before deadline + list not locked |
| Voter list lock | Auto-locks when count >= max_voters (DB trigger) |
| Secret ID sending | After creator finalizes voters — one-time action |
| Vote casting | Only during `active` + within start_time–end_time |
| Anonymity | votes table has NO voter_id |
| Duplicate votes | Prevented by unique vote_token constraint |
| Draft elections | Never public |
| Candidate editing | Locked once election is `active` |
| Election stopping | Creator can manually stop active election |
| Admin override | Admin can add/remove voters from locked list |
| Result visibility | Vote counts public, individual votes never exposed |
| Winner visibility | Only creator + admin |

---

## ═══════════════════════════════════════
## PHASE 10 — ERROR HANDLING
## ═══════════════════════════════════════

### Frontend Error Strategy
- Try/catch on all API calls
- Toast notifications for all errors
- Form validation errors shown inline
- Network offline detection
- Error boundaries on each page

### Backend Error Format
```json
{ "error": "Human readable message", "code": "ERROR_CODE" }
```

### Common Error Codes
- `ELECTION_NOT_ACTIVE` - Voting window closed
- `INVALID_SECRET_ID` - Wrong voter ID
- `ALREADY_VOTED` - Vote already cast
- `VOTER_LIST_LOCKED` - Registration closed
- `UNAUTHORIZED` - Login required
- `FORBIDDEN` - Insufficient permissions

---

## ═══════════════════════════════════════
## PHASE 11 — SECURITY CHECKLIST
## ═══════════════════════════════════════

- [ ] All tables have RLS with policies
- [ ] Backend uses service role key only
- [ ] Frontend uses anon key only
- [ ] JWT validated on protected routes
- [ ] Role middleware on sensitive endpoints
- [ ] Secret IDs hashed (SHA-256)
- [ ] Vote tokens unhashable (deterministic)
- [ ] No voter_id in votes table
- [ ] Rate limiting on vote endpoint (5/min)
- [ ] Helmet security headers
- [ ] CORS restricted
- [ ] Input validation on all POST/PATCH
- [ ] Storage bucket authenticated write
- [ ] React Query cache cleared on logout
- [ ] No sensitive data in logs

---

## ═══════════════════════════════════════
## PHASE 12 — DEPLOYMENT
## ═══════════════════════════════════════

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Add env vars
4. Deploy

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Add env vars
4. Deploy

### Supabase
1. Create project
2. Run SQL schema
3. Set up auth
4. Create storage bucket

---

## ═══════════════════════════════════════
## PHASE 13 — BONUS FEATURES
## ═══════════════════════════════════════

- Dark mode toggle with localStorage
- PDF download of results
- QR code invite links
- Waitlist system with promotion
- Email notifications
- Two-factor authentication
- Export voter list as CSV

---

## BUILD PHASES CHECKLIST

- [ ] Phase 1: Project Setup
- [ ] Phase 2: Database Schema
- [ ] Phase 3: Backend API
- [ ] Phase 4: Frontend Core
- [ ] Phase 5: UI Components
- [ ] Phase 6: All Pages
- [ ] Phase 7: Real-time Features
- [ ] Phase 8: Layout & Navigation
- [ ] Phase 9-11: Business Rules & Security
- [ ] Phase 12: Deployment
- [ ] Phase 13: Bonus Features

**Do NOT skip phases. Each phase builds on the previous.**
