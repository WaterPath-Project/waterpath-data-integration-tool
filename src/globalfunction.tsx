import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ✅ triggers CSS injection into JS

declare global {
  interface Window {
    dataIntegrationTool: (id: string) => void;
  }
}

export function registerGlobalFunction() {
  window.dataIntegrationTool = function (id: string) {
    const mountPoint = document.getElementById(id);

    if (!mountPoint) {
      console.error(`Element with id '${id}' not found.`);
      return;
    }

    // ✅ Create Shadow DOM
    const shadowRoot = mountPoint.attachShadow({ mode: "open" });

    // ✅ Copy injected Tailwind <style> from <head> into Shadow DOM
    document.querySelectorAll("style").forEach((styleTag) => {
      shadowRoot.appendChild(styleTag.cloneNode(true));
    });

    // ✅ Create container for React inside shadow root
    const shadowContainer = document.createElement("div");
    shadowRoot.appendChild(shadowContainer);

    // ✅ Render React app
    ReactDOM.createRoot(shadowContainer).render(<App />);
  };
}