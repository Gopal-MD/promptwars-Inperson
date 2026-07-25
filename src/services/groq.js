// Groq API integration using native fetch requests

const getApiKey = () => {
  let key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) {
    key = localStorage.getItem('recoverai_temp_groq_api_key') || '';
  }
  return key;
};

export const hasApiKey = () => {
  return !!getApiKey();
};

export const saveTempApiKey = (key) => {
  if (key) {
    localStorage.setItem('recoverai_temp_groq_api_key', key);
  }
};

import { SUPPORTED_LANGUAGES } from '../utils/language';

export const clearTempApiKey = () => {
  localStorage.removeItem('recoverai_temp_groq_api_key');
};

const getLanguageInstruction = () => {
  const code = typeof localStorage !== 'undefined' ? (localStorage.getItem('recoverai_language') || 'en') : 'en';
  const langLabel = SUPPORTED_LANGUAGES[code]?.label || 'English';
  return `\nRespond entirely in ${langLabel}, but keep the [TAG] markers themselves in English exactly as specified.`;
};

const queryGroq = async (systemInstruction, userInput, temperature = 0.5, maxTokens = 800) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file or input it in the Settings.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userInput }
      ],
      temperature: temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
    throw new Error(`Groq API Error: ${errorMessage}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// -------------------------------------------------------------
// 1. RECOVERY ASSISTANT PARSING & CALLS
// -------------------------------------------------------------

export const parseRecoveryResponse = (text) => {
  const extractSection = (tag) => {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[[A-Z_]+\\]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const parsed = {
    emotionalSupport: extractSection('EMOTIONAL_SUPPORT'),
    immediateAction: extractSection('IMMEDIATE_ACTION'),
    safetyAdvice: extractSection('SAFETY_ADVICE'),
    encouragingMessage: extractSection('ENCOURAGING_MESSAGE'),
    educationalTip: extractSection('EDUCATIONAL_TIP'),
    raw: text
  };

  if (!parsed.emotionalSupport && !parsed.immediateAction) {
    parsed.emotionalSupport = text;
    parsed.immediateAction = "Take slow, deep breaths. Sit down in a comfortable place.";
    parsed.safetyAdvice = "If you are in danger of hurting yourself or others, please call 911 or reach out to your caregiver.";
    parsed.encouragingMessage = "You are taking a brave step by checking in right now. One moment at a time.";
    parsed.educationalTip = "Cravings are peak experiences that typically last only 10-15 minutes. You can ride them out.";
  }

  return parsed;
};

export const generateRecoveryGuidance = async (userInput, mood = 'neutral') => {
  const systemInstruction = `You are a compassionate, non-judgmental addiction recovery assistant.
Your goal is to provide calm, reassuring emotional support and practical coping mechanisms.
Never shame the user. Never encourage harmful behavior. Keep responses concise and easy to read.

You MUST respond using exactly the following format. Ensure each block begins with the tags [EMOTIONAL_SUPPORT], [IMMEDIATE_ACTION], [SAFETY_ADVICE], [ENCOURAGING_MESSAGE], and [EDUCATIONAL_TIP]:

[EMOTIONAL_SUPPORT]
Provide empathetic, soothing feedback acknowledging their current state (Mood: ${mood}). Let them feel heard and safe.

[IMMEDIATE_ACTION]
Give 1-2 small, concrete physical or grounding steps they can do right now (e.g., box breathing, counting objects, drinking water, stepping outside).

[SAFETY_ADVICE]
Outline a simple safety measure. If danger or high relapse risk is implied, strongly recommend contacting a trusted caregiver or calling local emergency services.

[ENCOURAGING_MESSAGE]
Offer a strong, positive, short affirmation about their recovery journey. Focus on hope and choice.

[EDUCATIONAL_TIP]
Share a scientific or psychological fact about craving management, triggers, or brain plasticity during recovery. Keep it simple.` + getLanguageInstruction();

  const text = await queryGroq(systemInstruction, userInput, 0.5, 800);
  return parseRecoveryResponse(text);
};

// -------------------------------------------------------------
// 2. CAREGIVER ASSISTANT PARSING & CALLS
// -------------------------------------------------------------

export const parseCaregiverResponse = (text) => {
  const extractSection = (tag) => {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[[A-Z_]+\\]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const parsed = {
    communication: extractSection('COMMUNICATION'),
    avoid: extractSection('AVOID'),
    reinforcement: extractSection('REINFORCEMENT'),
    warningSigns: extractSection('WARNING_SIGNS'),
    emergencyAdvice: extractSection('EMERGENCY_ADVICE'),
    raw: text
  };

  if (!parsed.communication && !parsed.avoid) {
    parsed.communication = text;
  }

  return parsed;
};

export const generateCaregiverAdvice = async (relationship, substance, context) => {
  const userPrompt = `My ${relationship} is recovering from ${substance || 'substance use'}. Here is additional context: "${context || 'Looking for supportive guidance.'}". Give me advice.`;

  const systemInstruction = `You are an expert recovery counselor supporting caregivers of individuals navigating substance use disorders.
Your task is to provide practical, empathetic, and actionable guidance for the caregiver.
You MUST format your response using exactly the following block tags:

[COMMUNICATION]
Actionable advice on how to talk to them, phrasing suggestions, and active listening tips.

[AVOID]
Specific behaviors, words, or reactions the caregiver should avoid to prevent escalating stress or shame.

[REINFORCEMENT]
Ways to offer positive reinforcement, encourage milestone celebrations, and support daily progress without being overbearing.

[WARNING_SIGNS]
Behavioral, physical, or emotional red flags to monitor for potential relapse.

[EMERGENCY_ADVICE]
Clear instructions on what to do if there is a crisis or active relapse.` + getLanguageInstruction();

  const text = await queryGroq(systemInstruction, userPrompt, 0.5, 1000);
  return parseCaregiverResponse(text);
};

// -------------------------------------------------------------
// 3. EMERGENCY SCRIPT GENERATOR
// -------------------------------------------------------------

export const generateEmergencyScript = async (caregiverName, relation, feeling, supportNeeded) => {
  const userPrompt = `Write a short SMS/message for my caregiver ${caregiverName} (${relation}). I am currently feeling: "${feeling}". I need them to do this for support: "${supportNeeded}".`;

  const systemInstruction = `You are a helper assisting someone in high-stress crisis.
Your job is to generate a simple, direct, personal emergency SMS/message.
The message MUST:
1. Be written from the user's perspective (using "I").
2. State clearly that they are struggling or experiencing high relapse risk/anxiety.
3. Explicitly ask for the support they need.
4. Urge the caregiver to call, text, or stay with them.
5. Keep the generated script under 5-6 sentences, clean, and direct so it is easy to send.
Only return the text of the message itself. Do not include subject lines, wrappers, quotes, or conversational introductions.` + getLanguageInstruction();

  return await queryGroq(systemInstruction, userPrompt, 0.6, 250);
};

// -------------------------------------------------------------
// 4. EDUCATIONAL FAQ AND Q&A
// -------------------------------------------------------------

export const generateEducationalAnswer = async (question) => {
  const systemInstruction = `You are an educational assistant specialized in neuroscience, psychology, and addiction recovery.
Provide clear, scientific yet easy-to-understand explanations.
Focus on destigmatizing addiction, explaining the biology of cravings (e.g. dopamine receptors, stress response), practical cognitive-behavioral tools, and withdrawal safety.
Ensure explanations are supportive and direct. Break paragraphs with bullet points for readability. Limit responses to 300 words.` + getLanguageInstruction();

  return await queryGroq(systemInstruction, question, 0.5, 600);
};
