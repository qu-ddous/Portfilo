const supabase = require('../config/supabase');
const { calculateDailyCalories } = require('../utils/calorieCalculator');

/**
 * Recalculates and updates a user's daily calorie target
 * based on their latest physical data.
 * @param {string} userId 
 */
const syncUserCalories = async (userId) => {
  try {
    // 1. Get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) return;

    // 2. Calculate new target
    const newTarget = calculateDailyCalories({
      gender: user.gender,
      age: user.age,
      weight: user.current_weight_kg,
      height: user.height_cm,
      activityLevel: user.activity_level,
      goal: user.fitness_goal
    });

    // 3. Update user
    await supabase
      .from('users')
      .update({ 
        daily_calorie_target: newTarget,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log(`🎯 Synced calories for ${user.name}: ${newTarget} kcal`);
    return newTarget;
  } catch (err) {
    console.error('Error syncing user calories:', err.message);
  }
};

module.exports = { syncUserCalories };
