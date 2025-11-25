import React from 'react';
import { HistoricalEvent, DateDisplayInfo } from '../types';
import { X, Calendar, User, Mail } from 'lucide-react';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: HistoricalEvent | null;
  dateInfo: DateDisplayInfo | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event, dateInfo }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-slate-900 flex items-end p-6 overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-4 z-20">
                <button onClick={onClose} className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start">
                    <span className="inline-block px-2 py-1 bg-naija-green text-white text-xs font-bold uppercase tracking-wider rounded mb-2">
                        {event.category}
                    </span>
                    {dateInfo && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/10 text-white backdrop-blur-md`}>
                            {dateInfo.daysRemaining === 0 ? 'Today!' : `${dateInfo.daysRemaining} days away`}
                        </span>
                    )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                    {event.title}
                </h2>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="p-6 overflow-y-auto">
            <div className="flex items-center space-x-4 mb-6 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-naija-green" />
                    <div>
                        <p className="font-semibold text-slate-900">{dateInfo?.formattedDate}</p>
                        <p className="text-xs text-slate-400">Original Date: {event.originalDate}</p>
                    </div>
                 </div>
            </div>

            <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
                <h4 className="text-slate-900 font-bold mb-2 text-sm uppercase tracking-wide">Historical Description</h4>
                <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
            
            {event.assignedEditor && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned Editor</h4>
                     <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <User className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{event.assignedEditor.name}</p>
                            <div className="flex items-center text-xs text-slate-500">
                                <Mail className="w-3 h-3 mr-1" />
                                {event.assignedEditor.email}
                            </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;