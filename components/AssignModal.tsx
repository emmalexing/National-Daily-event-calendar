import React, { useState, useEffect } from 'react';
import { Editor, HistoricalEvent } from '../types';
import { X, User, Mail, CheckCircle } from 'lucide-react';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (editor: Editor) => void;
  event: HistoricalEvent | null;
}

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, onConfirm, event }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen && event?.assignedEditor) {
      setName(event.assignedEditor.name);
      setEmail(event.assignedEditor.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onConfirm({ name, email });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Assign Story</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-xs text-green-800 font-semibold uppercase tracking-wide mb-1">Upcoming Event</p>
            <p className="text-green-900 font-serif font-medium">{event.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Editor Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-slate-900 text-sm"
                  placeholder="e.g. Chimamanda Adichie"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-slate-900 text-sm"
                  placeholder="editor@nationaldaily.com"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-naija-green hover:bg-naija-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naija-green transition-all"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;