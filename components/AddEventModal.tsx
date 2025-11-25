import React, { useState } from 'react';
import { HistoricalEvent } from '../types';
import { X, PlusCircle, Calendar } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<HistoricalEvent, 'id'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      originalDate: date,
      description,
      category,
      isManual: true
    });
    // Reset form
    setTitle('');
    setDate('');
    setDescription('');
    setCategory('General');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-naija-light p-1.5 rounded-md">
                <PlusCircle className="w-5 h-5 text-naija-green" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Log Historical Event</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-sm"
                placeholder="e.g. First Republic Inauguration"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Original Date</label>
                <div className="relative">
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-sm"
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-sm bg-white"
                >
                    <option>Politics</option>
                    <option>Military</option>
                    <option>Culture</option>
                    <option>Sports</option>
                    <option>Economy</option>
                    <option>General</option>
                </select>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green transition-colors text-sm"
                placeholder="Provide context for the editors..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Add Event to Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;