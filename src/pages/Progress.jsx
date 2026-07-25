import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Smile, 
  Trash2, 
  Volume2, 
  VolumeX, 
  CalendarDays, 
  Check, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { 
  getSoberDate, 
  setSoberDate, 
  getSoberDaysCount, 
  getMoodLogs, 
  addMoodLog, 
  getSessionHistory, 
  deleteSession,
  getCaregiverContact,
  setCaregiverContact
} from '../utils/localStorage';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export default function Progress() {
  const [soberDateInput, setSoberDateInput] = useState('');
  const [soberDays, setSoberDays] = useState(0);
  const [dateUpdated, setDateUpdated] = useState(false);

  const [moodScore, setMoodScore] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [moodLogged, setMoodLogged] = useState(false);
  const [moodLogs, setMoodLogs] = useState([]);

  const [history, setHistory] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);

  // Caregiver Config State
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverRelation, setCaregiverRelation] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [caregiverUpdated, setCaregiverUpdated] = useState(false);

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    // Load Initial Data
    const sDate = getSoberDate();
    setSoberDateInput(sDate);
    setSoberDays(getSoberDaysCount());
    setHistory(getSessionHistory());
    setMoodLogs(getMoodLogs());
    
    const contact = getCaregiverContact();
    setCaregiverName(contact.name || '');
    setCaregiverRelation(contact.relation || '');
    setCaregiverPhone(contact.phone || '');

    // Check if logged today already
    const todayStr = new Date().toISOString().split('T')[0];
    const loggedToday = getMoodLogs().some(log => log.date === todayStr);
    setMoodLogged(loggedToday);
  }, []);

  const handleUpdateSoberDate = (e) => {
    e.preventDefault();
    setSoberDate(soberDateInput);
    setSoberDays(getSoberDaysCount());
    setDateUpdated(true);
    setTimeout(() => setDateUpdated(false), 2000);
  };

  const handleUpdateCaregiver = (e) => {
    e.preventDefault();
    setCaregiverContact({
      name: caregiverName,
      relation: caregiverRelation,
      phone: caregiverPhone
    });
    setCaregiverUpdated(true);
    setTimeout(() => setCaregiverUpdated(false), 2000);
  };

  const handleLogMood = (e) => {
    e.preventDefault();
    addMoodLog(moodScore, moodNote);
    setMoodLogs(getMoodLogs()); // refresh activity feed
    setMoodLogged(true);
    setMoodNote('');
    setTimeout(() => setMoodLogged(false), 2500);
  };

  const handleDeleteHistory = (id) => {
    stopSpeaking();
    const updatedHistory = deleteSession(id);
    setHistory(updatedHistory);
    if (expandedSession === id) {
      setExpandedSession(null);
    }
  };

  const toggleExpandSession = (id) => {
    if (expandedSession === id) {
      setExpandedSession(null);
    } else {
      setExpandedSession(id);
    }
  };

  const getMoodEmoji = (score) => {
    switch (Number(score)) {
      case 1: return '😰 Anxious';
      case 2: return '😔 Down';
      case 3: return '🧘 Neutral';
      case 4: return '😊 Good';
      case 5: return '✨ Peaceful';
      default: return '🧘 Neutral';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Title */}
      <section className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 font-semibold">
          <Heart className="h-3.5 w-3.5 text-purple-400" />
          Milestones & History
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">Your Progress Journey</h2>
        <p className="text-sm text-slate-400">
          Track your sobriety milestones, log your daily mood trends, and review your past saved support sessions.
        </p>
      </section>

      {/* Grid: Milestone Setter & Mood Logger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column Stack */}
        <div className="space-y-8">
          {/* Sobriety Milestone Card */}
          <section className="bg-dark-card border border-dark-border rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Sobriety Date Settings
              </h3>
              
              <div className="p-4 bg-emerald-950/15 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{soberDays} Days</div>
                  <div className="text-xs text-emerald-400 font-semibold">Continuous Sobriety Milestone</div>
                </div>
                <CalendarDays className="h-10 w-10 text-emerald-500/35" />
              </div>

              <form onSubmit={handleUpdateSoberDate} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label htmlFor="sober-date-picker" className="text-xs text-slate-400 font-semibold">Sobriety Start Date</label>
                  <input
                    id="sober-date-picker"
                    type="date"
                    value={soberDateInput}
                    onChange={(e) => setSoberDateInput(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  {dateUpdated ? (
                    <>
                      <Check className="h-4 w-4" />
                      Milestone Updated!
                    </>
                  ) : (
                    "Save Milestone Date"
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Primary Caregiver settings */}
          <section className="bg-dark-card border border-dark-border rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-emerald-400" />
              Primary Caregiver Settings
            </h3>

            <form onSubmit={handleUpdateCaregiver} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="caregiver-name-picker" className="text-xs text-slate-400 font-semibold">Caregiver's Name</label>
                <input
                  id="caregiver-name-picker"
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Dad, Mom, Jane"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="caregiver-relation-picker" className="text-xs text-slate-400 font-semibold">Relationship</label>
                <input
                  id="caregiver-relation-picker"
                  type="text"
                  value={caregiverRelation}
                  onChange={(e) => setCaregiverRelation(e.target.value)}
                  placeholder="e.g. Father, Mother, Sponsor"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="caregiver-phone-picker" className="text-xs text-slate-400 font-semibold">Phone Number</label>
                <input
                  id="caregiver-phone-picker"
                  type="tel"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="e.g. 555-0199"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                {caregiverUpdated ? (
                  <>
                    <Check className="h-4 w-4" />
                    Contact Saved!
                  </>
                ) : (
                  "Save Contact Info"
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Daily Mood Logger */}
        <section className="bg-dark-card border border-dark-border rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Smile className="h-4 w-4 text-purple-400" />
            Log Daily Mood
          </h3>

          <form onSubmit={handleLogMood} className="space-y-4">
            {/* Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>How are you today?</span>
                <span className="text-purple-400 font-bold">{getMoodEmoji(moodScore)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={moodScore}
                onChange={(e) => setMoodScore(e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
                <span>1 (Struggling)</span>
                <span>3 (Neutral)</span>
                <span>5 (Peaceful)</span>
              </div>
            </div>

            {/* Note input */}
            <div className="space-y-1.5">
              <label htmlFor="mood-note" className="text-xs text-slate-400 font-semibold">Notes / Reflections (Optional)</label>
              <input
                id="mood-note"
                type="text"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                placeholder="E.g., felt triggered, went for a run instead..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              {moodLogged ? (
                <>
                  <Check className="h-4 w-4" />
                  Mood Log Saved!
                </>
              ) : (
                "Save Daily Log"
              )}
            </button>
          </form>
        </section>

      </div>

      {/* Activity History — merges mood logs + AI sessions */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Activity History
        </h3>

        {(() => {
          // Build a unified chronological feed
          const moodItems = moodLogs.map(log => ({
            id: `mood-${log.date}`,
            type: 'mood',
            timestamp: log.date + 'T00:00:00.000Z',
            score: log.score,
            note: log.note,
          }));
          const sessionItems = history.map(s => ({ ...s, type: 'session' }));
          const allItems = [...moodItems, ...sessionItems].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );

          if (allItems.length === 0) return (
            <div className="bg-slate-900/40 border border-dark-border rounded-3xl p-10 text-center text-slate-500">
              <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">No Activity Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Log your daily mood above or have a conversation with the Recovery Assistant — your activity will appear here automatically.
              </p>
            </div>
          );

          return (
            <div className="space-y-3">
              {allItems.map((item) => {
                if (item.type === 'mood') {
                  const moodEmoji = getMoodEmoji(item.score);
                  const scoreColor = item.score <= 2 ? 'text-rose-400' : item.score === 3 ? 'text-amber-400' : 'text-emerald-400';
                  const borderColor = item.score <= 2 ? 'border-rose-500/20' : item.score === 3 ? 'border-amber-500/20' : 'border-emerald-500/20';
                  return (
                    <div key={item.id} className={`bg-dark-card border ${borderColor} rounded-2xl p-4 flex items-center gap-4`}>
                      <div className="shrink-0 p-2.5 bg-purple-500/10 rounded-xl">
                        <Smile className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${scoreColor}`}>{moodEmoji}</span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Daily Mood Log</span>
                        </div>
                        {item.note && <p className="text-xs text-slate-400 mt-0.5 truncate">{item.note}</p>}
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-500 font-semibold">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                }

                // AI Session item
                const isExpanded = expandedSession === item.id;
                const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                return (
                  <div key={item.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-300">
                    <div
                      onClick={() => toggleExpandSession(item.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            "{item.transcript}"
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {formattedDate} • Mood: <span className="text-purple-400">{item.mood || 'neutral'}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                          title="Delete Session"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-dark-border bg-slate-900/30 space-y-4">
                        <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-dark-border">
                          <span className="text-xs text-slate-400 font-semibold">Listen to the AI guidance:</span>
                          <button
                            onClick={() => { if (isSpeaking) { stopSpeaking(); } else { speak(item.responseText); } }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isSpeaking ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-dark-border text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {isSpeaking ? <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-bounce" /> : <VolumeX className="h-3.5 w-3.5" />}
                            {isSpeaking ? "Mute" : "Read Aloud"}
                          </button>
                        </div>
                        {item.parsedResponse ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950/20 border border-dark-border rounded-xl">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">Emotional Support</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item.parsedResponse.emotionalSupport}</p>
                            </div>
                            <div className="p-4 bg-slate-950/20 border border-dark-border rounded-xl">
                              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block mb-1">Immediate Grounding</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item.parsedResponse.immediateAction}</p>
                            </div>
                            <div className="p-4 bg-slate-950/20 border border-dark-border rounded-xl">
                              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mb-1">Safety Measures</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item.parsedResponse.safetyAdvice}</p>
                            </div>
                            <div className="p-4 bg-slate-950/20 border border-dark-border rounded-xl">
                              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">Affirmation</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item.parsedResponse.encouragingMessage}</p>
                            </div>
                            <div className="p-4 bg-slate-950/20 border border-dark-border rounded-xl sm:col-span-2">
                              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">Educational Tip</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item.parsedResponse.educationalTip}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-300 whitespace-pre-line font-mono italic">{item.responseText}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

    </div>
  );
}

