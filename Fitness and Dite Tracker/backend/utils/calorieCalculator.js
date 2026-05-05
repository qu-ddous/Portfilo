/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Then apply activity multiplier + goal adjustment
 */
const calculateDailyCalories = ({ gender, age, height_cm, current_weight_kg, activity_level, fitness_goal }) => {
  if (!gender || !age || !height_cm || !current_weight_kg) return 2000;

  // BMR
  let bmr;
  if (gender === 'male') {
    bmr = 10 * current_weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * current_weight_kg + 6.25 * height_cm - 5 * age - 161;
  }

  // Activity multiplier
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const tdee = bmr * (multipliers[activity_level] || 1.55);

  // Goal adjustment
  let target = tdee;
  if (fitness_goal === 'weight_loss') target = tdee - 500;
  if (fitness_goal === 'muscle_gain') target = tdee + 300;

  return Math.round(target);
};

module.exports = { calculateDailyCalories };
