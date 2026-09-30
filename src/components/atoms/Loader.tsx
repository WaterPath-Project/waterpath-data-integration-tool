import RiveComponent from "@rive-app/react-canvas";
import loaderRiv from "@/components/assets/animations/loader.riv";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * A full-screen overlay loader component that displays a semi-transparent background
 * and a centered message. Typically used to indicate loading states that block user interaction.
 *
 * @component
 * @param { message: string, className?: string } - The props for the Loader component.
 *   `className` lets callers raise the z-index when the loader must sit above a dialog.
 *
 * @example
 * <Loader message="Loading areas..." />
 */
export function Loader({ message, className }: Readonly<{ message: string; className?: string }>): React.ReactElement {
  return (
    <div className={cn("fixed inset-0 z-50 bg-wpBlue-900 bg-opacity-80 flex flex-col items-center justify-center", className)}>
      <div className="w-80 h-80 ">
        <RiveComponent src={loaderRiv} />
      </div>
      <span className="text-wpGreen-900 text-xl font-semibold w-80 text-center">
        {message}
      </span>
    </div>
  );
}
