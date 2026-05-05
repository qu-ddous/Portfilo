const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const { logWorkoutSchema } = require('../../validators/schemas');

const router = express.Router();

// ─── GET /api/user/workouts/assigned ──────────────────────────
router.get('/assigned', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workout_assignments')
      .select(`
        id, assigned_date, status,
        workouts (
          id, name, description, difficulty, duration_minutes,
          workout_exercises (
            recommended_sets, recommended_reps, recommended_weight_kg, rest_seconds, sequence_order,
            exercises ( id, name, muscle_group, equipment_needed )
          )
        )
      `)
      .eq('user_id', req.user.sub)
      .eq('status', 'active')
      .order('assigned_date', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, workouts: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/workouts/history ───────────────────────────
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const { data, error } = await supabase
      .from('user_workouts')
      .select('id, completed_date, duration_minutes, notes, workouts(name)')
      .eq('user_id', req.user.sub)
      .order('completed_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({
      success: true,
      workouts: (data || []).map(w => ({
        id: w.id,
        workout_name: w.workouts?.name,
        completed_date: w.completed_date,
        duration_minutes: w.duration_minutes,
        notes: w.notes,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/workouts/available ────────────────────────
router.get('/available', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, description, difficulty, duration_minutes, image')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Auto-seed if empty
    if (!data || data.length === 0) {
      const mockWorkouts = [
        { name: 'Full Body Shred', description: 'Complete full body workout for losing fat and gaining muscle.', difficulty: 'intermediate', duration_minutes: 45, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', status: 'active' },
        { name: 'Upper Body Power', description: 'Build serious upper body strength with this intense routine.', difficulty: 'advanced', duration_minutes: 60, image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?w=800', status: 'active' },
        { name: 'Yoga Mobility', description: 'Improve your flexibility and core stability with this yoga session.', difficulty: 'beginner', duration_minutes: 30, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', status: 'active' },
        { name: 'HIIT Cardio Blast', description: 'High intensity interval training to boost your cardiovascular health.', difficulty: 'advanced', duration_minutes: 25, image: 'https://images.unsplash.com/photo-1549576490-b0b4831da60a?w=800', status: 'active' }
      ];
      await supabase.from('workouts').insert(mockWorkouts);

      return res.json({ success: true, workouts: mockWorkouts });
    }

    return res.json({ success: true, workouts: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/workouts/:workoutId ────────────────────────
router.get('/:workoutId', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id, name, description, difficulty, duration_minutes,
        workout_exercises (
          id, recommended_sets, recommended_reps, recommended_weight_kg, rest_seconds, sequence_order,
          exercises ( id, name, description, muscle_group, equipment_needed )
        )
      `)
      .eq('id', req.params.workoutId)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Workout not found' });
    return res.json({ success: true, workout: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/workouts/log ──────────────────────────────
router.post('/log', authMiddleware, async (req, res) => {
  const { error: valErr, value } = logWorkoutSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const userId = req.user.sub;
    const io = req.app.get('io');

    // Insert workout log
    const { data: workoutLog, error: logErr } = await supabase
      .from('user_workouts')
      .insert({
        user_id: userId,
        workout_id: value.workout_id,
        duration_minutes: value.duration_minutes,
        notes: value.notes,
        completed_date: new Date().toISOString(),
      })
      .select('id, completed_date, duration_minutes')
      .single();

    if (logErr) throw logErr;

    // Insert exercise logs
    if (value.exercises?.length) {
      const exerciseLogs = value.exercises.map(ex => ({
        user_workout_id: workoutLog.id,
        exercise_id: ex.exercise_id,
        sets_completed: ex.sets_completed,
        reps_per_set: ex.reps_per_set,
        weight_kg: ex.weight_kg,
        duration_seconds: ex.duration_seconds,
      }));
      await supabase.from('user_exercise_logs').insert(exerciseLogs);
    }

    // Fetch workout name for socket
    const { data: workout } = await supabase
      .from('workouts').select('name').eq('id', value.workout_id).single();

    // Fetch user name for socket
    const { data: user } = await supabase
      .from('users').select('name').eq('id', userId).single();

    // Real-time: notify user + admin
    if (io) {
      io.to(`user:${userId}`).emit('notification:alert', {
        title: 'Workout Logged! 💪',
        message: `Great job! You completed ${value.duration_minutes} minutes of workout.`,
        type: 'success',
      });
      io.to('admin-room').emit('admin:workout-logged', {
        user_id: userId,
        user_name: user?.name,
        workout_name: workout?.name,
        duration: value.duration_minutes,
        timestamp: new Date(),
      });
    }

    return res.status(201).json({ success: true, workout_log: workoutLog });
  } catch (err) {
    console.error('Log workout error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/workouts/:workoutId/quick-log ─────────────
router.post('/:workoutId/quick-log', authMiddleware, async (req, res) => {
  try {
    const { duration_minutes = 60 } = req.body;
    await supabase.from('user_workouts').insert({
      user_id: req.user.sub,
      workout_id: req.params.workoutId,
      duration_minutes,
      completed_date: new Date().toISOString(),
    });
    return res.status(201).json({ success: true, message: 'Workout logged quickly' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/user/workouts/log/:logId ────────────────────────
router.put('/log/:logId', authMiddleware, async (req, res) => {
  try {
    const { duration_minutes, notes } = req.body;
    await supabase
      .from('user_workouts')
      .update({ duration_minutes, notes })
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);

    return res.json({ success: true, message: 'Workout log updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/user/workouts/log/:logId ─────────────────────
router.delete('/log/:logId', authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('user_workouts')
      .delete()
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);

    return res.json({ success: true, message: 'Workout log deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/personal-records ──────────────────────────
router.get('/personal-records', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_exercise_logs')
      .select('weight_kg, reps_per_set, created_at, exercises(name), user_workouts!inner(user_id)')
      .eq('user_workouts.user_id', req.user.sub)
      .order('weight_kg', { ascending: false });

    if (error) throw error;

    // Group by exercise and pick max weight
    const records = {};
    (data || []).forEach(log => {
      const name = log.exercises?.name;
      if (!records[name] || log.weight_kg > records[name].max_weight_kg) {
        records[name] = {
          exercise: name,
          max_weight_kg: log.weight_kg,
          reps: log.reps_per_set?.[0],
          date: log.created_at,
        };
      }
    });

    return res.json({ success: true, records: Object.values(records) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
