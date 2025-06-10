import React from "react";
import { CustomizeModel, GloWPaVersion } from "../organisms";
import { BasicLayout } from "../templates";

export function Home(): React.JSX.Element {
  return (
    <BasicLayout>
      <div className="flex flex-col gap-8">
        <GloWPaVersion />
        <CustomizeModel />
      </div>
    </BasicLayout>
  );
}
