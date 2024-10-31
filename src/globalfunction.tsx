import ReactDOM from "react-dom/client";
import App from "./App";

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
