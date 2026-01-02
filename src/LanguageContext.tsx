import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const navigate = useNavigate();
  const location = useLocation();

  // Detect user language and location on mount
  useEffect(() => {
    // Check if URL has /sv path
    if (location.pathname.startsWith('/sv')) {
      setLanguageState('sv');
      return;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('sv')) {
      // Check if user is in Sweden (using timezone as proxy)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Stockholm') || timezone.includes('Europe/Stockholm')) {
        navigate('/sv', { replace: true });
        setLanguageState('sv');
        return;
      }
    }

    // Default to English
    setLanguageState('en');
  }, [location.pathname, navigate]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'sv' && !location.pathname.startsWith('/sv')) {
      navigate('/sv' + location.pathname);
    } else if (lang === 'en' && location.pathname.startsWith('/sv')) {
      navigate(location.pathname.replace('/sv', '') || '/');
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

