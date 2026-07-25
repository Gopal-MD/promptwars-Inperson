import React, { useState, useEffect } from 'react';
import { AlertOctagon, Phone, User, ShieldAlert, MessageSquare, Clipboard } from 'lucide-react';
import { getCaregiverContact } from '../utils/localStorage';

// Safety keywords to search for
const DANGER_KEYWORDS = [
  'suicide',
  'overdose',
  'kill myself',
  "can't breathe",
  'relapse badly',
  'panic attack',
  'relapse',
  'want to die'
];

export const checkSafetyDanger = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return DANGER_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export default function SafetyAlert({ triggerText, onDismiss }) {
  const [caregiver, setCaregiver] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCaregiver(getCaregiverContact());
  }, []);

  const emergencyMessage = caregiver 
    ? `Hi ${caregiver.name}, I am feeling very unsafe right now. Can you please call me or check on me immediately? I need your help.`
    : "I am having a crisis and need support. Please contact me immediately.";

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-red-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" role="alert" aria-modal="true" aria-labelledby="safety-title">
      <div className="w-full max-w-lg bg-dark-card border-2 border-red-500 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-left relative overflow-hidden">
        
        {/* Decorative caution background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl animate-pulse">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div>
            <h2 id="safety-title" className="text-2xl font-bold text-white tracking-tight leading-tight">
              Safety Intercept Activated
            </h2>
            <p className="text-sm text-red-400 font-semibold mt-1">
              Crisis keyword detected: "{triggerText}"
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Main Action Block */}
          <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl">
            <p className="text-sm text-slate-300 leading-relaxed">
              If you or someone you are with is in immediate danger of overdose, injury, or self-harm, please act right away. We do not provide medical diagnosis.
            </p>
          </div>

          {/* Hotline Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a 
              href="tel:911" 
              className="flex items-center justify-center gap-3 px-5 py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Call Emergency (911)
            </a>
            
            <a 
              href="tel:988" 
              className="flex items-center justify-center gap-3 px-5 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-white font-bold rounded-2xl transition-all"
            >
              <ShieldAlert className="h-5 w-5 text-red-400" />
              Call Crisis Line (988)
            </a>
          </div>

          {/* Caregiver Quick Contact Section */}
          {caregiver && (
            <div className="border border-dark-border bg-slate-900/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  Primary Caregiver Alert
                </span>
                {caregiver.phone && (
                  <a href={`tel:${caregiver.phone}`} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Call {caregiver.name}
                  </a>
                )}
              </div>
              <div className="text-sm font-semibold text-white mb-2">
                {caregiver.name} ({caregiver.relation})
              </div>
              
              <div className="relative mt-3">
                <div className="bg-dark-bg text-slate-400 border border-dark-border text-xs rounded-xl p-3.5 pr-10 font-mono italic break-words leading-relaxed select-all">
                  "{emergencyMessage}"
                </div>
                <button
                  onClick={handleCopyMessage}
                  className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                  title="Copy SMS text"
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <div className="text-[10px] text-emerald-400 mt-1.5 font-medium flex items-center gap-1 animate-fade-in">
                  ✓ Copied emergency message text
                </div>
              )}
            </div>
          )}

          {/* Dismiss Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onDismiss}
              className="px-5 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              Close Warning
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
