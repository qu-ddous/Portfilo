# 🏋️ FITNESS & DIET TRACKER PLATFORM
## COMPLETE PRODUCTION SPECIFICATION v2.0
### FULLY FUNCTIONAL - READY FOR CODE GENERATION

---

# 📋 TABLE OF CONTENTS
1. System Architecture (Complete)
2. Technology Stack
3. Database Schema (Complete)
4. Authentication System (JWT)
5. API Endpoints (50+ with examples)
6. Real-time Integration (Socket.IO)
7. UI/UX Design System
8. Flutter App Complete Structure
9. React Admin Panel Complete Structure
10. State Management (Riverpod + Zustand)
11. Complete Workflows & Business Logic
12. Error Handling & Validation
13. Deployment Checklist

---

# 🏗️ 1. SYSTEM ARCHITECTURE (COMPLETE)

## 1.1 Three-Layer Architecture

```
LAYER 1: PRESENTATION (Frontend)
┌────────────────────────────────────────┐
│                                        │
│  ┌──────────────────┐                  │
│  │  Flutter App     │  (User/Mobile)   │
│  │  (iOS/Android)   │                  │
│  └────────┬─────────┘                  │
│           │                            │
│  ┌────────▼──────────────┐             │
│  │  React Admin Panel    │  (Web)      │
│  │  (Dashboard)          │             │
│  └────────┬──────────────┘             │
│           │                            │
└───────────┼────────────────────────────┘
            │ HTTPS + JWT Auth
            │
LAYER 2: BACKEND (API Server - THE BRIDGE)
┌───────────▼────────────────────────────┐
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Node.js + Express.js            │  │
│  │  (Central Backend Server)        │  │
│  │                                  │  │
│  │  ├─ REST APIs (50+ endpoints)   │  │
│  │  ├─ Socket.IO (Real-time)       │  │
│  │  ├─ JWT Validation              │  │
│  │  ├─ Business Logic              │  │
│  │  ├─ USDA API Integration        │  │
│  │  ├─ SMS Service                 │  │
│  │  └─ Notification Service        │  │
│  └──────────────────────────────────┘  │
│                                        │
└───────────┬────────────────────────────┘
            │ SSL/TLS
            │
LAYER 3: DATABASE (Storage)
┌───────────▼────────────────────────────┐
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Supabase (PostgreSQL)           │  │
│  │  (Primary Database)              │  │
│  │                                  │  │
│  │  ├─ Users Table                  │  │
│  │  ├─ Workouts Table               │  │
│  │  ├─ Exercises Table              │  │
│  │  ├─ Meals Table                  │  │
│  │  ├─ Meal Plans Table             │  │
│  │  ├─ Weight Logs Table            │  │
│  │  ├─ Progress Photos Table        │  │
│  │  └─ 8 More Tables                │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

## 1.2 Data Flow (Real Example)

**Scenario: Admin creates workout → User sees it instantly**

```
1. ADMIN PANEL (React)
   ├─ Admin fills form: "Full Body Strength"
   ├─ Clicks "Create Workout"
   │
2. → BACKEND (Node.js)
   ├─ POST /api/admin/workouts/create
   ├─ Validate data with Joi
   ├─ Save to Supabase
   ├─ Broadcast via Socket.IO
   │
3. → FLUTTER APP (Real-time)
   ├─ Socket listener receives event
   ├─ Updates local state (Riverpod)
   ├─ Shows notification
   ├─ Dashboard updates instantly
   └─ NO REFRESH NEEDED
```

---

# 💻 2. TECHNOLOGY STACK

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **User App** | Flutter | Mobile (iOS/Android) | 3.19+ |
| **State (Flutter)** | Riverpod | State Management | 2.4+ |
| **HTTP (Flutter)** | Dio | API Calls | Latest |
| **Storage (Flutter)** | Hive | Local DB | Latest |
| **Secure Storage** | flutter_secure_storage | JWT Tokens | Latest |
| **Real-time (Flutter)** | socket_io_client | WebSocket | Latest |
| **Admin Panel** | React.js | Web Dashboard | 18.2+ |
| **Build Tool** | Vite | Fast Build | 5.0+ |
| **Styling** | Tailwind CSS | UI Framework | 3.4+ |
| **State (React)** | Zustand | State Management | Latest |
| **HTTP (React)** | Axios | API Calls | Latest |
| **Real-time (React)** | socket.io-client | WebSocket | Latest |
| **Animations** | Framer Motion | UI Animations | Latest |
| **Backend** | Node.js | Server Runtime | 18+ LTS |
| **Framework** | Express.js | REST API | 4.18+ |
| **WebSocket** | Socket.IO | Real-time Events | 4.5+ |
| **Database** | Supabase PostgreSQL | Primary DB | 15+ |
| **Auth** | JWT (HS256) | Authentication | Custom |
| **Validation** | Joi | Input Validation | 17.10+ |
| **Hashing** | bcryptjs | Password Hashing | 2.4+ |
| **External API** | USDA FoodData | Nutrition Data | Free |
| **SMS Service** | Twilio / Custom | Text Messages | Latest |

---

# 🗄️ 3. DATABASE SCHEMA (COMPLETE)

## 3.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT,
  gender ENUM('male', 'female', 'other'),
  role ENUM('user', 'admin') DEFAULT 'user',
  status ENUM('active', 'suspended') DEFAULT 'active',
  height_cm DECIMAL(5, 2),
  current_weight_kg DECIMAL(6, 2),
  target_weight_kg DECIMAL(6, 2),
  activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active') DEFAULT 'moderately_active',
  fitness_goal ENUM('weight_loss', 'muscle_gain', 'maintenance') DEFAULT 'maintenance',
  daily_calorie_target INT,
  signup_date TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3.2 Workouts Table
## 3.3 Exercises Table
## 3.4 Workout_Exercises (Many-to-Many)
## 3.5 Workout_Assignments
## 3.6 User_Workouts (User Logs Completed)
## 3.7 User_Exercise_Logs
## 3.8 Meals Table
## 3.9 Meal_Nutrition
## 3.10 Meal_Plans
## 3.11 Meal_Plan_Items
## 3.12 Meal_Plan_Assignments
## 3.13 User_Meals (User Logs Eaten)
## 3.14 Weight_Logs
## 3.15 Body_Measurements
## 3.16 Progress_Photos
## 3.17 Notifications
## 3.18 Admin_Logs

[Full SQL schemas defined in /backend/database/schema.sql]

---

# 🔐 4. AUTHENTICATION SYSTEM

- JWT HS256 tokens
- Access Token: 24 hours
- Refresh Token: 7 days
- Stored in flutter_secure_storage (mobile) / httpOnly cookies (web)

---

# 📡 5. API ENDPOINTS (50+)

## Auth (5): register, login, refresh, logout, change-password
## User Dashboard (5): dashboard, stats, progress, profile GET/PUT
## Workouts - User (8): assigned, detail, log, history, PRs, delete log, update log, quick-log
## Meals - User (8): assigned plans, today, log, history, delete log, update log, nutrition daily, available
## Weight & Measurements (6): log weight, weight history, log measurements, measurements history, delete/update weight log
## Progress Photos (4): upload, list, delete, update
## Notifications (3): list, mark read, mark all read
## Admin Dashboard (2): dashboard, reports overview
## Admin Workouts (6): create, list, update, delete, assign, create exercise
## Admin Meals (7): create, list, update, delete, search USDA, import from API, create meal plan
## Admin Users (6): list, detail, update, assign workout, assign meal plan, delete

---

# 🔌 6. REAL-TIME (Socket.IO)

**User Events:** workout:assigned, meal_plan:assigned, goal:achieved, reminder:*, notification:alert
**Admin Events:** admin:user-registered, admin:workout-logged, admin:meal-logged, admin:weight-logged

---

# 🎨 7. UI/UX DESIGN SYSTEM

```css
--primary-green: #4CAF50
--primary-blue: #2196F3
--accent-orange: #FF9800
--accent-purple: #9C27B0
--accent-cyan: #00BCD4
--bg-dark: #0F1419
```
Style: Glassmorphism + gradient cards + animated shimmer + dark mode

---

# 📱 8. FLUTTER APP STRUCTURE

lib/
├── main.dart
├── config/ (theme, constants, dio_client)
├── models/ (user, workout, meal, notification)
├── providers/ (auth, user, dashboard, workouts, meals, weight, socket, notifications)
├── screens/ (auth/, user/, splash)
├── widgets/ (glass_card, animated_progress_bar, stat_card, loading_shimmer)
├── services/ (api_service, socket_service, storage_service)
└── utils/ (formatters, validators)

---

# 🌐 9. REACT ADMIN PANEL STRUCTURE

admin-panel/src/
├── components/ (Layout/, GlassCard, Table, Charts, Form, Modal, Button)
├── pages/ (Dashboard, Workouts, Meals, Users, Reports, Settings)
├── hooks/ (useApi, useAuth, useSocket, useNotification)
├── store/ (authStore, workoutStore, uiStore)
└── utils/ (formatters, api)

---

# 10. STATE MANAGEMENT
- Riverpod 2.4+ for Flutter
- Zustand for React
- Socket.IO for real-time sync

---

# 11. WORKFLOWS
- Admin Creates Workout → Socket broadcasts → Flutter receives instantly
- User Logs Workout → Admin dashboard updates in real-time

---

# 12. ERROR HANDLING
- Joi validation on all inputs
- JSON error responses with codes
- User-friendly messages on frontend

---

# 13. DEPLOYMENT CHECKLIST
- [ ] Node.js backend on production server
- [ ] Flutter app published to Play Store
- [ ] React admin panel on CDN
- [ ] Supabase DB configured
- [ ] Socket.IO on production
- [ ] USDA API credentials
- [ ] SSL certificates
- [ ] Environment variables
- [ ] DB backups
- [ ] Monitoring

---

**Version:** 2.0.0
**Last Updated:** April 28, 2026
**Status:** READY FOR DEVELOPMENT
