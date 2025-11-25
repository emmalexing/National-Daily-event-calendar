import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Send, AlertCircle, BrainCircuit, FileText } from 'lucide-react';
import { HistoricalEvent } from '../types';

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: HistoricalEvent | null;
  briefContent: string;
  strategyContent: string;
  isBriefLoading: boolean;
  isStrategyLoading: boolean;
  onGenerateStrategy: () => void;
  onSendEmail: (content: string) => void;
  isAdmin: boolean;
}

const BriefModal: React.FC<BriefModalProps> = ({ 
    isOpen, onClose, event, briefContent, strategyContent, 
    isBriefLoading, isStrategyLoading, onGenerateStrategy, onSendEmail, isAdmin 
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'strategy'>('brief');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopy = () => {
    const textToCopy = activeTab === 'brief' ? briefContent : strategyContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendClick = () => {
      const content = activeTab === 'brief' ? briefContent : strategyContent;
      onSendEmail(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center rounded-t-2xl shrink-0">
          <div className="flex items-center space-x-2 text-white">
            <Sparkles className="w-5 h-5 text-naija-green" />
            <h3 className="text-lg font-bold">AI Editorial Assistant</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Sub-header & Tabs */}
        <div className="bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="px-6 py-3 flex justify-between items-center">
                <div>
                    <h4 className="font-serif font-bold text-slate-800 text-lg">{event.title}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Original Date: {event.originalDate}</p>
                </div>
            </div>
            
            <div className="flex px-6 space-x-4">
                <button 
                    onClick={() => setActiveTab('brief')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'brief' ? 'border-naija-green text-naija-green' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Quick Brief</span>
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('strategy');
                        if (!strategyContent && !isStrategyLoading) {
                            onGenerateStrategy();
                        }
                    }}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'strategy' ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Strategic Deep Dive (Thinking Mode)</span>
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 leading-relaxed text-sm md:text-base min-h-[300px]">
          {activeTab === 'brief' ? (
              isBriefLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-naija-green"></div>
                  <p className="text-slate-400 animate-pulse text-sm">Generating context and historical insights...</p>
                </div>
              ) : (
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                   {briefContent}
                </div>
              )
          ) : (
              isStrategyLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="relative">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                     <BrainCircuit className="w-5 h-5 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-purple-600 animate-pulse text-sm font-medium">Thinking intensely (Gemini 2.0 Pro)...</p>
                  <p className="text-slate-400 text-xs">Analyzing cultural nuances and formulating strategy</p>
                </div>
              ) : (
                <div className="prose prose-sm prose-purple max-w-none whitespace-pre-wrap">
                   {strategyContent || "Click the tab to generate a strategic plan."}
                </div>
              )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 shrink-0">
          {isAdmin && !event.assignedEditor && !isBriefLoading && !isStrategyLoading && (
              <div className="flex items-center text-amber-600 text-xs mr-auto bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Assign an editor to send this via email.
              </div>
          )}

          <button
            onClick={handleCopy}
            disabled={isBriefLoading || isStrategyLoading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          {isAdmin && (
            <button
                onClick={handleSendClick}
                disabled={(activeTab === 'brief' ? isBriefLoading : isStrategyLoading) || !event.assignedEditor}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-naija-green text-white rounded-lg hover:bg-naija-dark transition-colors text-sm font-medium disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
            >
                <Send className="w-4 h-4" />
                <span>Send to Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefModal;