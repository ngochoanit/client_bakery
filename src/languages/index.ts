import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en';
import viTranslation from './locales/vi';
import { enNamespace, viNamespace } from './config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      [enNamespace]: {
        translation: enTranslation,
      },
      [viNamespace]: {
        translation: viTranslation,
      },
    },
    fallbackLng: enNamespace,
    interpolation: {
      escapeValue: false,
    },
    nsSeparator: ':::',
    keySeparator: '::',
  });

export default i18n;
