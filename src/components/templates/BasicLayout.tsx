import React from "react";
import { Header } from "../organisms";
import { PageContainer } from "../atoms";

/**
 * A React functional component that defines a basic page layout with a header and a styled container for content.
 *
 * @param {React.ReactNode} children - The content to be displayed within the layout, typically the main page content.
 * @returns {JSX.Element} The rendered layout containing a header and child content inside a styled container.
 */
export function BasicLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <PageContainer>
      <Header />
      {children}
    </PageContainer>
  );
}
