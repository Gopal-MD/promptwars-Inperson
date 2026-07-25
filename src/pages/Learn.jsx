import React, { useState } from 'react';
import { BookOpen, Send, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { generateEducationalAnswer, hasApiKey } from '../services/groq';

export default function Learn() {
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');

  // Default pre-baked high quality answers for offline fallback
  const faqs = [
    {
      q: "What are cravings?",
      a: "Cravings are intense, sometimes overwhelming desires for a substance. Physically, they are triggered by the brain's reward center (mesolimbic dopamine pathway) reminding you of a substance's effects. \n\nImportant facts:\n• Cravings are temporary: they peak in intensity and typically last only 10 to 20 minutes.\n• Urge Surfing: instead of fighting a craving, imagine it as a wave in the ocean. Relax, breathe deeply, and ride the wave until it dissolves.\n• Triggers: environmental cues (places, people, stress) can fire off dopamine alarms, triggering a craving. Identifying your unique cues is key to avoiding them."
    },
    {
      q: "What should I do during withdrawal?",
      a: "Withdrawal is the body's process of clearing a substance. Symptoms depend on the substance, dosage, and length of use.\n\nImmediate Safety Guidelines:\n• Seek Medical Supervision: some withdrawal types (like alcohol and benzodiazepines) can trigger dangerous physical conditions like seizures or severe dehydration. Consult a doctor or medical team.\n• Hydration & Nutrition: drink plenty of water and consume easily digestible nutrients.\n• Grounding: practice deep breathing, warm baths, and rest. Avoid making big decisions during this high stress window."
    },
    {
      q: "How can family help?",
      a: "Family and social networks are foundational pillars for long-term recovery. \n\nHow they can help effectively:\n• Active Listening: listen without immediately planning responses, correcting facts, or reminding of past failures.\n• Establishing Boundaries: clear boundaries protect both the caregiver and the person in recovery. They prevent codependency and enabling behaviors.\n• Educational Support: learn about the science of addiction to move away from moral blame toward supportive empathy.\n• Celebrating Milestones: encourage sober celebrations of sobriety counts, promoting positive reinforcements."
    }
  ];

  const handleAskQuestion = async (qText) => {
    setActiveQuestion(qText);
    
    if (!hasApiKey()) {
      // Find local FAQ fallback
      const found = faqs.find(f => f.q.toLowerCase() === qText.toLowerCase());
      if (found) {
        setAnswer(found.a);
      } else {
        setAnswer("Cravings are temporary chemical signals in the brain. Focus on box breathing: inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat until you feel grounded. Consider setting up a Groq API Key to ask custom questions.");
      }
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await generateEducationalAnswer(qText);
      setAnswer(response);
    } catch (err) {
      console.warn("Groq query failed, falling back to local database:", err);
      // Fallback
      const found = faqs.find(f => f.q.toLowerCase() === qText.toLowerCase());
      setAnswer(found ? found.a : "We ran into an error connecting to Groq. Cravings are normal. Try drinking water, walking, or calling your caregiver.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    handleAskQuestion(customQuestion);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Page Title */}
      <section className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-semibold">
          <BookOpen className="h-3.5 w-3.5 text-blue-400" />
          Education & Science
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">Educational Recovery Hub</h2>
        <p className="text-sm text-slate-400">
          Learn about the biological, psychological, and relational aspects of addiction recovery. Tap on a quick question below or ask the AI assistant.
        </p>
      </section>

      {/* Grid of Default Questions */}
      <section className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Frequent Questions (FAQ)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => handleAskQuestion(faq.q)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                activeQuestion === faq.q
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-300 shadow-lg'
                  : 'bg-dark-card border-dark-border text-slate-300 hover:border-slate-700'
              }`}
            >
              <HelpCircle className="h-5 w-5 text-blue-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Click to read about {faq.q.toLowerCase().replace('what', '').replace('how', '').replace('are', '').trim()}.
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Ask custom prompt */}
      <section className="bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Ask AI Assistant
          </h3>
        </div>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="E.g., 'What is neuroplasticity in recovery?' or 'How does dopamine recover?'"
            className="flex-1 bg-dark-bg border border-dark-border rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !customQuestion.trim()}
            className="p-3.5 bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer"
            aria-label="Submit question"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </section>

      {/* Answer Board */}
      <section>
        {loading && (
          <div className="bg-slate-900/40 border border-dark-border rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="h-8 w-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-400 font-semibold">Groq is searching neuroscience archives...</p>
          </div>
        )}

        {answer && !loading && (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-dark-border pb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-bold text-white">
                {activeQuestion ? `Q: "${activeQuestion}"` : "AI Insights Answer"}
              </h4>
            </div>
            
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {answer}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
