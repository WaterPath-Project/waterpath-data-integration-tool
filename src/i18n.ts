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
            expandAll: "Expand all",
            collapseAll: "Collapse all",
            noSelectedAreas: "No areas selected!",
            alreadyExists: "Area already selected",
            alreadyExistsDescription: "You've already selected this area.",
            dropdown: {
              selectAll: "Select all",
            },
            miller: {
              level: "Level {{level}}",
              country: "Country",
              search: "Search...",
              noMatches: "No areas match your search",
              pickParent: "Select an item in the previous column",
            },
          },
          finetune: {
            title: "Preview data",
            subtitle:
              "Review the input data generated for your selection. Each category below lists the datasets you can download or preview.",
            downloadButton: "Download",
            uploadButton: "Upload",
            previewButton: "Preview",
            previewTitle: "CSV Preview",
            previewDescription: "This is a preview of the generated data in CSV format.",
            notAvailable: "Not available yet.",
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
          dataCategories: {
            human_emissions: {
              title: "Human emissions",
              description:
                "Data describing the human sources of pathogen emissions and the factors that determine how human excreta reaches soil and surface water.",
            },
            population: {
              title: "Population",
              description:
                "Defines the population in each reporting area and the share living in urban settings. It includes the proportion of children under five and the Human Development Index. These values determine the scale and spatial distribution of human emissions.",
            },
            sanitation: {
              title: "Sanitation",
              description:
                "Defines the mix of toilet facilities used by urban and rural populations. Services are summarized as safely managed, basic, unimproved, and open defecation. The facility mix controls how much human excreta is contained, treated, or released to soil and water.",
            },
            wastewater_treatment: {
              title: "Wastewater treatment",
              description:
                "Defines treated sewage and fecal sludge fractions by area, or individual treatment plant locations and capacities. It supports primary, secondary, tertiary, and quaternary treatment levels. Treatment choices determine the fraction of pathogens remaining in effluent before discharge.",
            },
            livestock_emissions: {
              title: "Livestock emissions",
              description:
                "Data describing livestock sources of pathogen emissions and the factors that determine how contaminated manure reaches land and surface water.",
            },
            manure_management: {
              title: "Manure management",
              description:
                "Defines the share of each animal group's manure assigned to storage, spreading, grazing, digestion, burning, and other systems. These management choices affect pathogen survival and the route by which manure reaches land and surface water.",
            },
            manure_fractions: {
              title: "Manure fractions",
              description:
                "Divides each animal group's manure between grazing and other land pathways for intensive and extensive production. These fractions determine how much manure reaches land directly and how much follows other routes to surface water.",
            },
            production_systems: {
              title: "Production systems",
              description:
                "Defines the share of each animal group raised in intensive and extensive systems. The production split changes where manure is concentrated and how livestock emissions enter the environment.",
            },
            concentrations: {
              title: "Concentrations",
              description:
                "Data used to model the transport, survival, and resulting concentrations of pathogens in surface water.",
            },
            hydrology: {
              title: "Hydrology",
              description:
                "Describes river discharge, surface runoff, river temperature, and solar radiation across the scenario. Discharge and runoff control dilution, downstream transport, and the movement of pathogens from land into rivers. Water temperature and solar radiation influence pathogen die-off and therefore the concentrations that remain in surface water.",
            },
            risk: {
              title: "Risk",
              description:
                "Data used to translate pathogen concentrations and human exposure into probabilities of infection.",
            },
            exposure_pathways: {
              title: "Exposure pathways",
              description:
                "Defines exposure pathways including drinking water, swimming, flooding, open drains, children's play, and clothes washing. It controls exposure frequency, ingested volume, drinking-water treatment, and boiling assumptions. These settings drive the quantitative microbial risk assessment calculation that converts pathogen concentrations into infection risk.",
            },
          },
        },
      },
    }
  });

export default i18n;
