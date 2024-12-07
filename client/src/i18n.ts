import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { InitOptions } from 'i18next';
import enTranslations from './locales/en.json';
import knTranslations from './locales/kn.json';

const resources = {
  en: {
    translation: enTranslations
  },
  kn: {
    translation: knTranslations
  }
};

const options: InitOptions = {
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
};

i18n
  .use(initReactI18next)
  .init(options);

export default i18n;
