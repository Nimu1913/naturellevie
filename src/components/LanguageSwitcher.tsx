import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (lang: 'en' | 'sv') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-charcoal-500 hover:text-sage-400 transition-colors p-2"
        aria-label="Select language"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-linen-300 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => handleLanguageSelect('en')}
            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
              language === 'en'
                ? 'bg-sage-100 text-sage-600'
                : 'text-charcoal-500 hover:bg-linen-100 hover:text-sage-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span>English</span>
            </div>
          </button>
          <button
            onClick={() => handleLanguageSelect('sv')}
            className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-linen-300 ${
              language === 'sv'
                ? 'bg-sage-100 text-sage-600'
                : 'text-charcoal-500 hover:bg-linen-100 hover:text-sage-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🇸🇪</span>
              <span>Svenska</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

