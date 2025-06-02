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
            "home": "Prepare input data",
            "areas": "Specify areas",
            "finetune": "Preview data",
          },
          glowpa: {
            title: "Get the model",
            subtitle:
              "Get the GloWPa model code by clicking on \"Download GloWpa\". Access guidelines about how to use it by clicking on the \"Open modelling guidelines\" button. Use the wizard below to prepare input data that match your particular use case.",
            download: "Download GloWPa",
            documentation: "Open modelling guidelines",
          },
          loader: {
            generateCountriesData: "Generating country data...",
            generateAreasData: "Generating area data...",
            loadingAllTheAreas: "Loading areas...",
            finishProcess: "Finishing packaging...",
          },
          customizeModel: {
            title: "Prepare input data",
            subtitle:
              "The current version of GloWPa allows overriding data for the following categories:",
            simulate: "",
            livestockEmissions: "Livestock Emissions",
            concentrations: "Concentrations",
            emissions: "Human Emissions",
            risk: "Risk",
            countriesOfInterest: "Set the geographic resolution for your simulation:",
            selectCountries: "Select one or more countries...",
            specificAreas: "Specific Areas",
            entireCountries: "Entire Countries",
            adminstrativeLevelsTitle: "Administrative Level",
            adminstrativeLevelsSubtitle:
              "The maximum level allowed is based on the data available for your country selection.",
            adminstrativeLevels: {
              level1: "Level 1",
              level2: "Level 2",
              level3: "Level 3",
              level4: "Level 4",
              level5: "Level 5",
            },
            nextStepCountriesButton: "Next step: Preview input data",
            nextStepAreasButton: "Next step: Specify areas",
            errorMessage: "Oops! Something went wrong. Please try again.",
            successMessage:
              "Success! You can now preview the generated data.",
          },
          areaSelector: {
            addButton: "Add new area",
            title: "Select specific areas",
            selectedAreasTitle: "Selected areas",
            noSelectedAreas: "No areas selected!",
            alreadyExists: "Area already selected",
            alreadyExistsDescription: "You've already selected this area.",
            dropdown: {
              selectAll: "Select all",
            }
          },
          finetune: {
            title: "Human emissions",
            downloadButton: "Download",
            uploadButton: "Upload",
            previewButton: "Preview",
            previewTitle: "CSV Preview",
            previewDescription: "This is a preview of the generated data in CSV format.",
            finishButton: "Finish",
            errorMessage: "Oops! Something went wrong. Please try again.",
            successMessage:
              "Success! You can now use the session data.",
          },
          success: {
            backHomeButton: "Download again",
            documentationButton: "View instructions",
            thanks: "You have generated your GloWPa input data successfully!",
            instructions: "Check the downloaded file and use the instructions below on how to use it with the model code."
          },
          documentation: {
            treatment: {
              smallTitle: "Treatment",
              bigTitle: "Wastewater Treatment facilities",
              description: "Data about treatment facilities location, capacity and type across selected areas.",

            },
            sanitation: {
              smallTitle: "Sanitation",
              bigTitle: "Sanitation Systems",
              description: "Data on sanitation systems and their urban/rural distribution across selected areas.",
            },
            population: {
              smallTitle: "Population",
              bigTitle: "Demographic Data Overview",
              description: "Data on population size, urban/rural distribution, and demographics relevant to your use case.",
            }
          },
        },
      },
    }
  });

export default i18n;
