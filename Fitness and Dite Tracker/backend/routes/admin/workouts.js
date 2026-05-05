const express = require('express');
const supabase = require('../../config/supabase');
const { adminMiddleware } = require('../../middleware/auth');
const { createWorkoutSchema, createExerciseSchema, assignWorkoutSchema } = require('../../validators/schemas');

const router = express.Router();

// ─── POST /api/admin/workouts/create ─────────────────────────
router.post('/create', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = createWorkoutSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const { data: workout, error } = await supabase
      .from('workouts')
      .insert({
        name: value.name,
        description: value.description,
        difficulty: value.difficulty || 'intermediate',
        duration_minutes: value.duration_minutes,
        image: value.image,
        created_by: req.user.sub,
      })
      .select('id, name, difficulty, duration_minutes, image')
      .single();

    if (error) throw error;

    // Insert exercises
    if (value.exercises?.length) {
      const exerciseDocs = value.exercises.map(ex => ({
        workout_id: workout.id,
        exercise_id: ex.exercise_id,
        recommended_sets: ex.recommended_sets,
        recommended_reps: ex.recommended_reps,
        recommended_weight_kg: ex.recommended_weight_kg,
        rest_seconds: ex.rest_seconds,
        sequence_order: ex.sequence_order,
      }));
      await supabase.from('workout_exercises').insert(exerciseDocs);
    }

    // Log admin action
    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'CREATE_WORKOUT',
      entity_type: 'workout', entity_id: workout.id,
    });

    return res.status(201).json({ success: true, workout });
  } catch (err) {
    console.error('Create workout error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/workouts ──────────────────────────────────
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || 'active';

    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, description, difficulty, duration_minutes, status, image, created_at, users(name)')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({ success: true, workouts: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/workouts/:workoutId ───────────────────────
router.put('/:workoutId', adminMiddleware, async (req, res) => {
  try {
    const { name, description, difficulty, duration_minutes, status, image } = req.body;
    await supabase
      .from('workouts')
      .update({ name, description, difficulty, duration_minutes, status, image, updated_at: new Date().toISOString() })
      .eq('id', req.params.workoutId);

    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'UPDATE_WORKOUT',
      entity_type: 'workout', entity_id: req.params.workoutId,
      changes: req.body,
    });

    return res.json({ success: true, message: 'Workout updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/workouts/:workoutId ────────────────────
router.delete('/:workoutId', adminMiddleware, async (req, res) => {
  try {
    await supabase.from('workouts').update({ status: 'archived' }).eq('id', req.params.workoutId);
    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'DELETE_WORKOUT',
      entity_type: 'workout', entity_id: req.params.workoutId,
    });
    return res.json({ success: true, message: 'Workout archived' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/workouts/assign ─────────────────────────
router.post('/assign', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = assignWorkoutSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const io = req.app.get('io');
    const { data: workout } = await supabase
      .from('workouts').select('name').eq('id', value.workout_id).single();

    const assignments = value.user_ids.map(uid => ({
      user_id: uid,
      workout_id: value.workout_id,
      assigned_by: req.user.sub,
    }));
    await supabase.from('workout_assignments').insert(assignments);

    // Notify each user + save notification
    for (const uid of value.user_ids) {
      await supabase.from('notifications').insert({
        user_id: uid,
        title: 'New Workout Assigned! 💪',
        message: `You have been assigned a new workout: ${workout?.name}`,
        type: 'workout_assigned',
      });

      if (io) {
        io.to(`user:${uid}`).emit('workout:assigned', {
          workout_id: value.workout_id,
          workout_name: workout?.name,
          assigned_date: new Date(),
        });
      }
    }

    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'ASSIGN_WORKOUT',
      entity_type: 'workout', entity_id: value.workout_id,
      changes: { user_count: value.user_ids.length },
    });

    return res.status(201).json({
      success: true,
      message: `Workout assigned to ${value.user_ids.length} user(s)`,
    });
  } catch (err) {
    console.error('Assign workout error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/exercises/create ────────────────────────
router.post('/exercises', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = createExerciseSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert({ 
        name: value.name,
        description: value.description,
        muscle_group: value.muscle_group,
        equipment_needed: value.equipment_needed,
        status: value.status || 'active',
        image: value.image,
        created_by: req.user.sub 
      })
      .select();

    if (error) {
      console.error('Supabase Exercise Insert Error:', error);
      throw error;
    }
    return res.status(201).json({ success: true, exercise: data[0] });
  } catch (err) {
    console.error('Create exercise route error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// ─── GET /api/admin/exercises ────────────────────────────────
router.get('/exercises', adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, description, muscle_group, equipment_needed, status, image')
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    return res.json({ success: true, exercises: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
