const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

/**
 * GET /api/chat/messages/:otherUserId
 * Get chat history with a specific user
 */
router.get('/messages/:otherUserId', authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const { otherUserId } = req.params;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    // Filter manually for clarity because .or can be tricky with composite conditions
    const filteredMessages = data.filter(m => 
      (m.sender_id === userId && m.receiver_id === otherUserId) || 
      (m.sender_id === otherUserId && m.receiver_id === userId)
    );

    // Mark messages as read
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId);

    return res.json({ success: true, messages: filteredMessages });
  } catch (err) {
    console.error('Fetch chat error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

/**
 * GET /api/chat/conversations
 * Get list of people user has talked to (primarily for admin)
 */
router.get('/conversations', authMiddleware, async (req, res) => {
  const userId = req.user.sub;

  try {
    // Get all messages involving the user
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey(id, name, email, avatar),
        receiver:users!chat_messages_receiver_id_fkey(id, name, email, avatar)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const conversations = [];
    const seenIds = new Set();

    messages.forEach(msg => {
      const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
      if (otherUser && !seenIds.has(otherUser.id)) {
        seenIds.add(otherUser.id);
        conversations.push({
          user: otherUser,
          lastMessage: msg.message,
          lastMessageDate: msg.created_at,
          unreadCount: (msg.receiver_id === userId && !msg.is_read) ? 1 : 0 // Simplified
        });
      }
    });

    return res.json({ success: true, conversations });
  } catch (err) {
    console.error('Fetch conversations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
});

/**
 * POST /api/chat/send
 * Send a message
 */
router.post('/send', authMiddleware, async (req, res) => {
  const sender_id = req.user.sub;
  const { receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).json({ success: false, message: 'Recipient and message required' });
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ sender_id, receiver_id, message }])
      .select('*')
      .single();

    if (error) throw error;

    const io = req.app.get('io');
    
    // Notify receiver
    io.to(`user:${receiver_id}`).emit('new_chat_message', data);
    
    // Also notify sender for sync
    io.to(`user:${sender_id}`).emit('message_sent', data);

    return res.json({ success: true, message: data });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

/**
 * DELETE /api/chat/message/:id
 * Delete a specific message
 */
router.delete('/message/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', req.params.id)
      .eq('sender_id', req.user.sub); // Only sender can delete for now or admin

    if (error) throw error;
    return res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/chat/clear/:otherUserId
 * Clear all messages between two users
 */
router.delete('/clear/:otherUserId', authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const { otherUserId } = req.params;

  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`);

    if (error) throw error;
    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
