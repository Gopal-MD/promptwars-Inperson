// Language preferences and configurations for RecoverAI

export const SUPPORTED_LANGUAGES = {
  en: { label: 'English', speechLang: 'en-US' },
  hi: { label: 'Hindi', speechLang: 'hi-IN' },
  ta: { label: 'Tamil', speechLang: 'ta-IN' },
  te: { label: 'Telugu', speechLang: 'te-IN' }
};

export const detectDefaultLanguage = () => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  const prefix = browserLang.split('-')[0].toLowerCase();
  if (SUPPORTED_LANGUAGES[prefix]) {
    return prefix;
  }
  return 'en';
};
