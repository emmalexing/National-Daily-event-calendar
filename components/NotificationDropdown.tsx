import React from 'react';
import { SystemNotification } from '../types';
import { Bell, Check, Info, Calendar } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  notifications, 
  isOpen, 
  onClose,
  onMarkAllRead 
}) => {
  if (!isOpen) return null;

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute right-0 top-12 z-50 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Team Updates & Reminders</h3>
          {notifications.length > 0 && (
            <button 
              onClick={onMarkAllRead}
              className="text-xs text-naija-green hover:text-naija-dark font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">No new reminders</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {sortedNotifications.map((note) => (
                <div key={note.id} className="p-4 hover:bg-slate-50 transition-colors relative group">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
                      note.type === 'assignment' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {note.type === 'assignment' ? <Calendar className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 leading-snug">{note.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(note.timestamp).toLocaleString('en-NG', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;