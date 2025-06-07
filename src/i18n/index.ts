import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
};

// Configuration du détecteur de langue
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'customDetector',
  lookup: () => {
    // Priorité 1: Langue sauvegardée dans localStorage
    const savedLanguage = localStorage.getItem('jutrans-language');
    if (savedLanguage && ['fr', 'en'].includes(savedLanguage)) {
      console.log('Language from localStorage:', savedLanguage);
      return savedLanguage;
    }
    
    // Priorité 2: Langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'en'].includes(browserLang)) {
      console.log('Language from browser:', browserLang);
      return browserLang;
    }
    
    // Priorité 3: Langue par défaut
    console.log('Using default language: fr');
    return 'fr';
  },
  cacheUserLanguage: (lng) => {
    localStorage.setItem('jutrans-language', lng);
    console.log('Language cached:', lng);
  }
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['customDetector', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

// Mettre à jour l'attribut lang de l'élément HTML
const updateHtmlLang = (lng: string) => {
  document.documentElement.lang = lng;
  console.log('HTML lang updated to:', lng);
  
  // Ajouter une classe pour les animations CSS potentielles
  document.body.classList.add('language-changed');
  setTimeout(() => {
    document.body.classList.remove('language-changed');
  }, 1000);
};

// Initialiser la langue sur l'élément HTML
updateHtmlLang(i18n.language);

// Mettre à jour quand la langue change
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  updateHtmlLang(lng);
});

export default i18n;