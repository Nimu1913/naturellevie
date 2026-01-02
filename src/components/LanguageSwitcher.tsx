import { useLanguage } from '../LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-crystal-edge/30 bg-obsidian-800/50 hover:bg-obsidian-800/70 transition-colors text-steel-300 hover:text-steel-100"
      aria-label="Switch language"
    >
      <span className="text-lg">{language === 'en' ? '🇸🇪' : '🇬🇧'}</span>
      <span className="text-sm font-mono uppercase">{language === 'en' ? 'SV' : 'EN'}</span>
    </button>
  );
};

