# 🗳️ Secure Online Election Management System — Setup Guide

## Quick Start

### 1️⃣ PHASE 1: Project Setup ✅ COMPLETE
- ✅ Frontend (Vite + React 18)
- ✅ Backend (Node.js + Express)
- ✅ All dependencies installed
- ✅ Environment files created
- ✅ Folder structures created
- ✅ Tailwind CSS configured
- ✅ Router setup with protected routes
- ✅ Auth store (Zustand) setup

**Location:**
- Frontend: `/frontend`
- Backend: `/backend`

**Next Step:** Update `.env` files with your Supabase credentials

---

### 2️⃣ PHASE 2: Supabase Database Schema ✅ COMPLETE

**Location:** `SUPABASE_SCHEMA.sql`

#### Steps to Apply:
1. Go to [Supabase Dashboard](https://supabase.com)
2. Create a new project or use existing one
3. Go to **SQL Editor** tab
4. Open `SUPABASE_SCHEMA.sql` in this project
5. Copy ALL the SQL code
6. Paste it into Supabase SQL Editor
7. Click **Run** or press `Ctrl+Enter`
8. Wait for completion (all green checkmarks)

**What Gets Created:**
- ✅ 8 Tables (profiles, elections, candidates, voter_registrations, votes, audit_logs, etc.)
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Database functions (get_vote_counts, get_voter_count, etc.)
- ✅ Triggers (auto-lock voters, auto-create profiles, timestamps)
- ✅ Indexes (for performance)

**Important:** After running SQL, note your Supabase credentials:
- `VITE_SUPABASE_URL` - Project URL
- `VITE_SUPABASE_ANON_KEY` - Anon key (from Settings > API)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (from Settings > API)

Add these to:
- `frontend/.env`
- `backend/.env`

---

### 3️⃣ PHASE 3: Backend API Routes & Controllers 🔄 IN PROGRESS

**Status:** Will be implemented next

---

## Environment Variables Setup

### Frontend (`.frontend/.env`)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`.backend/.env`)
```
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

JWT_SECRET=your_jwt_secret_256bit_key_here_minimum_32_characters

RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=elections@yourdomain.com

FRONTEND_URL=http://localhost:5173
```

---

## Running Locally

### Terminal 1 — Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components (organized by role)
│   ├── services/        # API calls & Supabase
│   ├── store/           # Zustand stores
│   ├── utils/           # Helper functions
│   ├── router/          # React Router config
│   ├── styles/          # CSS & animations
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── vite.config.js       # Vite config
├── .env                 # Environment variables
└── package.json         # Dependencies
```

### Backend
```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth, validation, etc.
│   ├── services/        # Business logic
│   ├── utils/           # Helpers
│   └── app.js           # Express app setup
├── .env                 # Environment variables
└── package.json         # Dependencies
```

---

## Key Technologies

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Three.js
- **Backend:** Node.js, Express, Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth + JWT
- **State:** Zustand (frontend), Supabase (backend)
- **Validation:** Zod, React Hook Form, Express Validator
- **UI:** Radix UI, Lucide React
- **Email:** Resend
- **HTTP:** Axios
- **Routing:** React Router v6

---

## Security Features

✅ Row Level Security (RLS) on all Supabase tables  
✅ Anonymous voting (no voter_id stored with votes)  
✅ Secret ID hashing (SHA-256)  
✅ Vote token generation  
✅ Rate limiting (5 votes/minute)  
✅ JWT validation  
✅ Helmet security headers  
✅ CORS protection  
✅ Input validation  
✅ Audit logging  

---

## Phases Checklist

- [x] Phase 0: Project Overview
- [x] Phase 1: Project Setup
- [x] Phase 2: Database Schema
- [ ] Phase 3: Backend API
- [ ] Phase 4: Frontend Core
- [ ] Phase 5: UI Components
- [ ] Phase 6: All Pages
- [ ] Phase 7: Real-time Features
- [ ] Phase 8: Layout & Navigation
- [ ] Phase 9-11: Business Rules & Security
- [ ] Phase 12: Deployment
- [ ] Phase 13: Bonus Features

---

## Documentation Files

- `MASTER_PROMPT.md` - Complete project specification
- `SUPABASE_SCHEMA.sql` - Database schema (SQL)
- `README.md` - This file

---

## Next Steps

1. ✅ Update `.env` files with Supabase credentials
2. ⏳ Run the Supabase SQL schema (PHASE 2)
3. ⏳ Build backend API routes (PHASE 3)
4. ⏳ Build frontend core (PHASE 4)
5. ⏳ Create UI components (PHASE 5)
6. ⏳ Implement all pages (PHASE 6)
7. ⏳ Add real-time features (PHASE 7)
8. ⏳ Setup layout & navigation (PHASE 8)
9. ⏳ Test & security audit (PHASE 9-11)
10. ⏳ Deploy (PHASE 12)

---

## Support

For detailed implementation guide, see `MASTER_PROMPT.md`

**Built with ❤️ for secure, transparent elections**
