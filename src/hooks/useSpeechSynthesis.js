import { useState, useEffect, useRef } from 'react';

export const useSpeechSynthesis = (options) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const lang = typeof options === 'string' ? options : (options?.lang || 'en-US');

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (window.speechSynthesis) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 250);

    return () => {
      clearInterval(checkInterval);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text, speakOptions = {}) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    const speakLang = speakOptions?.lang || lang;

    window.speechSynthesis.cancel();

    if (!text) return;

    // Clean text from markdown patterns, section markers (e.g. "1. Emotional support:"), and asterisk stars
    const cleanText = text
      .replace(/[*#_`~]/g, '') // Remove markdown styles
      .replace(/\[.*?\]/g, '') // Remove tags in brackets
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbers like "1. " at start of lines
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speakLang;
    utteranceRef.current = utterance;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      // Ignore 'interrupted' errors caused by calling cancel() manually
      if (e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
      }
      setIsSpeaking(false);
    };

    // Fetch and assign standard voices
    let voices = window.speechSynthesis.getVoices();
    
    const setVoice = () => {
      voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        v => v.lang.toLowerCase() === speakLang.toLowerCase()
      ) || voices.find(
        v => v.lang.toLowerCase().startsWith(speakLang.split('-')[0].toLowerCase())
      ) || voices.find(
        v => v.lang.startsWith('en')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    };

    setVoice();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    speak,
    stop
  };
};
