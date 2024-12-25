import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * Extends the global `Window` interface to include the `dataIntegrationTool` function.
 *
 * @property {Function} dataIntegrationTool - A global function that initializes a React app.
 * @param {string} id - The ID of the DOM element where the React app will be rendered.
 */
declare global {
  interface Window {
    dataIntegrationTool: (id: string) => void;
  }
}

export function registerGlobalFunction() {
  window.dataIntegrationTool = function (id: string) {
    ReactDOM.createRoot(document.getElementById(id) as HTMLElement).render(
      <App />
    );
  };
}
