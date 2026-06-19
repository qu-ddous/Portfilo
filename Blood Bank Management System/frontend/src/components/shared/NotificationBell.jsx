import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, X, Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const getNotificationIcon = (message = '') => {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('approved') || lowerMsg.includes('fulfilled') || lowerMsg.includes('clear'))
    return <CheckCircle className="w-4 h-4 text-[#27AE60]" />;
  if (lowerMsg.includes('rejected') || lowerMsg.includes('critical') || lowerMsg.includes('expired'))
    return <AlertCircle className="w-4 h-4 text-[#E74C3C]" />;
  if (lowerMsg.includes('low') || lowerMsg.includes('warning') || lowerMsg.includes('pending'))
    return <AlertTriangle className="w-4 h-4 text-[#F39C12]" />;
  return <Info className="w-4 h-4 text-[#2980B9]" />;
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recent = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        id="notification-bell-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 bg-gray-50 rounded-xl text-[#7F8C8D] hover:text-[#C0392B] transition-colors border-2 border-gray-100 shadow-[0_2px_0_#E5E7EB]"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E74C3C] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white px-0.5"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#C0392B] to-[#E74C3C]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-white" />
                <span className="text-sm font-black text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    All read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border-2 border-gray-100">
                    <Bell className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-[#2C3E50]">No notifications</p>
                  <p className="text-xs text-[#7F8C8D] mt-1">You're all caught up!</p>
                </div>
              ) : (
                recent.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors group',
                      !notif.is_read
                        ? 'bg-red-50/60 hover:bg-red-50'
                        : 'hover:bg-gray-50'
                    )}
                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                      !notif.is_read ? 'bg-white shadow-sm border border-red-100' : 'bg-gray-50'
                    )}>
                      {getNotificationIcon(notif.message)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs leading-relaxed',
                        !notif.is_read ? 'font-semibold text-[#2C3E50]' : 'font-medium text-[#7F8C8D]'
                      )}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-[#7F8C8D] mt-0.5">
                        {formatRelativeTime(notif.created_at)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-[#E74C3C] rounded-full shrink-0 mt-2 animate-pulse" />
                    )}

                    {/* Hover: mark as read icon */}
                    {!notif.is_read && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-3.5 h-3.5 text-[#C0392B]" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <p className="text-xs text-[#7F8C8D]">
                  Showing 10 of {notifications.length} notifications
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
