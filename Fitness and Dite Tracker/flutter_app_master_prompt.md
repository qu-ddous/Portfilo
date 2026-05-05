# 🚀 Master Flutter UI/UX Prompt: Fitness & Diet Tracker

## 1. Project Vision
Create a premium, high-performance fitness and nutrition tracking mobile application. The design must feel state-of-the-art, utilizing a "Glassmorphic" aesthetic that works seamlessly across both Light and Dark themes.

---

## 2. Technical Stack & Design System
- **Framework**: Flutter (Dart)
- **State Management**: Riverpod (StateNotifier/Notifier)
- **Networking**: Dio (with JWT Interceptors)
- **Design Language**: Glassmorphism (Translucency + Backdrop Blur)
- **Typography**: Google Fonts (Outfit / Inter)
- **Color Palette**:
  - **Primary**: Neon Green (`#4CAF50`)
  - **Secondary**: Electric Blue (`#2196F3`)
  - **Warning/Accent**: Vivid Orange (`#FF9800`)
  - **Dark BG**: Deep Charcoal (`#0F1419`)
  - **Light BG**: Minimalist Off-White (`#F8F9FA`)

---

## 3. Core UI Components

### A. The GlassCard Widget
- **Visuals**: Semi-transparent background with a subtle white border (0.1 opacity).
- **Effect**: `BackdropFilter` with Sigma (10, 10).
- **Functionality**: Dynamic opacity adjustment based on theme (Light mode = darker tint, Dark mode = lighter tint).
- **Properties**: Custom border radius (default 24), padding, and optional custom color support.

### B. Dynamic Progress Indicators
- **Dashboard Circle**: A glowing circular progress representing calorie percentage.
- **Macro Bars**: Minimalist horizontal bars for Protein (Red), Carbs (Blue), and Fats (Orange).

---

## 4. Screen Specifications

### 📱 Screen 1: The Command Center (Dashboard)
- **Top Bar**: Personalized greeting ("Hello, [Name] 👋") with a notification icon container.
- **Onboarding Banner**: A GlassCard with an info icon alerting users to "Complete Profile" to get targets.
- **Main Metric**: Elevated GlassCard showing "Consumed vs. Target" calories with a smooth progress bar.
- **Macro Row**: Three distinct columns showing Grams + Label for each macronutrient.
- **Quick Links**: Horizontal list of "Recommended Workouts" with dumbbell icons and time-stamps.

### 📱 Screen 2: The Nutrition Lab (Meal Logger)
- **Category Picker**: Custom horizontal scrollable row of chips (Breakfast, Lunch, Dinner, Snacks).
- **Smart Search**: Input field with a magnifying glass prefix and a QR Code scanner suffix.
- **Result Cards**: List view with food name, calories per serving, and a "tap to select" interaction.
- **Quantity Control**: A branded slider to adjust serving size (0.5x to 5.0x) with real-time math feedback.

### 📱 Screen 3: The Command Vault (Profile & Settings)
- **Header**: Large circular avatar with a "Pulse" neon-green border and a "Camera" edit icon.
- **Biometric Grid**: Four quadrants showing Weight, Height, Age, and Current Fitness Goal.
- **Settings Section**: 
  - **Theme Toggle**: A premium switch to flip between Light and Dark modes.
  - **Security**: "Change Password" and "2FA" tiles with chevron icons.
- **Logout Action**: A distinct red-themed button or icon to clear sessions.

---

## 5. Interaction & Experience (UX)
- **Theme Switching**: The entire app must update in real-time without a restart.
- **Async Feedback**: Use sleek "Success Snackbars" when actions (logging/updating) are completed.
- **Empty States**: If no meals are logged, show a "No meals yet" placeholder with a minimalist icon.
- **Calculator Logic**: The UI must capture Gender, Age, Weight, Height, and Goal to trigger a server-side Mifflin-St Jeor calculation.

---

## 6. Prompt Keywords for Generation
`Premium UI`, `Glassmorphism`, `Neumorphic Accents`, `Health & Fitness`, `Real-time Data Sync`, `Riverpod Architecture`, `Clean Code`, `Dynamic Theming`, `Blur Effects`, `Modern Typography`.
