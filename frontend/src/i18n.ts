import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationDE from './locales/de/translation.json';
import translationEN from './locales/en/translation.json';
import availabilityDE from './locales/de/availability.json';
import availabilityEN from './locales/en/availability.json';
import placeDE from './locales/de/place.json';
import placeEN from './locales/en/place.json';

// the translations
const resources = {
  de: {
    translation: translationDE,
    availability: availabilityDE,
    place: placeDE
  },
  en: {
    translation: translationEN,
    availability: availabilityEN,
    place: placeEN
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'de', // default language
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
