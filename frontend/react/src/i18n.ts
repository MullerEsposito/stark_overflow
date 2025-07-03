import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    ns: ["common", "home", "forum", "question", "answer"],
    defaultNS: "common",
  });

i18n.on('languageChanged', (lng) => {
  moment.locale(lng);
});


moment.locale(i18n.language);
export default i18n;