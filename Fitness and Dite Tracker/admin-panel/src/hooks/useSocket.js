import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Agar authenticated nahi toh connect mat karo
    if (!isAuthenticated || !token) return;

    // Pehle se connected hai toh dobara connect mat karo
    if (socketRef.current?.connected) return;

    // Pehle wala disconnect karo agar tha
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('🔌 Admin connected to Socket.IO:', s.id);
    });

    s.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    s.on('connect_error', (err) => {
      console.warn('❌ Socket connection error:', err.message);
    });

    socketRef.current = s;
    setSocket(s);

    // Cleanup — component unmount pe disconnect karo
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token, isAuthenticated]);

  return socket;
};

export default useSocket;
