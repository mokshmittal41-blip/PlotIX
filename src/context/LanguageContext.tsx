import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  TRANSLATIONS, 
  type Language, 
  type TranslationDict,
  translatePropertyType as rawTranslatePropertyType,
  translateFacing as rawTranslateFacing,
  translateUnit as rawTranslateUnit,
  translateIntent as rawTranslateIntent,
  translateDocStatus as rawTranslateDocStatus,
  translateCategory as rawTranslateCategory
} from '../translations/translations';

export function detectDeviceLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const navLangs = navigator.languages || (navigator.language ? [navigator.language] : []);
    for (const lang of navLangs) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower.startsWith('pa') || lower.includes('panjabi') || lower.includes('punjabi') || lower.includes('guru')) {
        return 'pa';
      }
      if (lower.startsWith('hi') || lower.includes('hindi') || lower.includes('deva')) {
        return 'hi';
      }
      if (lower.startsWith('en')) {
        return 'en';
      }
    }
  }
  return 'en';
}

interface LanguageContextType {
  language: Language;
  detectedLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  isHindi: boolean;
  isPunjabi: boolean;
  translateType: (type: string) => string;
  translateFacing: (facing: string) => string;
  translateUnit: (unit: string) => string;
  translateIntent: (intent: string) => string;
  translateDocStatus: (status: string) => string;
  translateCategory: (category: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'propwise_user_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [detectedLanguage] = useState<Language>(() => detectDeviceLanguage());

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'pa' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return detectDeviceLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const translateType = useCallback((type: string) => rawTranslatePropertyType(type, language), [language]);
  const translateFacing = useCallback((facing: string) => rawTranslateFacing(facing, language), [language]);
  const translateUnit = useCallback((unit: string) => rawTranslateUnit(unit, language), [language]);
  const translateIntent = useCallback((intent: string) => rawTranslateIntent(intent, language), [language]);
  const translateDocStatus = useCallback((status: string) => rawTranslateDocStatus(status, language), [language]);
  const translateCategory = useCallback((cat: string) => rawTranslateCategory(cat, language), [language]);

  const value: LanguageContextType = {
    language,
    detectedLanguage,
    setLanguage,
    t: TRANSLATIONS[language] || TRANSLATIONS.en,
    isHindi: language === 'hi',
    isPunjabi: language === 'pa',
    translateType,
    translateFacing,
    translateUnit,
    translateIntent,
    translateDocStatus,
    translateCategory,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

