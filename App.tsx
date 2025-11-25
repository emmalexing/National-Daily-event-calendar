import React, { useEffect, useState, useMemo } from 'react';
import { fetchHistoricalEvents, generateEditorialBrief, generateStrategicPlan, draftEditorEmail } from './services/geminiService';
import { HistoricalEvent, Editor, DateDisplayInfo, User, SystemNotification } from './types';
import EventCard from './components/EventCard';
import AssignModal from './components/AssignModal';
import AddEventModal from './components/AddEventModal';
import BriefModal from './components/BriefModal';
import EventDetailsModal from './components/EventDetailsModal';
import LoginModal from './components/LoginModal';
import NotificationDropdown from './components/NotificationDropdown';
import { Plus, Search, BookOpen, Loader2, LogOut, UserCircle, Bell } from 'lucide-react';

const DEFAULT_USERS: User[] = [
  {
    name: 'Sly Ehis',
    email: 'slyehis@gmail.com',
    role: 'admin',
    password: 'Excellence@734'
  },
  {
    name: 'Nta Elizabeth',
    email: 'ntaelizabeth7@gmail.com',
    role: 'admin',
    password: 'password123'
  },
  {
    name: 'Admin User',
    email: 'admin@nationaldaily.com',
    role: 'admin',
    password: 'password123'
  },
  {
    name: 'Editor User',
    email: 'editor@nationaldaily.com',
    role: 'editor',
    password: 'password123'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]); // Store all registered users
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState<DateDisplayInfo | null>(null);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // AI Brief & Strategy States
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [briefContent, setBriefContent] = useState('');
  const [strategyContent, setStrategyContent] = useState('');
  const [isBriefLoading, setIsBriefLoading] = useState(false);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  // Notification UI State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Initial Data Fetch & Persistence Loading
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Load Events
        const savedEvents = localStorage.getItem('nd_events_data');
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        } else {
          const geminiEvents = await fetchHistoricalEvents();
          setEvents(geminiEvents);
        }

        // Load Notifications
        const savedNotifications = localStorage.getItem('nd_notifications');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }

        // Load Registered Users
        const savedUsers = localStorage.getItem('nd_users');
        if (savedUsers) {
          setRegisteredUsers(JSON.parse(savedUsers));
        } else {
          // Initialize with default users if no data found so app is usable without signup
          setRegisteredUsers(DEFAULT_USERS);
        }
        
        // Check for active session (simple persistence)
        const sessionUser = localStorage.getItem('nd_active_session');
        if (sessionUser) {
           setUser(JSON.parse(sessionUser));
        }

      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('nd_events_data', JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nd_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (registeredUsers.length > 0) {
      localStorage.setItem('nd_users', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  // Logic to calculate next occurrence (rolling over to next year if passed)
  const calculateDateInfo = (originalDateStr: string): DateDisplayInfo => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const originalDate = new Date(originalDateStr);
    const currentYear = today.getFullYear();

    // Create date object for this year
    let nextOccurrence = new Date(currentYear, originalDate.getMonth(), originalDate.getDate());

    // If it has already passed this year, move to next year
    if (nextOccurrence < today) {
      nextOccurrence.setFullYear(currentYear + 1);
    }

    const diffTime = nextOccurrence.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate anniversary number
    const yearsAnniversary = nextOccurrence.getFullYear() - originalDate.getFullYear();

    const formatter = new Intl.DateTimeFormat('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      nextOccurrence,
      daysRemaining,
      yearsAnniversary,
      formattedDate: formatter.format(nextOccurrence)
    };
  };

  // Sort events by days remaining (soonest first)
  const sortedAndFilteredEvents = useMemo(() => {
    const processed = events.map(evt => ({
      ...evt,
      dateInfo: calculateDateInfo(evt.originalDate)
    }));

    // Sort by days remaining
    processed.sort((a, b) => a.dateInfo.daysRemaining - b.dateInfo.daysRemaining);

    // Filter
    return processed.filter(evt => 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      evt.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const handleAssignClick = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setIsAssignModalOpen(true);
  };

  const handleAssignConfirm = (editor: Editor) => {
    if (selectedEvent) {
      // 1. Update Event Assignment
      setEvents(prev => prev.map(e => 
        e.id === selectedEvent.id ? { ...e, assignedEditor: editor } : e
      ));

      // 2. Create Reminder Notification
      const newNotification: SystemNotification = {
        id: Date.now().toString(),
        message: `📅 Reminder: "${selectedEvent.title}" has been assigned to ${editor.name}. Preparation should start now.`,
        timestamp: new Date().toISOString(),
        type: 'assignment',
        isRead: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);

      setIsAssignModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleAddEvent = (newEventData: Omit<HistoricalEvent, 'id'>) => {
    const newEvent: HistoricalEvent = {
      ...newEventData,
      id: Date.now().toString(), // Simple ID generation
    };
    setEvents(prev => [...prev, newEvent]);
    
    // Add notification for new event
    const newNotification: SystemNotification = {
        id: `new-${Date.now()}`,
        message: `New Event Logged: "${newEvent.title}" has been added to the calendar.`,
        timestamp: new Date().toISOString(),
        type: 'info',
        isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleGenerateBrief = async (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setBriefContent('');
    setStrategyContent('');
    setIsBriefModalOpen(true);
    
    // Load Brief (Flash)
    setIsBriefLoading(true);
    const brief = await generateEditorialBrief(event.title, event.originalDate);
    setBriefContent(brief);
    setIsBriefLoading(false);
  };

  const handleGenerateStrategy = async () => {
    if (!selectedEvent) return;
    setIsStrategyLoading(true);
    const strategy = await generateStrategicPlan(selectedEvent.title, selectedEvent.description);
    setStrategyContent(strategy);
    setIsStrategyLoading(false);
  }

  const handleSendEmailFromModal = async (content: string) => {
      if (!selectedEvent?.assignedEditor) return;
      
      // Use AI to draft the email wrapper
      const { subject, body } = await draftEditorEmail(
          selectedEvent.assignedEditor.name, 
          selectedEvent.title, 
          "Here is the AI generated content for your assignment."
      );
      
      const fullBody = `${body}\n\n----------------------------------------\n\nAI CONTENT:\n${content}\n\n----------------------------------------`;
      const mailtoLink = `mailto:${selectedEvent.assignedEditor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
      window.location.href = mailtoLink;
  }

  const handleEmailEditor = async (event: HistoricalEvent) => {
      if (!event.assignedEditor) return;
      const { subject, body } = await draftEditorEmail(
          event.assignedEditor.name, 
          event.title, 
          "Just checking in on the assignment progress."
      );
      const mailtoLink = `mailto:${event.assignedEditor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
  }

  const handleViewDetails = (event: HistoricalEvent, dateInfo: DateDisplayInfo) => {
    setSelectedEvent(event);
    setSelectedDateInfo(dateInfo);
    setIsDetailsModalOpen(true);
  };

  // Auth Handlers
  const handleLoginAttempt = async (email: string, password: string): Promise<boolean> => {
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('nd_active_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const handleSignupAttempt = async (newUser: User): Promise<boolean> => {
    // Check if email already exists
    if (registeredUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return false;
    }

    // Add new user
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    
    // Auto login
    setUser(newUser);
    localStorage.setItem('nd_active_session', JSON.stringify(newUser));
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setIsNotificationOpen(false);
    localStorage.removeItem('nd_active_session');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 flex flex-col">
      {/* Login Modal - Always present if no user */}
      <LoginModal 
        isOpen={!user} 
        onLogin={handleLoginAttempt} 
        onSignup={handleSignupAttempt}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-naija-green text-white p-2 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-serif tracking-tight text-slate-900 hidden sm:block">
                National Daily <span className="text-naija-green">Event Calendar</span>
              </h1>
              <h1 className="text-lg font-bold font-serif tracking-tight text-slate-900 sm:hidden">
                ND <span className="text-naija-green">Event Calendar</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
                {user && (
                    <>
                      {/* Notification Bell */}
                      <div className="relative">
                        <button 
                          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                          className={`p-2 rounded-full transition-colors relative ${isNotificationOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          <Bell className="w-5 h-5" />
                          {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                          )}
                        </button>
                        
                        <NotificationDropdown 
                            isOpen={isNotificationOpen}
                            notifications={notifications}
                            onClose={() => setIsNotificationOpen(false)}
                            onMarkAllRead={handleClearNotifications}
                        />
                      </div>

                      {/* User Badge */}
                      <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hidden md:flex">
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider text-slate-500">{user.role}</span>
                      </div>
                    </>
                )}

                {isAdmin && (
                    <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-naija-green hover:bg-naija-dark shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naija-green"
                    >
                    <Plus className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Log Event</span>
                    <span className="sm:hidden">Add</span>
                    </button>
                )}

                {user && (
                    <button 
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-600 transition-colors p-2"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Controls */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
             <div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Editorial Schedule</h2>
               <p className="text-slate-500 max-w-2xl">
                 Track upcoming historical anniversaries. 
                 {isAdmin 
                    ? " Assign stories to editors and manage the event log." 
                    : " Use the AI tool to generate research briefs."}
               </p>
             </div>

             <div className="relative w-full md:w-72">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-slate-400" />
               </div>
               <input
                 type="text"
                 className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-naija-green focus:border-naija-green sm:text-sm transition-colors"
                 placeholder="Search events..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mb-2 text-naija-green" />
             <p>Consulting the archives...</p>
          </div>
        ) : sortedAndFilteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">No events found matching your search.</p>
            <button 
                onClick={() => setSearchTerm('')} 
                className="text-naija-green font-medium hover:underline"
            >
                Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredEvents.map((item) => (
              <EventCard
                key={item.id}
                event={item}
                dateInfo={item.dateInfo}
                onAssign={handleAssignClick}
                onGenerateBrief={handleGenerateBrief}
                onViewDetails={handleViewDetails}
                onEmailEditor={handleEmailEditor}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium">
          <p>Powered by <span className="text-white">Emmalexing</span></p>
        </div>
      </footer>

      {/* Modals */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => { setIsAssignModalOpen(false); setSelectedEvent(null); }}
        onConfirm={handleAssignConfirm}
        event={selectedEvent}
      />
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEvent}
      />
      <BriefModal 
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        event={selectedEvent}
        briefContent={briefContent}
        strategyContent={strategyContent}
        isBriefLoading={isBriefLoading}
        isStrategyLoading={isStrategyLoading}
        onGenerateStrategy={handleGenerateStrategy}
        onSendEmail={handleSendEmailFromModal}
        isAdmin={isAdmin}
      />
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
        dateInfo={selectedDateInfo}
      />
    </div>
  );
};

export default App;