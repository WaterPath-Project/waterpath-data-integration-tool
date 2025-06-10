import RiveComponent from "@rive-app/react-canvas";
import loaderRiv from "@/components/assets/animations/loader.riv";
import * as React from "react"

/**
 * A full-screen overlay loader component that displays a semi-transparent background
 * and a centered message. Typically used to indicate loading states that block user interaction.
 *
 * @component
 * @param { message: string } - The props for the Loader component.
 *
 * @example
 * <Loader message="Loading areas..." />
 */
export function Loader({ message }: Readonly<{ message: string }>): React.ReactElement {
  return (
    <div className="fixed  inset-0 z-50 bg-wpBlue-900 bg-opacity-80 flex flex-col items-center justify-center">
      <div className="w-80 h-80 ">
        <RiveComponent src={loaderRiv} />
      </div>
      <span className="text-wpGreen-900 text-xl font-semibold w-80 text-center">
        {message}
      </span>
    </div>
  );
}
