import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Save, 
  AlertOctagon, 
  Compass, 
  Flame, 
  BookOpen, 
  Sparkles,
  Keyboard,
  Send,
  Check,
  ArrowRight,
  History,
  FileText
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { generateRecoveryGuidance, hasApiKey } from '../services/groq';
import { saveSession } from '../utils/localStorage';
import SafetyAlert, { checkSafetyDanger } from '../components/SafetyAlert';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/language';

export default function RecoveryAssistant({ setCurrentPage }) {
  const { language } = useLanguage();
  const speechLang = SUPPORTED_LANGUAGES[language]?.speechLang || 'en-US';

  const [mood, setMood] = useState('neutral');
  const [textBackup, setTextBackup] = useState('');
  const [useText, setUseText] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null); // { emotionalSupport, immediateAction, etc. }
  const [saved, setSaved] = useState(false);
  const [safetyTrigger, setSafetyTrigger] = useState('');

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ lang: speechLang });

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis({ lang: speechLang });

  // Watch speech recognition transcript for safety triggers (debounced 400ms)
  useEffect(() => {
    if (!transcript) return;

    const handler = setTimeout(() => {
      if (checkSafetyDanger(transcript)) {
        stopListening();
        setSafetyTrigger(transcript);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [transcript, stopListening]);



  const toggleListen = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        handleSubmitQuery(transcript);
      }
    } else {
      stopSpeaking();
      resetTranscript();
      setResponse(null);
      setSaved(false);
      setError('');
      startListening();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textBackup.trim()) return;
    
    if (checkSafetyDanger(textBackup)) {
      setSafetyTrigger(textBackup);
      return;
    }

    handleSubmitQuery(textBackup);
  };

  const handleSubmitQuery = async (queryText) => {
    if (!hasApiKey()) {
      setError("Please click the 'API Settings' button on the sidebar to input your Groq API Key first.");
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);
    setSaved(false);

    try {
      const result = await generateRecoveryGuidance(queryText, mood);
      setResponse(result);
      // Auto-save every successful session so Progress History is always populated
      saveSession({
        transcript: queryText,
        responseText: result.raw,
        parsedResponse: result,
        mood,
        language
      });
      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to generate support. Please check your network and API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = () => {
    if (!response) return;
    const sessionData = {
      transcript: transcript || textBackup || "Voice session",
      responseText: response.raw,
      parsedResponse: response,
      mood: mood,
      language
    };
    saveSession(sessionData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStopAll = () => {
    stopListening();
    stopSpeaking();
  };

  const moods = [
    { id: 'anxious', label: 'Anxious 😰', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'craving', label: 'Craving ⏳', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { id: 'overwhelmed', label: 'Overwhelmed 🧠', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'depressed', label: 'Low Energy 😔', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'neutral', label: 'Calm 🧘', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Title Header */}
      <section className="space-y-2">
        <h2 className="text-3xl font-extrabold font-display text-white">Recovery Assistant</h2>
        <p className="text-sm text-slate-400">
          Set your current mood, tap the microphone, and express how you feel. Our AI companion will walk you through coping strategies.
        </p>
      </section>

      {/* Mood Selector Section */}
      <section className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Step 1: How are you feeling right now?
        </label>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                mood === m.id 
                  ? `${m.color.replace('border-', 'border-opacity-100 border-').split(' ')[0]} border-emerald-500 ring-2 ring-emerald-500/20 text-white`
                  : 'bg-slate-900/40 border-dark-border text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Voice Input / Mic Button Section */}
      <section className="bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Glow behind mic */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500 ${isListening ? 'bg-emerald-500' : 'bg-transparent'}`} />

        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step 2: Voice Conversation
          </span>
          <button 
            onClick={() => {
              setUseText(!useText);
              handleStopAll();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dark-border hover:bg-slate-800/40 text-xs text-slate-400 font-medium transition-all"
          >
            <Keyboard className="h-3.5 w-3.5" />
            {useText ? "Use Microphone" : "Type Message"}
          </button>
        </div>

        {!useText ? (
          // MIC INTERFACE
          <div className="space-y-6 w-full flex flex-col items-center">
            
            {/* The Main Pulsating Microphone */}
            <button
              onClick={toggleListen}
              className={`h-28 w-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative cursor-pointer ${
                isListening 
                  ? 'bg-emerald-500 text-white animate-pulse-ring' 
                  : 'bg-slate-800 border border-dark-border text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              aria-label={isListening ? "Stop listening and submit" : "Start voice recognition"}
            >
              {isListening ? (
                <Mic className="h-10 w-10 text-white" />
              ) : (
                <MicOff className="h-10 w-10 text-slate-400" />
              )}
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">
                {isListening ? "Listening... Speak now" : "Tap to Speak"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                {isListening 
                  ? "Tap again when you finish speaking to receive guidance." 
                  : "We use browser Speech-to-Text. Talk naturally about your cravings or mood."}
              </p>
            </div>

            {/* Live speech recognition status */}
            {!browserSupportsSpeechRecognition && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/20 text-xs text-amber-400 rounded-xl max-w-sm mt-4">
                Speech recognition is not supported in this browser version. Please type using the keyboard backup option.
              </div>
            )}

            {/* Live Transcript Display Box */}
            {transcript && (
              <div className="w-full max-w-lg bg-dark-bg/60 border border-dark-border rounded-2xl p-4 text-sm text-slate-200 text-left italic">
                "{transcript}"
              </div>
            )}

          </div>
        ) : (
          // KEYBOARD BACKUP INTERFACE
          <form onSubmit={handleTextSubmit} className="w-full max-w-lg space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={textBackup}
                onChange={(e) => setTextBackup(e.target.value)}
                placeholder="Share how you are feeling (e.g. 'I am feeling triggered to drink')..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !textBackup.trim()}
                className="p-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer"
                aria-label="Send query"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </section>

      {/* API Configuration/Error Alert */}
      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-500/20 text-sm text-rose-400 rounded-2xl flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 mt-0.5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State Spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="h-10 w-10 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
          <div className="text-sm text-slate-400 font-medium">Groq is writing emotional support...</div>
        </div>
      )}

      {/* Structured Response Content Cards */}
      {response && !loading && (
        <section className="space-y-6 animate-fade-in">
          {/* Controls bar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Groq Guidance Response
              </h4>
            </div>

            {/* Audio Synthesis & Save Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const fullText = `
                      ${response.emotionalSupport}. 
                      Immediate action: ${response.immediateAction}. 
                      Safety advice: ${response.safetyAdvice}. 
                      Remember: ${response.encouragingMessage}. 
                      Educational tip: ${response.educationalTip}.
                    `;
                    speak(fullText);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-dark-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {isSpeaking ? <Volume2 className="h-4 w-4 text-emerald-400 animate-bounce" /> : <VolumeX className="h-4 w-4" />}
                {isSpeaking ? "Mute Speech" : "Play Aloud"}
              </button>

              <button
                onClick={handleSaveSession}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-dark-border transition-all cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Auto-Saved ✓
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Re-Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 1: Emotional Support */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-dark-card p-6 flex gap-4">
            <div className="shrink-0 h-9 w-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Compass className="h-4.5 w-4.5 text-emerald-400" style={{height:'18px',width:'18px'}} />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">
                Emotional Support
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {response.emotionalSupport}
              </p>
            </div>
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Card 2 + 3: side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 2: Immediate Grounding */}
            <div className="relative rounded-3xl overflow-hidden border border-teal-500/20 bg-gradient-to-br from-teal-950/30 to-dark-card p-6 flex gap-4">
              <div className="shrink-0 h-9 w-9 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
                <Flame style={{height:'18px',width:'18px'}} className="text-teal-400" />
              </div>
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">
                  Immediate Grounding
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {response.immediateAction}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 h-20 w-20 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Card 3: Safety Measures */}
            <div className="relative rounded-3xl overflow-hidden border border-rose-500/20 bg-gradient-to-br from-rose-950/30 to-dark-card p-6 flex gap-4">
              <div className="shrink-0 h-9 w-9 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
                <AlertOctagon style={{height:'18px',width:'18px'}} className="text-rose-400" />
              </div>
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block mb-2">
                  Safety Measures
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {response.safetyAdvice}
                </p>
              </div>
              <div className="absolute top-0 right-0 h-20 w-20 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Card 4: Daily Affirmation */}
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-dark-card p-6 flex gap-4">
            <div className="shrink-0 h-9 w-9 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
              <Sparkles style={{height:'18px',width:'18px'}} className="text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block mb-2">
                Daily Affirmation
              </span>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{response.encouragingMessage}"
              </p>
            </div>
            <div className="absolute bottom-0 right-0 h-28 w-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Card 5: Educational Tip */}
          <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-dark-card p-6 flex gap-4">
            <div className="shrink-0 h-9 w-9 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <BookOpen style={{height:'18px',width:'18px'}} className="text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-2">
                Did You Know?
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {response.educationalTip}
              </p>
            </div>
            <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Cross-page Workflow Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setCurrentPage?.('progress')}
              className="flex-1 flex items-center justify-between gap-2 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-dark-border rounded-2xl text-xs font-semibold text-slate-300 hover:text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-purple-400" />
                <span>Session saved &rarr; View Progress History</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>
            <button
              onClick={() => setCurrentPage?.('emergency')}
              className="flex-1 flex items-center justify-between gap-2 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-dark-border rounded-2xl text-xs font-semibold text-slate-300 hover:text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-rose-400" />
                <span>Need immediate help? &rarr; Emergency Script</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </section>
      )}

      {/* Safety Alert Modal Trigger */}
      {safetyTrigger && (
        <SafetyAlert 
          triggerText={safetyTrigger} 
          onDismiss={() => setSafetyTrigger('')} 
        />
      )}

    </div>
  );
}
