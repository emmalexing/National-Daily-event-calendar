export interface Editor {
  name: string;
  email: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  originalDate: string; // YYYY-MM-DD
  description: string;
  category: string;
  assignedEditor?: Editor;
  isManual?: boolean;
}

export interface DateDisplayInfo {
  nextOccurrence: Date;
  daysRemaining: number;
  yearsAnniversary: number;
  formattedDate: string;
}

export type UserRole = 'admin' | 'editor';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Added for authentication
}

export interface SystemNotification {
  id: string;
  message: string;
  timestamp: string; // ISO string
  type: 'info' | 'assignment';
  isRead: boolean;
}