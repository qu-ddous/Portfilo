# 🏋️ Fitness & Diet Tracker Platform v2.0

A professional, full-stack fitness management system featuring a Flutter mobile application, React admin dashboard, and Node.js/Socket.io backend.

## 🚀 Quick Start (Production)

The easiest way to launch the entire platform is using Docker Compose.

```bash
docker-compose up --build
```

### 🔗 Service Endpoints
- **Mobile API**: `http://localhost:3001`
- **Admin Panel**: `http://localhost:5173`
- **Database**: Supabase Protected PostgreSQL

---

## 🛠️ Project Structure

### 1. 📱 Mobile Application (Flutter)
- **Tech**: Riverpod (Modern Notifiers), Dio, Hive, Socket.io Client.
- **Features**:
  - Real-time Workout & Meal Logging.
  - Progress Tracking with Interactive Line Charts.
  - QR/Barcode Food Nutrition Scanner.
  - Instant Broadcast Notifications via WebSockets.
  - Modern Glassmorphic UI with Drawer Navigation.

### 2. 🖥️ Admin Dashboard (React)
- **Tech**: React + Vite, Recharts, Lucide Icons, Framer Motion.
- **Features**:
  - **Platform Overview**: Live growth and engagement analytics.
  - **User Management**: Deep dive into user metrics and progress charts.
  - **Meal/Workout Management**: Bulk management with WebP image uploads.
  - **System Broadcast**: Send real-time announcements to all users.
  - **Audit Logs**: Secure tracking of all administrative actions.
  - **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop.

### 3. ⚙️ Backend API (Node.js)
- **Tech**: Express, Socket.io, Supabase SDK, Axios.
- **Security**:
  - JWT Authentication with Refresh Token rotation.
  - Role-based Access Control (RBAC).
  - Rate limiting & Helmet.js security headers.
  - Automated Admin Audit Logging.

---

## 📝 Setup Instructions

1. **Backend**:
   - Navigate to `/backend`
   - Copy `.env.example` to `.env` and fill in your Supabase & USDA keys.
   - Run `npm install` and `npm start`.

2. **Admin Panel**:
   - Navigate to `/admin-panel`
   - Copy `.env.example` to `.env`.
   - Run `npm install` and `npm run dev`.

3. **Mobile App**:
   - Ensure Flutter SDK 3.10+ is installed.
   - Run `flutter pub get`.
   - Run `flutter run`.

---

## 🔒 Security & Performance
- **Image Optimization**: All meal images are handled via WebP to save bandwidth.
- **Real-time**: Leverages WebSocket channels for zero-latency notifications.
- **Privacy**: No sensitive user IDs are exposed in the Admin UI.

**Developed by Antigravity AI for a Premium Fitness Experience.**
