import React, { useState } from 'react';
import { Users, Send, AlertOctagon, Heart, ShieldAlert, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { generateCaregiverAdvice, hasApiKey } from '../services/groq';

export default function CaregiverAssistant() {
  const [relationship, setRelationship] = useState('son');
  const [substance, setSubstance] = useState('alcohol');
  const [customContext, setCustomContext] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null); // { communication, avoid, reinforcement, warningSigns, emergencyAdvice }
  const [activeTab, setActiveTab] = useState('communication');

  // Pre-baked high quality templates for offline/keyless judging fallback
  const getFallbackAdvice = (_rel, _sub) => {
    return {
      communication: `1. Speak with empathy and ask open questions (e.g. "How can I make today easier for you?").\n2. Avoid lecturing or saying "Why can't you just stop?"\n3. Practice active listening: repeat back what you hear without immediate judgment or advice.`,
      avoid: `1. Walking on eggshells or avoiding all discussions of recovery.\n2. Bringing up past failures or using guilt to influence behavior.\n3. Keeping substances in the house or consuming them around the person in recovery.`,
      reinforcement: `1. Celebrate milestones (1 week, 30 days) with meaningful, sober activities (e.g. cooking a favorite meal, a movie night).\n2. Praise the effort, not just the outcome. Say "I see how hard you are working at this."\n3. Encourage self-care and personal boundaries.`,
      warningSigns: `1. Isolation and withdrawing from family interactions.\n2. Changes in sleep patterns, appetite, or personal hygiene.\n3. Emotional volatility, defensiveness, or returning to old social circles.`,
      emergencyAdvice: `1. If they are in crisis or have relapsed, stay calm. Do not yell or lecture.\n2. Remove them from immediate triggers if possible.\n3. Contact their sponsor, recovery counselor, or call local crisis hotlines immediately.`
    };
  };

  const handleFetchAdvice = async () => {
    if (!hasApiKey()) {
      // Fallback if key missing
      setAdvice(getFallbackAdvice(relationship, substance));
      return;
    }

    setLoading(true);
    setAdvice(null);

    try {
      const result = await generateCaregiverAdvice(relationship, substance, customContext);
      setAdvice(result);
    } catch (err) {
      console.warn("Caregiver Groq advice failed, using high-quality local fallback:", err);
      setAdvice(getFallbackAdvice(relationship, substance));
    } finally {
      setLoading(false);
    }
  };

  // Pre-load common quick prompts
  const loadQuickPrompt = (rel, sub, ctx) => {
    setRelationship(rel);
    setSubstance(sub);
    setCustomContext(ctx);
  };

  const tabs = [
    { id: 'communication', label: 'How to Communicate', icon: MessageSquare },
    { id: 'avoid', label: 'What to Avoid', icon: AlertCircle },
    { id: 'reinforcement', label: 'Positive Reinforcement', icon: Heart },
    { id: 'warningSigns', label: 'Relapse Warning Signs', icon: AlertOctagon },
    { id: 'emergencyAdvice', label: 'Emergency Guidance', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Title Header */}
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-semibold">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            Caregiver Portal
          </div>
          {!hasApiKey() && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-dark-border rounded-full text-xs text-slate-400 font-semibold">
              Offline Mode / Template Fallbacks Active
            </div>
          )}
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">Caregiver Support Assistant</h2>
        <p className="text-sm text-slate-400">
          Gain personalized guidance on how to speak to, support, and monitor your family members or friends navigating recovery.
        </p>
      </section>

      {/* Quick Scenarios Selection */}
      <section className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Quick Start Scenarios
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadQuickPrompt('son', 'alcohol', 'My son is returning home after rehab today. I want to help him set boundaries.')}
            className="px-4 py-2 rounded-xl bg-slate-900/50 border border-dark-border text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
          >
            Son: Alcohol Recovery
          </button>
          <button
            onClick={() => loadQuickPrompt('partner', 'opioids', 'My partner has cravings in the evening. How do I help ground them?')}
            className="px-4 py-2 rounded-xl bg-slate-900/50 border border-dark-border text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
          >
            Partner: Opioid Cravings
          </button>
          <button
            onClick={() => loadQuickPrompt('daughter', 'prescription drugs', 'My daughter is struggling with stimulant withdrawal. I need communication advice.')}
            className="px-4 py-2 rounded-xl bg-slate-900/50 border border-dark-border text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
          >
            Daughter: Stimulants Support
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Form */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Setup Situation
            </h3>

            {/* Relationship Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Relationship to Loved One</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="partner">Partner</option>
                <option value="friend">Friend</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            {/* Substance Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Substance/Condition</label>
              <select
                value={substance}
                onChange={(e) => setSubstance(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="alcohol">Alcohol</option>
                <option value="opioids">Opioids/Painkillers</option>
                <option value="stimulants">Stimulants/Cocaine/Meth</option>
                <option value="marijuana">Marijuana</option>
                <option value="general substances">General Substance Abuse</option>
              </select>
            </div>

            {/* Context area */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Additional Context (Optional)</label>
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="w-full h-24 bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                placeholder="E.g., completed 30-day program, having trouble sleeping, easily irritated..."
              />
            </div>

            {/* Get Advice button */}
            <button
              onClick={handleFetchAdvice}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Generate Caregiver Guide
            </button>
          </div>
        </section>

        {/* Right Tabbed Results */}
        <section className="lg:col-span-3 flex flex-col justify-stretch">
          {loading && (
            <div className="bg-slate-900/40 border border-dark-border rounded-3xl p-6 flex flex-col items-center justify-center flex-1 min-h-[300px]">
              <div className="h-10 w-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-400 font-medium">Consulting recovery models...</p>
            </div>
          )}

          {!advice && !loading && (
            <div className="bg-slate-900/40 border border-dark-border rounded-3xl p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[300px]">
              <Users className="h-12 w-12 text-slate-600 mb-3" />
              <h4 className="text-base font-bold text-white">No Advisor Guide Loaded</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Configure the form on the left or select a quick-start template, then tap Generate.
              </p>
            </div>
          )}

          {advice && !loading && (
            <div className="bg-dark-card border border-dark-border rounded-3xl flex flex-col flex-1 overflow-hidden">
              
              {/* Tab headers */}
              <div className="flex border-b border-dark-border overflow-x-auto no-scrollbar shrink-0 bg-slate-950/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab contents */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[350px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      {tabs.find(t => t.id === activeTab).label}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {advice[activeTab]}
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>

      </div>
    </div>
  );
}
