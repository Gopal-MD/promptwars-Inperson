import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clipboard, User, Heart, MessageSquare, Send, Check } from 'lucide-react';
import { getCaregiverContact } from '../utils/localStorage';
import { generateEmergencyScript, hasApiKey } from '../services/groq';

export default function EmergencyScript() {
  const [caregiver, setCaregiver] = useState({ name: 'Dad', relation: 'Father', phone: '555-0199' });
  const [feeling, setFeeling] = useState('experiencing heavy cravings');
  const [supportNeeded, setSupportNeeded] = useState('call me or come sit with me');
  
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCaregiver(getCaregiverContact());
  }, []);

  // Standard template fallback
  const getTemplateScript = () => {
    return `Hi ${caregiver.name},\n\nI'm struggling right now and I am ${feeling}.\n\nPlease support me. Can you ${supportNeeded}?\n\nI don't want to relapse. I appreciate you.`;
  };

  // Set the default script on load
  useEffect(() => {
    setScript(getTemplateScript());
  }, [caregiver, feeling, supportNeeded]);

  const handleGenerateScript = async () => {
    if (!hasApiKey()) {
      // Graceful fallback to client-side templates if API key is missing
      const localScript = getTemplateScript();
      setScript(localScript);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generated = await generateEmergencyScript(
        caregiver.name,
        caregiver.relation,
        feeling,
        supportNeeded
      );
      setScript(generated);
    } catch (err) {
      console.warn("Groq script generation failed, falling back to local template", err);
      setScript(getTemplateScript());
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const feelingOptions = [
    'experiencing heavy cravings',
    'overwhelmed and anxious',
    'feeling triggered by my surroundings',
    'struggling to stay clean',
    'feeling lonely and having relapse thoughts'
  ];

  const supportOptions = [
    'call me or come sit with me',
    'distract me with a conversation',
    'remind me why I started recovery',
    'take me out for a walk',
    'help me practice my breathing exercises'
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Title section */}
      <section className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs text-rose-400 font-semibold">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          Urgent Communication Tool
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">Emergency Script Generator</h2>
        <p className="text-sm text-slate-400">
          When cravings or anxiety spike, describing your struggle can be hard. Customize this script to generate a clear message for your caregiver.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Customization Form */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-400" />
              Customize Message
            </h3>

            {/* Caregiver Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Caregiver's Name</label>
              <input
                type="text"
                value={caregiver.name}
                onChange={(e) => setCaregiver({ ...caregiver, name: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="Caregiver Name"
              />
            </div>

            {/* Current Struggle Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">How are you struggling?</label>
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                {feelingOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Support Needed Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">What do you need them to do?</label>
              <select
                value={supportNeeded}
                onChange={(e) => setSupportNeeded(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                {supportOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              Generate Personalized Script
            </button>
          </div>
        </section>

        {/* Right Side: Generated Script Preview */}
        <section className="lg:col-span-3 flex flex-col justify-stretch">
          <div className="bg-slate-900/40 border border-dark-border rounded-3xl p-6 flex flex-col justify-between flex-1 relative overflow-hidden min-h-[300px]">
            
            {/* Phone Message Box Header */}
            <div>
              <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-4">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  SMS Message Draft
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">To: {caregiver.name} ({caregiver.phone || caregiver.relation})</span>
              </div>

              {/* Text bubble */}
              <div className="bg-slate-950/80 border border-dark-border text-slate-200 text-sm rounded-2xl p-4 font-mono whitespace-pre-line leading-relaxed italic max-h-[350px] overflow-y-auto select-all">
                {script}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Double tap the text box to select all, or click Copy.
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-dark-border text-white text-sm font-semibold rounded-2xl transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-emerald-400" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4.5 w-4.5" />
                    Copy Script
                  </>
                )}
              </button>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );
}
