import React from "react";
import { DataIntegrationTool } from "./DataIntegrationTool";

/**
 * Standalone site (`npm run dev`, GitHub Pages). Path-based routing under the Pages base
 * path; `?session=<id>` reopens an existing session on the "Preview data" step.
 */
function App(): React.JSX.Element {
  const session = new URLSearchParams(window.location.search).get("session") ?? undefined;
  return (
    <DataIntegrationTool
      router="browser"
      basename="/waterpath-data-integration-tool/"
      apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
      initialSessionId={session}
      className="min-h-screen bg-wpWhite"
    />
  );
}

export default App;
