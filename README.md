# WaterPath Data Integration Tool

The wizard that prepares GloWPa input data, packaged as an **embeddable React component**.
It brings its own router, data cache, translations, toasts and maps, and needs only React from
the host. All of its CSS is scoped to the element it renders, so it neither restyles the host
page nor gets restyled by it.

## Builds

| Command                 | Output                                  | Use                                                                 |
| ----------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `npm run build`         | `dist/` (ESM, CJS, `style.css`, types)  | The npm package consumed by React sites (the WaterPath website). Also run by `prepare`, so installing from git builds it. |
| `npm run build:ghpages` | `dist-ghpages/`                         | Standalone site deployed to GitHub Pages (`npm run dev` serves it). |
| `npm run build:embed`   | `dist-embed/data-integration-tool.js`   | Single script for pages that are not React apps.                    |

Every build first bundles the MapLibre web worker into `src/generated/` (`scripts/build-worker.mjs`).

## Use in a React site

```sh
npm install github:WaterPath-Project/waterpath-data-integration-tool#vX.Y.Z
# while developing both projects side by side:
npm install ../waterpath-data-integration-tool
```

```tsx
import { DataIntegrationTool } from "waterpath-data-integration-tool";
import "waterpath-data-integration-tool/style.css";

<DataIntegrationTool
  apiBaseUrl="https://dev.waterpath.venthic.com"   // optional, this is the default
  initialSessionId={sessionIdFromYourUrl}            // optional: open the "Preview data" step
/>
```

The tool renders Leaflet/MapLibre maps, so it has to be mounted in a browser. In a framework
that pre-renders pages (Gatsby, Next.js) load it after mount:

```jsx
// Gatsby: src/pages/model.js
import * as React from "react";
import "waterpath-data-integration-tool/style.css";

const DataIntegrationTool = React.lazy(() => import("waterpath-data-integration-tool"));

export default function ModelPage({ location }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const session = new URLSearchParams(location.search).get("session") ?? undefined;

  return mounted ? (
    <React.Suspense fallback={null}>
      <DataIntegrationTool apiBaseUrl={process.env.GATSBY_WATERPATH_API_URL} initialSessionId={session} />
    </React.Suspense>
  ) : null;
}
```

### Props

| Prop               | Type                              | Default                             | Description                                                  |
| ------------------ | --------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `apiBaseUrl`       | `string`                          | `https://dev.waterpath.venthic.com` | Origin of the WaterPath backend, no trailing slash.          |
| `initialSessionId` | `string`                          | –                                   | Start on the "Preview data" step for an existing session.    |
| `router`           | `"hash" \| "memory" \| "browser"` | `"hash"`                            | How the wizard step is kept, see below.                      |
| `basename`         | `string`                          | –                                   | Base path for the `"browser"` router (standalone site only). |
| `className`        | `string`                          | –                                   | Extra classes for the element wrapping the wizard.           |

### Routing

The wizard has steps (`/`, `/areas`, `/finetune/:session`, `/success/:session`) and uses its
own copy of react-router, bundled into the package, so it can never conflict with the host's
router, whatever that is (Gatsby's reach-router, react-router, Next.js…).

- **`hash`** (default) keeps the step in `location.hash`: `/model#/areas`,
  `/model#/finetune/<id>`. The host's path-based router ignores the hash, while refresh,
  back/forward and deep links to a step keep working.
- **`memory`** keeps the step in memory and never touches the page URL.
- **`browser`** is path-based routing under `basename`, used by the standalone site.

### Styling

- Tailwind utilities are generated as `.wp-dit .class` (`important: ".wp-dit"` in
  `tailwind.config.js`) and the global preflight is replaced by a reset scoped under `.wp-dit`
  (`src/index.css`). The stylesheet only applies inside the tool and, inside it, beats the
  host's own utility classes by specificity. Dialogs, popovers and selects render into a
  `.wp-dit` portal container so they stay styled too.
- The stylesheet expects the **Inter** and **Outfit** fonts from the host (the WaterPath site
  self-hosts them); the standalone `index.html` loads them from Google Fonts.
- The tool has no page background of its own. Wrap it in the background you want
  (the WaterPath light shade is `#F6F9FB`).
- The MapLibre web worker is bundled into the package and registered at runtime, so no extra
  asset files are needed whatever bundler the host uses.

## Use on a non-React page (script tag)

```sh
npm run build:embed
```

Copy `dist-embed/data-integration-tool.js` to your site, then:

```html
<script src="data-integration-tool.js"></script>
<div id="root"></div>
<script>
  const unmount = dataIntegrationTool("root", {
    apiBaseUrl: "https://dev.waterpath.venthic.com", // optional
    sessionId: undefined,                            // optional
    router: "hash",                                  // or "memory"
  });
</script>
```

`html/index.html` is a minimal test page for this build.

## Releasing

How a change gets to production (rules to respect, testing inside the website, versioning and
tagging, updating the site, backend/CORS, rollback) is described in [RELEASING.md](RELEASING.md).

## Develop

```sh
npm install
npm run dev        # standalone site at http://localhost:5173/waterpath-data-integration-tool/
npm run build      # package
```

`VITE_API_BASE_URL` points the standalone site at another backend.
