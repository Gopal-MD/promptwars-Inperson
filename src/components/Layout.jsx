import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  Activity, 
  Settings, 
  Key, 
  Calendar,
  X,
  Check
} from 'lucide-react';
import { getSoberDaysCount } from '../utils/localStorage';
import { hasApiKey, saveTempApiKey, clearTempApiKey } from '../services/groq';

export default function Layout({ children, currentPage, setCurrentPage }) {
  const [soberDays, setSoberDays] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    // Refresh clean days count and API key status on load and navigation
    setSoberDays(getSoberDaysCount());
    setApiKeyExists(hasApiKey());
  }, [currentPage, isSettingsOpen]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      saveTempApiKey(apiKeyInput.trim());
      setKeySaved(true);
      setApiKeyExists(true);
      setTimeout(() => {
        setKeySaved(false);
        setIsSettingsOpen(false);
        setApiKeyInput('');
      }, 1500);
    }
  };

  const handleClearApiKey = () => {
    clearTempApiKey();
    setApiKeyExists(hasApiKey());
    setIsSettingsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Activity },
    { id: 'recovery', label: 'Talk to AI', icon: MessageSquare },
    { id: 'emergency', label: 'Emergency Script', icon: AlertTriangle },
    { id: 'caregiver', label: 'Caregiver Support', icon: Users },
    { id: 'learn', label: 'Learn FAQs', icon: BookOpen },
    { id: 'progress', label: 'Progress History', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark-card border-b md:border-b-0 md:border-r border-dark-border flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity border-b border-dark-border"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white m-0 leading-none">RecoverAI</h1>
              <span className="text-xs text-slate-400 font-sans">Your AI Companion</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Section */}
        <div className="p-4 border-t border-dark-border space-y-3">
          {/* Sober Days Counter widget */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl flex items-center gap-3">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Milestone</div>
              <div className="text-sm font-semibold text-white">{soberDays} Days Sobriety</div>
            </div>
          </div>

          {/* Settings Trigger */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-dark-border hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-all text-xs"
          >
            <span className="flex items-center gap-2 font-medium">
              <Settings className="h-4 w-4" />
              API Settings
            </span>
            <span className={`h-2.5 w-2.5 rounded-full ${apiKeyExists ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <header className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-bg/60 backdrop-blur-md sticky top-0 z-10 md:hidden">
          <div className="flex items-center gap-2" onClick={() => setCurrentPage('home')}>
            <Heart className="h-6 w-6 text-emerald-400" />
            <span className="font-bold font-display text-white">RecoverAI</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 border border-dark-border rounded-xl hover:bg-slate-800/40"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-slate-400" />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/55 transition-all"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Groq API Configuration</h3>
                <p className="text-xs text-slate-400">Manage your Groq Developer API Key</p>
              </div>
            </div>

            {apiKeyExists ? (
              <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400 mt-0.5">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">API Key Active</h4>
                  <p className="text-xs text-emerald-500/70 mt-1">API Key is loaded. You're ready to communicate with Groq.</p>
                  <button 
                    onClick={handleClearApiKey}
                    className="mt-3 text-xs font-semibold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Reset & Remove Key
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-300 leading-relaxed">
                  No environment API key detected. Please add <strong>VITE_GROQ_API_KEY</strong> to your <code>.env</code> file, or enter a temporary one below. Temporary keys are stored in your local browser storage.
                </p>
              </div>
            )}

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label htmlFor="api-key-input" className="block text-xs font-medium text-slate-400 mb-2">
                  Groq API Key
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-dark-border hover:bg-slate-800/40 text-sm font-medium text-slate-400 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={keySaved}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
                >
                  {keySaved ? 'Saved!' : 'Save & Close'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
