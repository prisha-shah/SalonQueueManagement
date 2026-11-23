import React, { createContext, useContext, useState, useEffect } from 'react';
import { DICTIONARY } from '../locales/dictionary';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('velora_lang') || localStorage.getItem('luxe_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [darkMode, setDarkModeState] = useState(() => {
    try {
      return (localStorage.getItem('velora_dark') || localStorage.getItem('luxe_dark')) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('velora_lang', lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_dark', darkMode ? 'true' : 'false');
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleLanguage = () => {
    setLangState(prev => (prev === 'en' ? 'gu' : 'en'));
  };

  const toggleDarkMode = () => {
    setDarkModeState(prev => !prev);
  };

  const t = (key, params = {}) => {
    const dict = DICTIONARY[lang] || DICTIONARY.en;
    let text = dict[key] || DICTIONARY.en[key] || key;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(pKey => {
        text = text.replace(new RegExp(`{${pKey}}`, 'g'), params[pKey]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, toggleLanguage, darkMode, toggleDarkMode, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
