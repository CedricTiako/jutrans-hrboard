import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [animateFlag, setAnimateFlag] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  useEffect(() => {
    // Update current language when i18n language changes
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      setAnimateFlag(true);
      
      // Change the language
      i18n.changeLanguage(languageCode);
      
      // Save preference in localStorage
      localStorage.setItem('jutrans-language', languageCode);
      
      // Update document lang attribute
      document.documentElement.lang = languageCode;
      
      // Add visual feedback
      document.body.classList.add('language-changed');
      setTimeout(() => {
        document.body.classList.remove('language-changed');
        setAnimateFlag(false);
      }, 1000);
    }
    setIsOpen(false);
  };

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

  return (
    <div className="relative language-selector" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${animateFlag ? 'language-switch-animation' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
        <span className={`text-base sm:text-lg ${animateFlag ? 'animate-bounce' : ''}`}>
          {languages.find(lang => lang.code === currentLanguage)?.flag || '🌐'}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-[9999] mt-1 sm:mt-2 w-40 sm:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up">
          <div className="py-1">
            <div className="px-2 py-1 sm:px-3 sm:py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
              {i18n.language === 'fr' ? 'Choisir la langue' : 'Select Language'}
            </div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-left hover:bg-gray-100 transition-colors ${
                  currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;