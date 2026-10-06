import React from "react";
import { BrowserRouter, HashRouter, MemoryRouter, useLocation, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { I18nextProvider } from "react-i18next";
import classNames from "classnames";
import { CountriesProvider } from "./context/CountriesProvider";
import { PortalContainerProvider } from "./context/PortalContainerProvider";
import { configureApi, DEFAULT_API_BASE_URL } from "./api";
import { WizardRoutes } from "./routes";
import i18n from "./i18n";
import "./index.css";

/**
 * How the wizard keeps its current step.
 *
 * - `"hash"` (default when embedded): steps live in `location.hash` (`#/areas`,
 *   `#/finetune/<id>`). The host's own path-based router never sees them, while refresh,
 *   back/forward and deep links keep working.
 * - `"memory"`: steps are kept in memory only and never touch the page URL.
 * - `"browser"`: path-based routing with a `basename`; for the standalone site only.
 */
export type DataIntegrationToolRouter = "hash" | "memory" | "browser";

export type DataIntegrationToolProps = {
  /** Origin of the WaterPath backend, without a trailing slash. Defaults to the development backend. */
  apiBaseUrl?: string;
  /**
   * Opens the tool directly on the "Preview data" step for an existing session instead of
   * the first step. Useful for resuming from a host link such as `?session=<id>`.
   */
  initialSessionId?: string;
  /** Router strategy, see {@link DataIntegrationToolRouter}. Defaults to `"hash"`. */
  router?: DataIntegrationToolRouter;
  /** Base path for the `"browser"` router. */
  basename?: string;
  /** Extra classes for the element wrapping the wizard (inside the `.wp-dit` scope). */
  className?: string;
};

/** With hash/browser routing the URL is the source of truth; only redirect when it is still at the start. */
function OpenInitialSession({ sessionId }: Readonly<{ sessionId?: string }>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  React.useEffect(() => {
    if (sessionId && pathname === "/") {
      navigate(`/finetune/${sessionId}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/**
 * WaterPath Data Integration Tool as a self-contained React component.
 *
 * Drop it into any React 18+ tree (Gatsby, Next.js, Vite, ...). It brings its own router,
 * data-fetching cache, translations, toasts and portal container, and only needs React
 * from the host. Import the stylesheet once from `waterpath-data-integration-tool/style.css`;
 * every rule in it is scoped to the tool's `.wp-dit` root, so it cannot restyle the host and
 * the host's utility classes cannot restyle it.
 *
 * The tool renders maps (Leaflet, MapLibre), so it must be mounted in a browser. Hosts that
 * pre-render pages should render it after mount (see the README).
 *
 * @example
 * <DataIntegrationTool apiBaseUrl="https://api.example.org" initialSessionId={sessionFromUrl} />
 */
export function DataIntegrationTool({
  apiBaseUrl = DEFAULT_API_BASE_URL,
  initialSessionId,
  router = "hash",
  basename,
  className,
}: Readonly<DataIntegrationToolProps>): React.JSX.Element {
  // Must happen before any child runs its first query, so it cannot live in an effect.
  configureApi(apiBaseUrl);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [initialEntries] = React.useState(() => [
    initialSessionId ? `/finetune/${initialSessionId}` : "/",
  ]);

  const content = (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
      <PortalContainerProvider>
        <CountriesProvider>
          {router !== "memory" && <OpenInitialSession sessionId={initialSessionId} />}
          <WizardRoutes />
          <Toaster richColors />
        </CountriesProvider>
      </PortalContainerProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );

  return (
    // Utilities are generated as `.wp-dit .class`, so the scope element itself carries no
    // utility classes; `className` goes on the inner element where they apply.
    <div className="wp-dit">
      <div className={classNames("wp-dit-root", className)}>
        {router === "memory" ? (
          <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
        ) : router === "browser" ? (
          <BrowserRouter basename={basename}>{content}</BrowserRouter>
        ) : (
          <HashRouter>{content}</HashRouter>
        )}
      </div>
    </div>
  );
}

export default DataIntegrationTool;
