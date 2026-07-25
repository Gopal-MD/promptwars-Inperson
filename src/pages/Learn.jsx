import React, { useState } from 'react';
import { BookOpen, Send, Sparkles, HelpCircle, CheckCircle2, ShieldAlert, Brain, Heart, Pill } from 'lucide-react';
import { generateEducationalAnswer, hasApiKey } from '../services/groq';

export default function Learn() {
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');

  // Category badge config
  const CATEGORIES = {
    science:   { label: 'Neuroscience', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    safety:    { label: 'Safety', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    caregiver: { label: 'Caregiving', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    prevention:{ label: 'Prevention', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };

  const faqs = [
    {
      q: "What are cravings?",
      category: 'science',
      icon: Brain,
      a: "Cravings are intense, sometimes overwhelming desires for a substance. Physically, they are triggered by the brain's reward center (mesolimbic dopamine pathway) reminding you of a substance's effects.\n\nImportant facts:\n• Cravings are temporary: they peak in intensity and typically last only 10 to 20 minutes.\n• Urge Surfing: instead of fighting a craving, imagine it as a wave in the ocean. Relax, breathe deeply, and ride the wave until it dissolves.\n• Triggers: environmental cues (places, people, stress) can fire off dopamine alarms, triggering a craving. Identifying your unique cues is key to avoiding them."
    },
    {
      q: "What should I do during withdrawal?",
      category: 'safety',
      icon: ShieldAlert,
      a: "Withdrawal is the body's process of clearing a substance. Symptoms depend on the substance, dosage, and length of use.\n\nImmediate Safety Guidelines:\n• Seek Medical Supervision: some withdrawal types (like alcohol and benzodiazepines) can trigger dangerous physical conditions like seizures or severe dehydration. Consult a doctor or medical team.\n• Hydration & Nutrition: drink plenty of water and consume easily digestible nutrients.\n• Grounding: practice deep breathing, warm baths, and rest. Avoid making big decisions during this high stress window."
    },
    {
      q: "How can family help?",
      category: 'caregiver',
      icon: Heart,
      a: "Family and social networks are foundational pillars for long-term recovery.\n\nHow they can help effectively:\n• Active Listening: listen without immediately planning responses, correcting facts, or reminding of past failures.\n• Establishing Boundaries: clear boundaries protect both the caregiver and the person in recovery. They prevent codependency and enabling behaviors.\n• Educational Support: learn about the science of addiction to move away from moral blame toward supportive empathy.\n• Celebrating Milestones: encourage sober celebrations of sobriety counts, promoting positive reinforcements."
    },
    {
      q: "What is Medication-Assisted Treatment (MAT)?",
      category: 'science',
      icon: Pill,
      a: "Medication-Assisted Treatment (MAT) combines FDA-approved medications with counseling and behavioral therapies to treat substance use disorders.\n\nKey medications used:\n• Methadone: reduces withdrawal symptoms and cravings for opioids by acting on the same receptors, but more slowly.\n• Buprenorphine (Suboxone): a partial opioid agonist that reduces cravings without producing significant euphoria.\n• Naltrexone (Vivitrol): blocks opioid receptors entirely, preventing any euphoric effect — used after full detox.\n• Disulfiram (Antabuse): creates severe nausea if alcohol is consumed, acting as a deterrent.\n\nMAT is clinically proven to reduce opioid use, lower overdose deaths, improve social functioning, and increase treatment retention by 50%."
    },
    {
      q: "How do I prevent a relapse?",
      category: 'prevention',
      icon: ShieldAlert,
      a: "Relapse is a process, not a single event — and it is not failure. Most people in recovery experience at least one relapse before achieving long-term sobriety.\n\nThe three stages of relapse:\n1. Emotional Relapse: poor self-care, isolation, suppressing feelings.\n2. Mental Relapse: bargaining thoughts, romanticizing past use.\n3. Physical Relapse: the actual use.\n\nPrevention strategies:\n• HALT Check: pause and ask — Am I Hungry, Angry, Lonely, or Tired? Address the root state.\n• Recovery Plan: maintain a written plan covering triggers, coping tools, and emergency contacts.\n• Support Networks: regular meeting attendance (AA, NA, SMART Recovery) provides accountability.\n• Mindfulness: a daily mindfulness or meditation practice builds the pause-and-reflect muscle."
    },
    {
      q: "What is a trigger and how do I manage it?",
      category: 'prevention',
      icon: Brain,
      a: "A trigger is any stimulus (person, place, emotion, or situation) that activates cravings by associating with past substance use through learned brain pathways.\n\nTypes of triggers:\n• External: bars, parties, certain people, smells, music, or locations.\n• Internal: stress, loneliness, boredom, anxiety, anger, or celebratory euphoria.\n\nManagement techniques:\n• Trigger Mapping: list your top 10 triggers and rate their intensity. Awareness alone reduces power.\n• Avoidance (early recovery): for high-risk external triggers, avoidance is valid and important in the first 90 days.\n• Exposure Therapy (later): with counselor guidance, gradual controlled exposure can neutralize triggers.\n• The 5-4-3-2-1 Grounding Technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — anchors you to the present moment."
    },
    {
      q: "How does stress affect recovery?",
      category: 'science',
      icon: Brain,
      a: "Stress is the leading trigger for both cravings and relapse. Chronic stress alters the same brain circuits affected by substance use — particularly the amygdala (fear/craving center) and prefrontal cortex (decision-making).\n\nThe science:\n• Cortisol Surge: stress floods the body with cortisol, which activates reward-seeking behavior as the brain tries to find relief.\n• Corticotropin-Releasing Factor (CRF): a neurochemical released during stress that directly activates dopamine pathways, triggering cravings.\n• Allostatic Load: prolonged stress 'resets' the baseline mood lower, increasing dependence risk.\n\nStress reduction tools:\n• Box breathing (4-4-4-4 pattern) activates the parasympathetic nervous system within 90 seconds.\n• Physical exercise reduces cortisol and increases endorphins — even a 10-minute walk helps.\n• Sleep hygiene is critical: poor sleep dramatically increases stress vulnerability and craving intensity."
    },
    {
      q: "What is dual diagnosis / co-occurring disorders?",
      category: 'science',
      icon: Brain,
      a: "Dual diagnosis (also called co-occurring disorders) refers to having both a substance use disorder and a mental health condition simultaneously.\n\nCommon co-occurring pairs:\n• Depression + Alcohol Use Disorder (most common)\n• PTSD + Opioid Use Disorder\n• Anxiety + Benzodiazepine Dependence\n• Bipolar Disorder + Stimulant Use\n\nWhy it matters:\n• Treating only one condition dramatically increases relapse risk for both.\n• Mental health symptoms often predated the substance use as a form of self-medication.\n• Integrated treatment — addressing both conditions concurrently — has significantly better outcomes.\n\nIf you suspect dual diagnosis, seek an integrated treatment program or psychiatrist who specializes in addiction medicine."
    }
  ];

  const handleAskQuestion = async (qText) => {
    setActiveQuestion(qText);
    setError('');

    if (!hasApiKey()) {
      const found = faqs.find(f => f.q.toLowerCase() === qText.toLowerCase());
      if (found) {
        setAnswer(found.a);
      } else {
        setAnswer("Cravings are temporary chemical signals in the brain. Focus on box breathing: inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat until you feel grounded. Consider setting up a Groq API Key to ask custom questions.");
      }
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await generateEducationalAnswer(qText);
      setAnswer(response);
    } catch (err) {
      console.warn("Groq query failed, falling back to local database:", err);
      const found = faqs.find(f => f.q.toLowerCase() === qText.toLowerCase());
      setAnswer(found ? found.a : "We ran into an error connecting to Groq. Cravings are normal. Try drinking water, walking, or calling your caregiver.");
      setError('Using local fallback: ' + (err.message || 'connection error'));
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
          Education &amp; Science
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">Educational Recovery Hub</h2>
        <p className="text-sm text-slate-400">
          Learn about the biological, psychological, and relational aspects of addiction recovery. Tap a question below or ask the AI assistant anything.
        </p>
      </section>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cat.color}`}>
            {cat.label}
          </span>
        ))}
      </div>

      {/* Grid of FAQ Cards */}
      <section className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Frequent Questions (8 Topics)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => {
            const cat = CATEGORIES[faq.category];
            const Icon = faq.icon;
            const isActive = activeQuestion === faq.q;
            return (
              <button
                key={index}
                onClick={() => handleAskQuestion(faq.q)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-dark-card border-dark-border hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`p-1.5 rounded-xl border ${cat.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{faq.q}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {faq.a.split('\n')[0]}
                </p>
              </button>
            );
          })}
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
            id="learn-custom-question"
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
          <div className="relative bg-dark-card border border-blue-500/20 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl bg-gradient-to-br from-blue-950/20 to-dark-card">
            <div className="flex items-center gap-2 border-b border-dark-border pb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-bold text-white">
                {activeQuestion ? `"${activeQuestion}"` : "AI Insights Answer"}
              </h4>
            </div>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {answer}
            </div>
            {error && (
              <p className="text-[10px] text-amber-500 border-t border-dark-border pt-3">{error}</p>
            )}
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}
      </section>

    </div>
  );
}
