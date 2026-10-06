import { createRoot } from "react-dom/client";
import { DataIntegrationTool, type DataIntegrationToolRouter } from "./DataIntegrationTool";

export type DataIntegrationToolOptions = {
  /** Origin of the WaterPath backend, without a trailing slash. */
  apiBaseUrl?: string;
  /** Reopen an existing session on the "Preview data" step. */
  sessionId?: string;
  /** `"hash"` (default) keeps the step in the URL hash; `"memory"` never touches the URL. */
  router?: Exclude<DataIntegrationToolRouter, "browser">;
};

declare global {
  interface Window {
    /** Mounts the tool into the element with the given id and returns a function that unmounts it. */
    dataIntegrationTool: (id: string, options?: DataIntegrationToolOptions) => (() => void) | undefined;
  }
}

/**
 * Script-tag entry for non-React hosts. All styles are scoped to the `.wp-dit` root the
 * component renders, so it mounts straight into the page without a Shadow DOM.
 */
export function registerGlobalFunction() {
  window.dataIntegrationTool = function (id, options = {}) {
    const mountPoint = document.getElementById(id);
    if (!mountPoint) {
      console.error(`Element with id '${id}' not found.`);
      return undefined;
    }
    const root = createRoot(mountPoint);
    root.render(
      <DataIntegrationTool
        apiBaseUrl={options.apiBaseUrl}
        initialSessionId={options.sessionId}
        router={options.router ?? "hash"}
      />
    );
    return () => root.unmount();
  };
}
