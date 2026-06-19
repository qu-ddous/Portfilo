// frontend/src/components/LanguageSwitcher.jsx
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md transition-all font-semibold ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ur')}
        className={`px-3 py-1 rounded-md transition-all font-semibold ${
          language === 'ur'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        اردو
      </button>
    </div>
  );
}
