# BloodLink Blood Bank Management System - A to Z Complete Guide

Yeh document dono files (`Complete Guide` aur `Missing Gaps`) ka mukammal majmooa hai. Is mein A to Z saari details, coding prompts, data flow, aur validations shamil hain. Sari technical details Roman Urdu aur English technical terms ke sath likhi gayi hain.

---

## 1. Tech Stack & Environment
**Layer | Technology**
*   **Frontend**: React 18 + Vite, Tailwind CSS v3, ShadCN UI, Zustand (State), React Router v6, Axios, Recharts (Charts), jsPDF + html2canvas, Framer Motion, ShadCN Sonner.
*   **Backend**: Node.js + Express
*   **Database & Auth**: Supabase (PostgreSQL) + Supabase Auth (JWT)

**Color Scheme:**
*   Primary: `#C0392B` (Buttons, active nav) | Primary Light: `#E74C3C` (Hover)
*   Background: `#F8F9FA` | Card BG: `#FFFFFF`
*   Text Primary: `#2C3E50` | Text Muted: `#7F8C8D` | Border: `#E5E7EB`
*   Status: Success `#27AE60` | Warning `#F39C12` | Danger `#E74C3C` | Info `#2980B9`

**Environment Setup (Phase 1):**
*   *Frontend `.env`*: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL=http://localhost:5000`
*   *Backend `.env`*: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `PORT=5000`
*   *Rul*e: `.env` file ko kabhi git mein push nahi karna. `.env.example` banani hai.

---

## 2. Roles, Permissions & Data Flow

**Roles:**
1.  **Admin**: Full access. Dashbord, reports, staff management, inventory, delete options.
2.  **Staff / Technician**: Register donors, record donations, test results enter karna, requests manage karna. No admin access.
3.  **Donor**: Own profile, history, download certificate, next eligible date dekhna.
4.  **Patient**: Submit request, track own request status. Dusre patients ki details nahi dekh sakta.

**Core Data Flows (Har feature is path ko follow karega):**
1.  **Login Flow**: React Hook Form validate karega -> POST `/api/auth/login` -> Backend Supabase signInWithPassword use karega -> Role fetch karega -> Frontend authStore update hoga -> Axios interceptor mein token set hoga -> Role ke hisab se Dashboard par redirect.
2.  **Donor Registration Flow**: Staff form fill karega -> Frontend Zod validation -> POST signup -> Backend user aur donor table mein data insert karega (is_eligible: true) -> Record Donation page par redirect.
3.  **Record Donation & Tests**: Staff units aur date enter karega (status: pending). Baad mein test result enter karega -> Agar "approved" to `blood_inventory` mein units add, donor ki `is_eligible=false`, `next_eligible_date = today+90 days`. Agar "rejected", to notification jayega aur donor 30 din k liye block.
4.  **Blood Request Flow**: Patient form bharega -> Zod validation -> POST -> Agar stock kam bhi ho to request ban jayegi (pending). Staff approve karega to inventory se units deduct honge. Patient ko notification jayegi.
5.  **Inventory Update Flow**: Agar koi change aaye to frontend par `inventoryStore.fetchInventory()` call hogi. Agar 5 units se kam kisi blood type ka stock ho to Admin+Staff ko alert aayega.

---

## 3. Deep Validation Rules & Security Layer

**Frontend Zod Validation & Backend Checks:**
*   **Password**: Min 8 chars, 1 uppercase, 1 number, 1 special char (`!@#$%^&*`). Same as email na ho.
*   **Donor**: Age 18-65, weight min 50kg. Phone 11 digits exact. Blood type valid.
*   **Donation**: Units 1 ya 2 sirf. Date past ya future ki galat nahi honi chahiye. Donor `is_eligible=true` hona chahiye warna block.
*   **Blood Request**: Units 1-10. Urgency (normal/urgent/critical). Medical condition min 10 chars. Required date past ki nahi honi chahiye. Ek blood type ke liye duplicate pending request allow nahi hai.

**Business Logic (Real Rules):**
1.  **Eligibility**: Age, Weight, 90-days gap pass hona lazmi. Agar test fail hua tha to 30 days wait. Tattoo/Piercing wale 6 mahine block.
2.  **Expiry**: Blood 42 days mein expire hota hai. `expiry_date = collection_date + 42 days`. Expired blood deduct nahi ho sakta, admin dispose karega.
3.  **Priorities**: Critical (Top, Red) -> Urgent (Amber) -> Normal (Blue).
4.  **FIFO Deduction**: Request approve hone par hamesha OLDEST (purana) non-expired khoon pehle deduct hoga. Agar required units mojood na hon to error aayega!
5.  **Rate Limiting & Security (Backend)**: `express-rate-limit` (General 100 req/15min, Login 5 req/15min). `helmet` headers ke liye. JWT validation har jagah, Backend par Role DB se check hoga JWT payload se nahi. Backend par Data ownership check hogi (e.g., patient can only see own requests).

**Notifications Logic:**
*   New request: Staff+Admin
*   Request Approved/Rejected/Fulfilled: Patient
*   Donation Test Approved/Rejected: Donor
*   Low Stock (<5): Admin+Staff
*   Blood Expired: Admin
*   Notification Polling: Frontend par `setInterval` run hoga har 30 seconds baad.

---

## 4. DEVELOPMENT PHASES (A to Z Work Plan)

Hamesha aik phase 100% mukammal karein, test karen, Git commit karen, aur phir agle par jayen.

### PHASE 1 — Project Setup + Database
**Tasks:**
1. Vite + React project, Tailwind, ShadCN configure karen.
2. Sab folders banayen: `api/`, `components/ui/`, `components/layout/`, `components/shared/`, `pages/`, `store/`, `hooks/`, `utils/`, `constants/`.
3. Constants define karen: `bloodTypes.js`, `roles.js`, `statusColors.js`.
4. Supabase DB: 8 tables banayen (users, donors, donations, blood_inventory, patients, blood_requests, staff, notifications) + RLS policies (donors/patients sirf apna data, staff sabka bina admin reports).
5. `src/api/axiosInstance.js` banayen. (Base URL, auto JWT).
**Test:** `npm run dev` working. Console clean. DB ready.
**Commit:** `"Phase 1: Project setup + database complete"`

### PHASE 2 — Auth System
**Tasks:**
1. `authStore.js` (Zustand): state (user, token, isAuthenticated).
2. `api/auth.js`: login, signup, logout, getCurrentUser.
3. **Login Page**: Zod password schema apply karen. Success par role-based redirection.
4. **Signup Page**: 2 Steps (Role selection -> Form).
5. **AppRouter.js**: Protected routes setup karen (No token -> /login, Wrong role -> own dashboard).
**Test:** Login flow, wrong passwords block hon, redirection sahi ho.
**Commit:** `"Phase 2: Auth system + protected routes complete"`

### PHASE 3 — Reusable Components + ErrorBoundary
**Tasks:**
1. **UI**: `Button`, `Input`, `Modal`, `Badge`, `Alert`, `Skeleton`, `EmptyState`, `PageLoader`.
2. **Shared**: `StatCard`, `DataTable`, `ConfirmDialog`, `BloodTypeBadge`, `NotificationBell`.
3. **Layouts**: `Topbar`, `Sidebar` (responsive drawer), `AdminLayout`, `StaffLayout`, `DonorLayout`, `PatientLayout`, `PublicLayout`.
4. **Security & Errors**: `ErrorBoundary.jsx` banayen jo App.jsx ko wrap kare. Aur Axios ke interceptor mein Global Error Handler lagayen (401 pe logout, 403, 404 alert).
**Test:** Components render without error. Mobile sidebar check.
**Commit:** `"Phase 3: Reusable components + ErrorBoundary complete"`

### PHASE 4 — Public Pages (Landing, Login, Signup)
**Tasks:**
1. **Landing Page**: Navbar, Hero section, Stats bar (animated numbers), Blood types available cards, How it works, Urgent needs banner, Footer.
2. **About & Contact Pages**: Static UI.
**Test:** Landing page animations work, looks good on 375px mobile.
**Commit:** `"Phase 4: Public pages complete"`

### PHASE 5 — Admin Pages
**Tasks:**
1. **Admin Dashboard**: 4 StatCards, Recharts bar & pie charts, Recent tables, Low stock alerts.
2. **Donors, Patients, Staff Pages**: DataTables with Actions (View/Edit/Delete Modals). Zod forms inside modals.
3. **Blood Inventory**: Expiry date auto-calculate (collection + 42 dias). Expired rows red bg.
4. **Blood Requests**: Approve modal (**FIFO logic apply** aur check karen agar units na hon). Reject with reason.
5. **Reports**: 4 Tabs (Monthly, Usage, Donors, Expired) with PDF/CSV export logic. Settings.
**Test:** All tables load. Admin can add staff. Requests modify status properly.
**Commit:** `"Phase 5: Admin pages complete"`

### PHASE 6 — Staff Pages
**Tasks:**
1. **Dashboard**: Stats and recent activity.
2. **Register Donor**: Pehle search, warna form show (Age, Weight, eligibility checks lazmi).
3. **Record Donation**: Form mein donor show ho, agar ineligible hai to block karein.
4. **Test Results**: Enter cases (HIV, Hep B, etc). Clear -> add to inventory + donor 90 days delay. Positive -> Rejected + notification.
5. **Manage Requests**: Process, Review, Approve.
**Test:** Eligibility blocks work. Test approval inserts into inventory.
**Commit:** `"Phase 6: Staff pages complete"`

### PHASE 7 — Donor Pages
**Tasks:**
1. **Dashboard**: Next Eligible Date display (useEffect se auto-update logic). Impact counts.
2. **Donation History**: Table with Status.
3. **Certificate**: Approved donations ka jsPDF se certificate download.
4. **Profile**: Update info (email can't change).
**Test:** PDF downloads with correct donor details.
**Commit:** `"Phase 7: Donor pages complete"`

### PHASE 8 — Patient Pages
**Tasks:**
1. **Dashboard**: Request stats.
2. **Submit Request**: Duplicate request block check. Past date pe error. Zod validation.
3. **Track Request**: Visual timeline (Pending -> Review -> Approved -> Fulfilled).
4. **Profile**: Update details.
**Test:** Prevent double request of same blood type.
**Commit:** `"Phase 8: Patient pages complete"`

### PHASE 9 — Backend API (Node + Express)
**Tasks:**
1. Express app: `cors`, `helmet`, `express.json`.
2. Middleware: `authMiddleware`, `roleMiddleware` (hamesha DB se role laye), `errorHandler`, `express-rate-limit` (login limit: 5/15min).
3. API Routes for Auth, Donors, Donations, Inventory, Requests, Staff, Notifications, Reports.
4. Notifications Insert logic aur FIFO inventory deduction code yahin perform hoga.
**Test:** Postman/Thunder Client par sab test karen. API proper JSON structure de.
**Commit:** `"Phase 9: Backend API complete"`

### PHASE 10 — Integration + Polish
**Tasks:**
1. Frontend API URLs connect karen. No dummy data.
2. `inventoryStore`, `notificationStore` ko 30s polling par set karen.
3. Har fetch par Loading Skeletons aur failed par Empty/Error states add karen.
4. Responsive / UI polish. End to End flow check karen.
**Test:** Register donor -> Donate -> Staff tests it -> Inventory updates -> Patient requests -> Staff approves -> Patient gets blood + Notification.
**Commit:** `"Phase 10: Full integration + polish complete", tag "v1.0.0"`

---
**Sari Missing Gaps Info Is Document Me Samal Di Gayi Hai.** Aap kisi bhi phase ka code maang kar kaam start karwa sakte hain!