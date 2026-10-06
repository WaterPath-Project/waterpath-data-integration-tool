import React from "react";
import { Route, Routes } from "react-router";
import { Home, NotFound, Finetune, Success, Areas } from "./components/pages";

/** The wizard steps. Rendered inside whichever router `DataIntegrationTool` was given. */
export function WizardRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/areas" element={<Areas />} />
      <Route path="/finetune/:session_id?" element={<Finetune />} />
      <Route path="/success/:session_id?" element={<Success />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
