const express = require('express');
const supabase = require('../../config/supabase');
const { adminMiddleware } = require('../../middleware/auth');
const { createMealSchema, createMealPlanSchema, assignMealPlanSchema } = require('../../validators/schemas');
const axios = require('axios');

const router = express.Router();

// ─── POST /api/admin/meals/create ────────────────────────────
router.post('/create', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = createMealSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const { data: meal, error } = await supabase
      .from('meals')
      .insert({
        name: value.name,
        description: value.description,
        meal_type: value.meal_type,
        image_url: value.image_url,
        created_by: req.user.sub,
      })
      .select('id, name, meal_type')
      .single();

    if (error) throw error;

    // Insert nutrition
    if (value.nutrition) {
      await supabase.from('meal_nutrition').insert({ meal_id: meal.id, ...value.nutrition });
    }

    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'CREATE_MEAL',
      entity_type: 'meal', entity_id: meal.id,
    });

    return res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error('Create meal error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/meals ─────────────────────────────────────
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    let query = supabase
      .from('meals')
      .select('id, name, description, meal_type, image_url, status, created_at, meal_nutrition(calories, protein_grams, carbs_grams, fats_grams)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (req.query.meal_type) query = query.eq('meal_type', req.query.meal_type);

    const { data, error } = await query;
    if (error) throw error;
    return res.json({ success: true, meals: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/meals/:mealId ────────────────────────────
router.put('/:mealId', adminMiddleware, async (req, res) => {
  try {
    const { name, description, meal_type, image_url, nutrition, status } = req.body;
    
    // Update basic info
    await supabase
      .from('meals')
      .update({ 
        name, 
        description, 
        meal_type, 
        image_url, 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', req.params.mealId);

    // Update nutrition info
    if (nutrition) {
      await supabase
        .from('meal_nutrition')
        .update({ 
          calories: nutrition.calories,
          protein_grams: nutrition.protein_grams,
          carbs_grams: nutrition.carbs_grams,
          fats_grams: nutrition.fats_grams,
          fiber_grams: nutrition.fiber_grams || 0,
          serving_size_grams: nutrition.serving_size_grams || 100,
          servings: nutrition.servings || 1
        })
        .eq('meal_id', req.params.mealId);
    }

    return res.json({ success: true, message: 'Meal updated' });
  } catch (err) {
    console.error('Update meal error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/meals/:mealId ─────────────────────────
router.delete('/:mealId', adminMiddleware, async (req, res) => {
  try {
    await supabase.from('meals').update({ status: 'archived' }).eq('id', req.params.mealId);
    return res.json({ success: true, message: 'Meal archived' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/nutrition/search (USDA) ───────────────────
router.get('/nutrition/search', adminMiddleware, async (req, res) => {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) return res.status(400).json({ success: false, message: 'Search query required' });

    const apiKey = process.env.USDA_API_KEY;
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=${limit}&api_key=${apiKey}`;
    const response = await axios.get(url);

    const results = (response.data.foods || []).map(food => ({
      id: food.fdcId.toString(),
      name: food.description,
      nutrition: {
        calories: food.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0,
        protein: food.foodNutrients?.find(n => n.nutrientName === 'Protein')?.value || 0,
        carbs: food.foodNutrients?.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
        fats: food.foodNutrients?.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
      },
    }));

    return res.json({ success: true, results });
  } catch (err) {
    console.error('USDA search error:', err.message);
    return res.status(500).json({ success: false, message: 'USDA API error' });
  }
});

// ─── POST /api/admin/meals/import-from-api ───────────────────
router.post('/import', adminMiddleware, async (req, res) => {
  try {
    const { source = 'usda_api', external_api_id, meal_type, image_url } = req.body;
    if (!external_api_id || !meal_type) {
      return res.status(400).json({ success: false, message: 'external_api_id and meal_type required' });
    }

    const apiKey = process.env.USDA_API_KEY;
    const url = `https://api.nal.usda.gov/fdc/v1/food/${external_api_id}?api_key=${apiKey}`;
    const response = await axios.get(url);
    const food = response.data;

    const nutrients = food.foodNutrients || [];
    const get = (name) => nutrients.find(n => n.nutrient?.name === name)?.amount || 0;

    const { data: meal, error } = await supabase.from('meals').insert({
      name: food.description,
      meal_type,
      image_url,
      created_by: req.user.sub,
      source,
      external_api_id: external_api_id.toString(),
    }).select('id, name').single();

    if (error) throw error;

    await supabase.from('meal_nutrition').insert({
      meal_id: meal.id,
      calories: get('Energy'),
      protein_grams: get('Protein'),
      carbs_grams: get('Carbohydrate, by difference'),
      fats_grams: get('Total lipid (fat)'),
      fiber_grams: get('Fiber, total dietary'),
      serving_size_grams: food.servingSize || 100,
    });

    return res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error('Import meal error:', err.message);
    return res.status(500).json({ success: false, message: 'Import failed' });
  }
});

// ─── POST /api/admin/meal-plans/create ───────────────────────
router.post('/plans/create', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = createMealPlanSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const { data: plan, error } = await supabase.from('meal_plans').insert({
      name: value.name,
      description: value.description,
      created_by: req.user.sub,
    }).select('id, name').single();

    if (error) throw error;

    // Insert meal slots
    if (value.meals) {
      const items = Object.entries(value.meals)
        .filter(([, mealId]) => mealId)
        .map(([slot, meal_id], idx) => ({
          meal_plan_id: plan.id,
          meal_id,
          meal_slot: slot,
          sequence_order: idx + 1,
        }));
      if (items.length) await supabase.from('meal_plan_items').insert(items);
    }

    return res.status(201).json({ success: true, meal_plan: plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/meal-plans ───────────────────────────────
router.get('/plans', adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('id, name, description, status, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, meal_plans: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
