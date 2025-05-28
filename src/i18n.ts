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
          breadcrumb: {
            "home": "Home",
            "areas": "Areas",
            "finetune": "Finetune",
          },
          glowpa: {
            title: "GloWPa version",
            subtitle:
              "Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a.",
            button: "Download GloWPa",
          },
          loader: {
            generateCountriesData: "Generate country data...",
            generateAreasData: "Generate area data...",
            loadingAllTheAreas: "Loading all areas",
          },
          customizeModel: {
            title: "Customize Model",
            subtitle:
              "Version 1.0 of GloWPa includes the following data sources.",
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
            alreadyExists: "Area already added",
            alreadyExistsDescription: "You've already selected this area."
          },
          finetune: {
            title: "Human emissions",
            downloadButton: "Download",
            uploadButton: "Upload",
            previewButton: "Preview",
            previewTitle: "CSV Preview",
            previewDescription: "This is a preview of the data in the CSV file.",
            finishButton: "Finish",
          },
          documentation: {
            treatment: {
              smallTitle: "Treatment",
              bigTitle: "Wastewater Treatment Documentation",
              description: "Review reports and technical documentation about treatment plants, methods, and performance indicators.",

            },
            sanitation: {
              smallTitle: "Sanitation",
              bigTitle: "Understanding Local Sanitation Systems",
              description: "Explore detailed documentation about wastewater and sanitation infrastructure across selected regions.",
            },
            population: {
              smallTitle: "Population",
              bigTitle: "Demographic Data Overview",
              description: "Access information about population distribution, density, and demographic trends relevant to your study.",
            }
          },
        },
      },
    }
  });

export default i18n;
