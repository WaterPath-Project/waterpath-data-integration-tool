import { initReactI18next } from "react-i18next";
import i18n from "i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    resources: {
      en: {
        translation: {
          button: "Click me!",
          title: "Are you sure?",
          description:
            "This action cannot be undone. This will permanently delete youraccount and remove your data from our servers.",
          cancel: "Cancel",
          continue: "Continue",
        },
      },
    },
  });

export default i18n;
