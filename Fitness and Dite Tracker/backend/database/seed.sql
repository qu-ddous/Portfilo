-- ==========================================
-- SEED DATA FOR FITNESS & DIET TRACKER
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Insert Admin User (Password: admin123)
-- Hash generated using bcrypt ($2a$12$R9h/lIPzHZPZ.rV1.7YxOuY.8a/.rG5b6G8G6G8G6G8G6G8G6G8G6)
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
  'System Admin', 
  'admin@fittracker.com', 
  '$2b$10$knbDXfAlLAZW2a6UlZ1je.KmPoro9o874e1UOqNAkXFXdBT1Z3iEC', -- admin123
  'admin', 
  'active'
);

-- 2. Insert Sample User (Password: user123)
INSERT INTO users (name, email, password_hash, role, status, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal, daily_calorie_target)
VALUES (
  'John Doe', 
  'user@example.com', 
  '$2b$10$knbDXfAlLAZW2a6UlZ1je.KmPoro9o874e1UOqNAkXFXdBT1Z3iEC', -- user123 (now admin123)
  'user', 
  'active',
  28,
  'male',
  180,
  85.0,
  75.0,
  'moderately_active',
  'weight_loss',
  2100
);

-- 3. Insert Sample Workouts
INSERT INTO workouts (title, description, duration_mins, difficulty_level, thumbnail_url, exercises)
VALUES 
(
  'Full Body Blast', 
  'A high-intensity workout covering all major muscle groups.', 
  45, 
  'intermediate', 
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
  '[{"name": "Squats", "sets": 3, "reps": 12}, {"name": "Pushups", "sets": 3, "reps": 15}]'
),
(
  'Morning Yoga', 
  'Relaxing flow to start your day with energy.', 
  20, 
  'beginner', 
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  '[{"name": "Sun Salutation", "sets": 5, "reps": 1}]'
);

-- 4. Insert Sample Meals
INSERT INTO meals (name, description, meal_type, calories, protein_g, carbs_g, fats_g, image_url)
VALUES 
(
  'Grilled Chicken Salad', 
  'Lean chicken breast with fresh greens and olive oil.', 
  'Lunch', 
  450, 
  45, 
  10, 
  20, 
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
),
(
  'Oatmeal & Berries', 
  'Slow-release carbs with antioxidants.', 
  'Breakfast', 
  320, 
  12, 
  55, 
  6, 
  'https://images.unsplash.com/photo-1517673132405-a56a62b18977'
);
