-- ============================================================
-- FITNESS & DIET TRACKER - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status VARCHAR(15) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  height_cm DECIMAL(5, 2),
  current_weight_kg DECIMAL(6, 2),
  target_weight_kg DECIMAL(6, 2),
  activity_level VARCHAR(25) DEFAULT 'moderately_active'
    CHECK (activity_level IN ('sedentary','lightly_active','moderately_active','very_active')),
  fitness_goal VARCHAR(20) DEFAULT 'maintenance'
    CHECK (fitness_goal IN ('weight_loss','muscle_gain','maintenance')),
  daily_calorie_target INT,
  signup_date TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  phone VARCHAR(50),
  avatar TEXT,
  system_settings JSONB
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ============================================================
-- 2. WORKOUTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(15) DEFAULT 'intermediate'
    CHECK (difficulty IN ('beginner','intermediate','advanced')),
  duration_minutes INT,
  created_by UUID NOT NULL REFERENCES users(id),
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workouts_created_by ON workouts(created_by);
CREATE INDEX IF NOT EXISTS idx_workouts_status     ON workouts(status);

-- ============================================================
-- 3. EXERCISES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  muscle_group VARCHAR(50),
  equipment_needed VARCHAR(100),
  created_by UUID NOT NULL REFERENCES users(id),
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);

-- ============================================================
-- 4. WORKOUT_EXERCISES (Junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  recommended_sets INT,
  recommended_reps INT,
  recommended_weight_kg DECIMAL(6, 2),
  rest_seconds INT,
  sequence_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);

-- ============================================================
-- 5. WORKOUT_ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(15) DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_assignments_user_id ON workout_assignments(user_id);

-- ============================================================
-- 6. USER_WORKOUTS (Completed Logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id),
  completed_date TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_workouts_user_id        ON user_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workouts_completed_date ON user_workouts(completed_date);

-- ============================================================
-- 7. USER_EXERCISE_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id UUID NOT NULL REFERENCES user_workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  sets_completed INT,
  reps_per_set INT[],
  weight_kg DECIMAL(6, 2),
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_exercise_logs_exercise_id ON user_exercise_logs(exercise_id);

-- ============================================================
-- 8. MEALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  meal_type VARCHAR(10) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  image_url VARCHAR(500),
  created_by UUID NOT NULL REFERENCES users(id),
  source VARCHAR(25) DEFAULT 'admin_created'
    CHECK (source IN ('admin_created','usda_api','open_food_facts')),
  external_api_id VARCHAR(255),
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_meal_type   ON meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_meals_created_by  ON meals(created_by);

-- ============================================================
-- 9. MEAL_NUTRITION
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  calories DECIMAL(8, 2),
  protein_grams DECIMAL(6, 2),
  carbs_grams DECIMAL(6, 2),
  fats_grams DECIMAL(6, 2),
  fiber_grams DECIMAL(6, 2),
  serving_size_grams DECIMAL(6, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_nutrition_meal_id ON meal_nutrition(meal_id);

-- ============================================================
-- 10. MEAL_PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_created_by ON meal_plans(created_by);

-- ============================================================
-- 11. MEAL_PLAN_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id),
  meal_slot VARCHAR(10) NOT NULL CHECK (meal_slot IN ('breakfast','lunch','dinner','snack')),
  sequence_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_items_meal_plan_id ON meal_plan_items(meal_plan_id);

-- ============================================================
-- 12. MEAL_PLAN_ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(15) DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_assignments_user_id ON meal_plan_assignments(user_id);

-- ============================================================
-- 13. USER_MEALS (Logged Meals)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id),
  logged_date TIMESTAMPTZ DEFAULT NOW(),
  quantity_served INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_meals_user_id     ON user_meals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_meals_logged_date ON user_meals(logged_date);

-- ============================================================
-- 14. WEIGHT_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6, 2) NOT NULL,
  logged_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id     ON weight_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_logged_date ON weight_logs(logged_date);

-- ============================================================
-- 15. BODY_MEASUREMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chest_cm DECIMAL(5, 2),
  waist_cm DECIMAL(5, 2),
  hips_cm DECIMAL(5, 2),
  left_arm_cm DECIMAL(5, 2),
  right_arm_cm DECIMAL(5, 2),
  measured_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements(user_id);

-- ============================================================
-- 16. PROGRESS_PHOTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url VARCHAR(500) NOT NULL,
  photo_type VARCHAR(10) DEFAULT 'progress' CHECK (photo_type IN ('before','progress','after')),
  angle VARCHAR(10) DEFAULT 'front' CHECK (angle IN ('front','side','back')),
  uploaded_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);

-- ============================================================
-- 17. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(25) NOT NULL CHECK (type IN (
    'workout_assigned','meal_plan_assigned','goal_achieved','reminder','system_alert'
  )),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- 18. ADMIN_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_nutrition_updated_at BEFORE UPDATE ON meal_nutrition
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
