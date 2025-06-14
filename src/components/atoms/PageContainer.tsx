import React from "react";

/**
 * A React functional component that provides a styled container for page content.
 *
 * @param {React.ReactNode} children - The child elements to be rendered inside the container.
 * @returns {JSX.Element} A styled container wrapping the provided child elements.
 */
export const PageContainer = ({ children }: React.PropsWithChildren) => (
  <div className="container mx-auto max-w-[1280px] flex flex-col mb-20">
    {children}
  </div>
);
