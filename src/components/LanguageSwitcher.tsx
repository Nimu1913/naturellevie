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
        className="text-steel-300 hover:text-steel-100 transition-colors p-2"
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M11 3.055V5a2 2 0 002 2h1a2 2 0 002 2v2.945M21 12.945V11a2 2 0 00-2-2h-1a2 2 0 00-2-2V5.055M12.945 21H11a2 2 0 01-2-2v-1a2 2 0 00-2-2 2 2 0 01-2-2H3.055M12 3.055V5a2 2 0 012 2h1a2 2 0 012 2v2.945" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-obsidian-800 border border-crystal-edge/30 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => handleLanguageSelect('en')}
            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
              language === 'en'
                ? 'bg-obsidian-700 text-steel-100'
                : 'text-steel-300 hover:bg-obsidian-700/50 hover:text-steel-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span>English</span>
            </div>
          </button>
          <button
            onClick={() => handleLanguageSelect('sv')}
            className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-crystal-edge/10 ${
              language === 'sv'
                ? 'bg-obsidian-700 text-steel-100'
                : 'text-steel-300 hover:bg-obsidian-700/50 hover:text-steel-100'
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

