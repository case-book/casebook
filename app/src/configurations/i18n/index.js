import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from '@/configurations/i18n/locales/ko/translation.json';
import en from '@/configurations/i18n/locales/en/translation.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'ko',
  lng: 'ko',
  debug: process.env.NODE_ENV !== 'production',
  resources: {
    ko: {
      translation: ko,
    },
    en: {
      translation: en,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
