import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  User, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Check,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Activity,
  Trash2,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import GlassCard from '../components/GlassCard';
import io from 'socket.io-client';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef();
  const socketRef = useRef();
  const { user: adminUser } = useAuthStore();

  const activeUserRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    // Initialize Socket — only once
    const token = localStorage.getItem('token');
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001', {
      auth: { token }
    });

    socketRef.current.on('new_chat_message', (msg) => {
      // Use ref to avoid stale closure
      const currentUser = activeUserRef.current;
      if (currentUser && (msg.sender_id === currentUser.id || msg.receiver_id === currentUser.id)) {
        setMessages(prev => [...prev, msg]);
      }
      fetchConversations();
    });

    // Polling fallback: refresh messages every 3 seconds
    pollRef.current = setInterval(() => {
      if (activeUserRef.current) {
        fetchMessages(activeUserRef.current.id);
      }
      fetchConversations();
    }, 3000);

    return () => {
      socketRef.current?.disconnect();
      clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    activeUserRef.current = activeUser;
    if (activeUser) {
      fetchMessages(activeUser.id);
    }
  }, [activeUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/chat/messages/${userId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const res = await api.post('/chat/send', {
        receiver_id: activeUser.id,
        message: newMessage
      });
      setMessages(prev => [...prev, res.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.delete(`/chat/message/${msgId}`);
      setMessages(messages.filter(m => m.id !== msgId));
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const handleClearChat = async () => {
    if (!activeUser) return;
    if (!window.confirm(`Wipe all intelligence logs with ${activeUser.name}? This cannot be undone.`)) return;
    
    try {
      await api.delete(`/chat/clear/${activeUser.id}`);
      setMessages([]);
      fetchConversations();
      setShowMenu(false);
    } catch (err) {
      alert('Failed to clear chat history');
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in">
      {/* ── Sidebar: Conversations ── */}
      <div className="w-80 flex flex-col gap-6 h-full">
         <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[30px] shadow-xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
            <div className="relative z-10">
               <h2 className="text-xl font-black text-white flex items-center gap-2">
                 <MessageSquare className="animate-sway" size={20} /> Intel Comms
               </h2>
               <p className="text-indigo-100/60 text-[9px] font-black uppercase tracking-widest mt-1">Encrypted Dispatch Channel</p>
            </div>
         </div>

         <GlassCard className="flex-1 rounded-[35px] flex flex-col overflow-hidden border-white/50">
            <div className="p-5 border-b border-slate-100">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search agents..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs font-bold outline-none focus:border-indigo-400 focus:bg-white transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {loading ? (
                 <div className="flex justify-center p-10"><Activity className="animate-spin text-indigo-500" /></div>
               ) : filteredConversations.length === 0 ? (
                 <div className="text-center p-10">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active Comms</p>
                 </div>
               ) : (
                 filteredConversations.map((conv) => (
                   <button
                     key={conv.user.id}
                     onClick={() => setActiveUser(conv.user)}
                     className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeUser?.id === conv.user.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-50 text-slate-600'}`}
                   >
                     <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${activeUser?.id === conv.user.id ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                          {conv.user.avatar ? (
                            <img src={conv.user.avatar} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            conv.user.name.charAt(0)
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                     </div>
                     <div className="flex-1 text-left">
                        <h4 className={`text-sm font-black truncate ${activeUser?.id === conv.user.id ? 'text-white' : 'text-slate-800'}`}>{conv.user.name}</h4>
                        <p className={`text-[10px] font-bold truncate mt-0.5 ${activeUser?.id === conv.user.id ? 'text-indigo-100' : 'text-slate-400'}`}>{conv.lastMessage}</p>
                     </div>
                     {conv.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                          {conv.unreadCount}
                        </div>
                     )}
                   </button>
                 ))
               )}
            </div>
         </GlassCard>
      </div>

      {/* ── Main: Chat Window ── */}
      <div className="flex-1 h-full flex flex-col">
         {activeUser ? (
           <>
             {/* Chat Header */}
             <GlassCard className="p-4 rounded-[30px] mb-6 flex items-center justify-between border-white/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-inner border border-white">
                      {activeUser.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-black text-slate-800 flex items-center gap-2">
                        {activeUser.name} <CheckCircle2 size={14} className="text-blue-500" />
                      </h3>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Synchronized
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-2 relative">
                   <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all"><Phone size={18} /></button>
                   <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all"><Video size={18} /></button>
                   <div className="relative">
                      <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showMenu ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-400'}`}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {showMenu && (
                        <div className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                           <button 
                             onClick={handleClearChat}
                             className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-widest"
                           >
                             <Trash2 size={16} /> Wipe Intelligence Logs
                           </button>
                           <button 
                             className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-widest"
                           >
                             <AlertCircle size={16} /> Export Briefing
                           </button>
                        </div>
                      )}
                   </div>
                </div>
             </GlassCard>

             {/* Messages Area */}
             <GlassCard className="flex-1 rounded-[40px] mb-6 p-8 overflow-y-auto custom-scrollbar border-white/50 bg-slate-50/30">
                <div className="space-y-6">
                   {messages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.sender_id === adminUser?.sub ? 'justify-end' : 'justify-start'} group/msg`}>
                        <div className={`max-w-[70%] p-4 rounded-3xl shadow-sm relative group transition-all hover:shadow-md ${msg.sender_id === adminUser?.sub ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                           {/* Small delete icon on hover */}
                           <button 
                             onClick={() => handleDeleteMessage(msg.id)}
                             className={`absolute -top-2 ${msg.sender_id === adminUser?.sub ? '-left-8' : '-right-8'} p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover/msg:opacity-100 transition-all`}
                           >
                             <Trash2 size={14} />
                           </button>
                           
                           <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                           <div className={`flex items-center gap-1 mt-2 text-[8px] font-bold uppercase tracking-widest ${msg.sender_id === adminUser?.sub ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {msg.sender_id === adminUser?.sub && <Check size={10} className={msg.is_read ? 'text-blue-300' : 'text-white/40'} />}
                           </div>
                        </div>
                     </div>
                   ))}
                   <div ref={scrollRef} />
                </div>
             </GlassCard>

             {/* Input Area */}
             <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                <GlassCard className="flex-1 p-2 rounded-full border-white/50 shadow-2xl flex items-center pr-3">
                   <input 
                     type="text" 
                     placeholder="Type a secure message..." 
                     className="flex-1 bg-transparent border-none outline-none px-6 text-sm font-bold text-slate-700 placeholder-slate-400"
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <button 
                     type="submit"
                     className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all active:scale-90"
                   >
                     <Send size={18} />
                   </button>
                </GlassCard>
             </form>
           </>
         ) : (
           <GlassCard className="flex-1 rounded-[40px] border-white/50 flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-indigo-50 rounded-[35px] flex items-center justify-center text-indigo-500 mb-8 border border-indigo-100 shadow-inner animate-float">
                 <Sparkles size={48} className="animate-hue" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">Communication Secure</h2>
              <p className="text-slate-400 text-sm font-bold max-w-sm">Select an athlete from the side registry to start a real-time synchronized briefing.</p>
           </GlassCard>
         )}
      </div>
    </div>
  );
};

export default Chat;
