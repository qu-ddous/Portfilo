const Joi = require('joi');

// ─── AUTH ───────────────────────────────────────────────────
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(10).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  height_cm: Joi.number().min(50).max(300).optional(),
  current_weight_kg: Joi.number().min(10).max(500).optional(),
  target_weight_kg: Joi.number().min(10).max(500).optional(),
  activity_level: Joi.string()
    .valid('sedentary', 'lightly_active', 'moderately_active', 'very_active')
    .optional(),
  fitness_goal: Joi.string()
    .valid('weight_loss', 'muscle_gain', 'maintenance')
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
});

// ─── WORKOUTS ────────────────────────────────────────────────
const createWorkoutSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).optional(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  duration_minutes: Joi.number().integer().min(1).max(600).optional(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  image: Joi.string().allow('', null).optional(),
  exercises: Joi.array().items(
    Joi.object({
      exercise_id: Joi.string().uuid().required(),
      name: Joi.string().optional(), // Allow name for UI meta
      recommended_sets: Joi.number().integer().min(1).optional(),
      recommended_reps: Joi.number().integer().min(1).optional(),
      recommended_weight_kg: Joi.number().min(0).optional(),
      rest_seconds: Joi.number().integer().min(0).optional(),
      sequence_order: Joi.number().integer().min(1).optional(),
    }).unknown(true)
  ).optional(),
});

const createExerciseSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null).optional(),
  muscle_group: Joi.string().max(50).optional(),
  equipment_needed: Joi.string().max(100).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  image: Joi.string().allow('', null).optional(),
});

const logWorkoutSchema = Joi.object({
  workout_id: Joi.string().uuid().required(),
  duration_minutes: Joi.number().integer().min(1).required(),
  notes: Joi.string().max(500).optional(),
  exercises: Joi.array().items(
    Joi.object({
      exercise_id: Joi.string().uuid().required(),
      sets_completed: Joi.number().integer().min(0).optional(),
      reps_per_set: Joi.array().items(Joi.number().integer()).optional(),
      weight_kg: Joi.number().min(0).optional(),
      duration_seconds: Joi.number().integer().min(0).optional(),
    })
  ).optional(),
});

// ─── MEALS ───────────────────────────────────────────────────
const createMealSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  meal_type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
  image_url: Joi.string().uri().optional(),
  nutrition: Joi.object({
    calories: Joi.number().min(0).optional(),
    protein_grams: Joi.number().min(0).optional(),
    carbs_grams: Joi.number().min(0).optional(),
    fats_grams: Joi.number().min(0).optional(),
    fiber_grams: Joi.number().min(0).optional(),
    serving_size_grams: Joi.number().min(0).optional(),
    servings: Joi.number().min(0).optional(),
  }).optional(),
});

const logMealSchema = Joi.object({
  meal_id: Joi.string().uuid().required(),
  quantity_served: Joi.number().integer().min(1).default(1),
  logged_date: Joi.string().isoDate().optional(),
  notes: Joi.string().max(300).optional(),
});

// ─── WEIGHT ──────────────────────────────────────────────────
const logWeightSchema = Joi.object({
  weight_kg: Joi.number().min(10).max(500).required(),
  logged_date: Joi.string().isoDate().required(),
  notes: Joi.string().max(300).optional(),
});

const logMeasurementsSchema = Joi.object({
  chest_cm: Joi.number().min(0).optional(),
  waist_cm: Joi.number().min(0).optional(),
  hips_cm: Joi.number().min(0).optional(),
  left_arm_cm: Joi.number().min(0).optional(),
  right_arm_cm: Joi.number().min(0).optional(),
  measured_date: Joi.string().isoDate().required(),
});

// ─── PROFILE ─────────────────────────────────────────────────
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  age: Joi.number().integer().min(10).max(120).optional(),
  height_cm: Joi.number().min(50).max(300).optional(),
  current_weight_kg: Joi.number().min(10).max(500).optional(),
  target_weight_kg: Joi.number().min(10).max(500).optional(),
  activity_level: Joi.string()
    .valid('sedentary', 'lightly_active', 'moderately_active', 'very_active')
    .optional(),
  fitness_goal: Joi.string()
    .valid('weight_loss', 'muscle_gain', 'maintenance')
    .optional(),
});

// ─── MEAL PLAN ───────────────────────────────────────────────
const createMealPlanSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  meals: Joi.object({
    breakfast: Joi.string().uuid().optional(),
    lunch: Joi.string().uuid().optional(),
    dinner: Joi.string().uuid().optional(),
    snack: Joi.string().uuid().optional(),
  }).optional(),
});

// ─── ASSIGN ──────────────────────────────────────────────────
const assignWorkoutSchema = Joi.object({
  user_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  workout_id: Joi.string().uuid().required(),
});

const assignMealPlanSchema = Joi.object({
  meal_plan_id: Joi.string().uuid().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  createWorkoutSchema,
  createExerciseSchema,
  logWorkoutSchema,
  createMealSchema,
  logMealSchema,
  logWeightSchema,
  logMeasurementsSchema,
  updateProfileSchema,
  createMealPlanSchema,
  assignWorkoutSchema,
  assignMealPlanSchema,
  logCustomMealSchema: Joi.object({
    name: Joi.string().required(),
    meal_type: Joi.string().required(),
    calories: Joi.number().required(),
    protein: Joi.number().required(),
    carbs: Joi.number().required(),
    fats: Joi.number().required(),
    quantity_served: Joi.number().required(),
    image_url: Joi.string().allow('', null).optional(),
  }),
};
