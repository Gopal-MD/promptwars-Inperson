import React, { createContext, useContext, useState } from 'react';
import { detectDefaultLanguage } from '../utils/language';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('recoverai_language') || detectDefaultLanguage();
  });

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('recoverai_language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'en', changeLanguage: () => {} };
  }
  return context;
};
