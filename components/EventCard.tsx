import React, { useState } from 'react';
import { HistoricalEvent, DateDisplayInfo } from '../types';
import { Calendar, User, Mail, ChevronRight, Sparkles, Loader2 } from 'lucide-react';

interface EventCardProps {
  event: HistoricalEvent;
  dateInfo: DateDisplayInfo;
  onAssign: (event: HistoricalEvent) => void;
  onGenerateBrief: (event: HistoricalEvent) => void;
  onViewDetails: (event: HistoricalEvent, dateInfo: DateDisplayInfo) => void;
  onEmailEditor: (event: HistoricalEvent) => void;
  isAdmin: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
    event, dateInfo, onAssign, onGenerateBrief, onViewDetails, onEmailEditor, isAdmin 
}) => {
  const isAssigned = !!event.assignedEditor;
  const isGenericYear = event.originalDate.startsWith('1900');
  const [isEmailing, setIsEmailing] = useState(false);

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEmailing(true);
    await onEmailEditor(event);
    setIsEmailing(false);
  };

  return (
    <div 
        onClick={() => onViewDetails(event, dateInfo)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group cursor-pointer"
    >
      <div className={`h-2 w-full ${isAssigned ? 'bg-naija-green' : 'bg-amber-400'}`} />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {event.category}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${dateInfo.daysRemaining < 30 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
            {dateInfo.daysRemaining === 0 ? 'Today!' : `In ${dateInfo.daysRemaining} days`}
          </span>
        </div>

        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 leading-tight group-hover:text-naija-green transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
          {event.description}
        </p>

        <div className="flex items-center text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg">
          <Calendar className="w-4 h-4 mr-2 text-naija-green" />
          <div className="flex flex-col">
            <span className="font-semibold">{dateInfo.formattedDate}</span>
            {!isGenericYear ? (
                <span className="text-xs text-slate-400">{dateInfo.yearsAnniversary}th Anniversary (Orig: {event.originalDate})</span>
            ) : (
                <span className="text-xs text-slate-400">Annual Event</span>
            )}
          </div>
        </div>

        <div 
            className="mt-auto pt-4 border-t border-slate-100 space-y-3"
            onClick={(e) => e.stopPropagation()}
        >
            {/* AI Action */}
            <button 
                onClick={() => onGenerateBrief(event)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-slate-200 hover:border-naija-green hover:text-naija-green text-slate-600 text-xs font-medium rounded-lg transition-colors duration-200"
            >
                <Sparkles className="w-3 h-3" />
                <span>AI Editorial Intelligence</span>
            </button>

            {/* Assignment Action */}
            {isAssigned ? (
                <div className="flex items-center justify-between space-x-3 bg-green-50/50 p-2 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-2 overflow-hidden flex-1">
                        <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                            <User className="w-3.5 h-3.5 text-green-700" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Assigned To</p>
                            <p className="text-sm font-medium text-slate-800 truncate leading-tight">{event.assignedEditor?.name}</p>
                        </div>
                    </div>
                    {isAdmin && (
                         <div className="flex space-x-1 shrink-0">
                             <button
                                onClick={handleEmailClick}
                                disabled={isEmailing}
                                className="p-1.5 text-slate-400 hover:text-naija-green hover:bg-white rounded-full transition-colors"
                                title="Send Email"
                             >
                                {isEmailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                             </button>
                         </div>
                    )}
                </div>
            ) : (
                isAdmin && (
                    <button
                        onClick={() => onAssign(event)}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-naija-green text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        <span>Assign to Editor</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;