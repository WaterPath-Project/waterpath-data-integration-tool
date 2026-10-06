import React from "react";

export const PORTAL_CONTAINER_CLASS = "wp-dit wp-dit-portal";

const PortalContainerContext = React.createContext<HTMLElement | undefined>(undefined);

/**
 * Creates a `div.wp-dit` under `document.body` and exposes it through context.
 *
 * Radix dialogs, popovers and selects portal to `document.body` by default, which
 * would put them outside the `.wp-dit` scope that carries all of the tool's styles.
 * Rendering them into this container keeps them styled and keeps `position: fixed`
 * relative to the viewport, regardless of transforms on the host page's layout.
 *
 * The container is created in an effect, so nothing touches the DOM during SSR.
 */
export function PortalContainerProvider({ children }: Readonly<React.PropsWithChildren>) {
  const [container, setContainer] = React.useState<HTMLElement>();

  React.useEffect(() => {
    const el = document.createElement("div");
    el.className = PORTAL_CONTAINER_CLASS;
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      el.remove();
    };
  }, []);

  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}

/** Element that Radix portals should render into, or `undefined` before mount (falls back to `document.body`). */
// eslint-disable-next-line react-refresh/only-export-components
export function usePortalContainer(): HTMLElement | undefined {
  return React.useContext(PortalContainerContext);
}
