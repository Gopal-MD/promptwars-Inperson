import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { getSoberDaysCount, hasConsecutiveLowMoods } from '../utils/localStorage';

export default function Home({ setCurrentPage }) {
  const [soberDays, setSoberDays] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    setSoberDays(getSoberDaysCount());
    
    const consecutiveLow = hasConsecutiveLowMoods();
    const dismissed = localStorage.getItem('recoverai_dismiss_mood_suggestion') === 'true';
    setShowSuggestion(consecutiveLow && !dismissed);
  }, []);

  const handleDismissSuggestion = (e) => {
    e.stopPropagation();
    localStorage.setItem('recoverai_dismiss_mood_suggestion', 'true');
    setShowSuggestion(false);
  };

  const cards = [
    {
      id: 'recovery',
      title: 'Talk to AI',
      tagline: 'Hands-free voice assistant',
      description: 'Get immediate emotional support, grounding exercises, and craving advice through calm voice conversations.',
      icon: MessageSquare,
      colorClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      badge: 'Zero Typing'
    },
    {
      id: 'emergency',
      title: 'Emergency Script',
      tagline: 'Personalized crisis messaging',
      description: 'Quickly draft and copy highly customized distress messages for your caregivers in moments of high stress.',
      icon: AlertTriangle,
      colorClass: 'from-rose-500/20 to-orange-500/10 border-rose-500/20 text-rose-400 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400',
      badge: 'One Click'
    },
    {
      id: 'learn',
      title: 'Educational Hub',
      tagline: 'AI recovery database',
      description: 'Explore scientific explanations on cravings, triggers, withdrawal symptoms, and physical healing pathways.',
      icon: BookOpen,
      colorClass: 'from-blue-500/20 to-sky-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400',
    },
    {
      id: 'caregiver',
      title: 'Caregiver Support',
      tagline: 'Assistance for loved ones',
      description: 'Tailored advice, communication templates, boundary guidance, and red flags to watch for supporting recovery.',
      icon: Users,
      colorClass: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      id: 'progress',
      title: 'Progress Tracker',
      tagline: 'Milestones & history log',
      description: 'Log your mood trends, calculate sober days, review and listen to past saved voice sessions.',
      icon: Heart,
      colorClass: 'from-purple-500/20 to-pink-500/10 border-purple-500/20 text-purple-400 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400',
    }
  ];

  // Pick a motivational message based on sober days count
  const getMotivationalMessage = () => {
    if (soberDays === 0) return "Starting today is a courageous choice. Take it one hour at a time.";
    if (soberDays < 7) return "You are in the vital early days. Every single clean choice rewires your mind.";
    if (soberDays < 30) return "Nearly a month! Your body and neural pathways are recovering. Keep going.";
    return "Outstanding progress. Keep nurturing your wellness, one moment at a time.";
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Welcome Header & Hero */}
      <section className="text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          Welcome to RecoverAI
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight m-0">
          Your Recovery Companion
        </h2>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          RecoverAI uses conversational AI, safety alerts, and speech interfaces to assist you and your loved ones through stressful recovery moments.
        </p>
      </section>

      {/* Contextual Caregiver Recommendation Alert */}
      {showSuggestion && (
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-5 flex items-start justify-between gap-4 animate-fade-in relative overflow-hidden text-left animate-slide-in">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-bold text-white">Daily Mood Trend Notice</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                We noticed you have logged a sequence of difficult or anxious days. Consider sharing your feelings or configuring care templates. Reaching out can offer vital relief.
              </p>
              <button
                onClick={() => setCurrentPage('caregiver')}
                className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer group"
              >
                Go to Caregiver Support
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleDismissSuggestion}
            className="p-1.5 hover:bg-slate-800/40 text-slate-500 hover:text-slate-300 rounded-xl transition-all cursor-pointer shrink-0"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sobriety Streak Indicator Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-border bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Sobriety Journey
          </span>
          <h3 className="text-2xl font-extrabold text-white font-display">
            {soberDays === 0 ? "Day One" : `${soberDays} Days Committed`}
          </h3>
          <p className="text-sm text-slate-400 italic">
            "{getMotivationalMessage()}"
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => setCurrentPage('progress')}
            className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl transition-all text-sm shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Update Journey
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Pages Navigation Cards Grid */}
      <section className="space-y-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left">
          Core Workflows
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setCurrentPage(card.id)}
                className={`group text-left p-6 rounded-3xl border bg-gradient-to-br ${card.colorClass} hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[230px] relative overflow-hidden cursor-pointer`}
              >
                {/* Decorative glowing card accent */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${card.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {card.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white px-2.5 py-1 rounded-full border border-white/5">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h5 className="text-xl font-extrabold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h5>
                  <p className="text-xs text-slate-400 font-semibold mb-3">
                    {card.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
