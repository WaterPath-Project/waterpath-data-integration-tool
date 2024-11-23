import { PropsWithChildren } from "react";

export const PageContainer = ({ children }: PropsWithChildren) => (
  <div className="container mx-auto max-w-[1080px]">{children}</div>
);
