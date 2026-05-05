const express = require('express');
const { authMiddleware } = require('../../middleware/auth');
const { generateHealthInsights } = require('../../services/geminiService');
const supabase = require('../../config/supabase');
const router = express.Router();

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { message } = req.body;

    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    // Fetch user context for personalized advice
    const { data: user, error } = await supabase
      .from('users')
      .select('name, fitness_goal, current_weight_kg, activity_level')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const aiResponse = await generateHealthInsights(user, message);

    return res.json({ 
      success: true, 
      reply: aiResponse 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'AI Coach is busy' });
  }
});

module.exports = router;
