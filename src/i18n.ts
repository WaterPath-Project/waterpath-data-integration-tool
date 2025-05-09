import { initReactI18next } from "react-i18next";
import i18n from "i18next";

/**
 * Initializes and configures the i18n instance for internationalization support in a React application.
 *
 * - Integrates `i18next` with `react-i18next` for seamless usage in React components.
 * - Sets the default language to English (`en`) and specifies English as the fallback language.
 * - Disables escaping for interpolation, as React handles XSS safety natively.
 *
 * @module i18n
 * @see https://www.i18next.com/
 */
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
          header: {
            title: "Model",
            subtitle: "WATERPATH TOOLKIT",
          },
          glowpa: {
            title: "GloWPa version",
            subtitle:
              "Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a.",
          },
          customizeModel: {
            title: "Customize Model",
            subtitle:
              "Version 1.0 of GloWPa includes the following data sources. Customize it to fit your needs.",
            simulate: "Simulate",
            livestockEmissions: "Livestock Emissions",
            concentrations: "Concentrations",
            emissions: "Human Emissions",
            risk: "Risk",
            countriesOfInterest: "Countries of Interest",
            selectCountries: "Select countries...",
            specificAreas: "Specific Areas",
            entireCountries: "Entire Countries",
            adminstrativeLevelsTitle: "Administrative Level",
            adminstrativeLevelsSubtitle:
              "Based on the combination of countries you have selected.",
            adminstrativeLevels: {
              level1: "Level 1",
              level2: "Level 2",
              level3: "Level 3",
              level4: "Level 4",
              level5: "Level 5",
            },
            nextStepCountriesButton: "Next step: Finetune sources",
            nextStepAreasButton: "Next step: Select specific areas",
            errorMessage: "Oups! Something went wrong. Please try again.",
            successMessage:
              "Success! The data has been generated. You can now finetune the sources.",
          },
          areaSelector: {
            addButton: "Add new area",
            title: "Select specific areas",
            selectedAreasTitle: "Selected areas",
            noSelectedAreas: "No areas selected!",
          }
        },
      },
    },
  });

export default i18n;
