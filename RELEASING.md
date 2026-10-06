# Releasing changes to production

The Data Integration Tool is not deployed on its own. It is an npm package that the
WaterPath website (`waterpath-web`, branch `source`) installs from this repository and
renders on its Model page. A change reaches production in two moves: a tagged release of
this package, then a dependency bump in the website. The standalone demo on GitHub Pages
is a by-product and deploys automatically.

```
tool repo ──commit──▶ main ──tag vX.Y.Z──▶ GitHub
                        │                      │
                        └─▶ GitHub Pages demo   └─▶ waterpath-web package.json "#vX.Y.Z" ──▶ site build & deploy
```

## 1. Before you start a change

- Work on a branch, open a pull request into `main`. `main` must always be releasable.
- Keep the public contract stable unless you mean to change it: the props of
  `DataIntegrationTool`, the `router` modes, the `apiBaseUrl` default, the CSS scoping
  (`.wp-dit`) and the fonts expected from the host. A contract change is a **minor** or
  **major** version, and the website must be updated in the same release.

## 2. Rules every change must respect

| Rule | Why |
| --- | --- |
| No global CSS. Every selector in `src/index.css` is under `.wp-dit`; utilities are scoped automatically by `important: ".wp-dit"` in `tailwind.config.js`. Never add `body`, `html` or unscoped element rules, never re-enable preflight. | The package is embedded in a page it does not own. |
| Anything rendered through a portal (dialog, popover, select, drawer) must use `usePortalContainer()`. | Portals land outside `.wp-dit` otherwise and lose their styles. |
| Backend calls go through `src/api.ts` with **relative** paths (`/api/...`). No hard-coded origins. | The host decides the backend through the `apiBaseUrl` prop. |
| Navigation uses react-router hooks only (`useNavigate`, `useParams`). Never read or write `window.location` for routing. | Routing is `hash` in the website, `browser` in the demo, `memory` for others. |
| Nothing may touch `window` or `document` at module top level. Do it inside effects, handlers or guarded functions (see `src/lib/proj4Setup.ts`). | The website pre-renders pages during its build. |
| Side-effect-only modules (`import "./x"`) are not allowed; export a function and call it. | The bundler drops them; this bit us with i18n and the MapLibre worker. |
| New runtime dependencies go in `dependencies`, never `devDependencies`. React stays a peer dependency. | The package is bundled from `dependencies`; React must come from the host. |

## 3. Verify locally (mandatory before tagging)

```sh
npm run build            # package: dist/index.js, index.cjs, style.css, index.d.ts
npm run build:ghpages    # standalone demo
npm run build:embed      # script-tag bundle
npm run dev              # click through the wizard at http://localhost:5173/waterpath-data-integration-tool/
```

Then test **inside the website**, because that is production:

```sh
cd ../waterpath-web           # branch `source`
# package.json must point at the local checkout while testing:
#   "waterpath-data-integration-tool": "file:../waterpath-data-integration-tool"
npm install && npm run develop
```

Open `http://localhost:8000/model/` and check:

- the wizard renders with its texts (no `header.title`-style keys);
- the URL becomes `/model/#/areas` when you move on, and the step survives a refresh and the back button;
- the website's navbar, footer and typography are unchanged, and dialogs/dropdowns open styled;
- the map opens on the Specify areas step and on the Preview data step;
- a download works against the backend you target.

Do not commit the `file:` dependency in the website; it is for local testing only.

## 4. Release the package

Use semantic versioning: **patch** for fixes, **minor** for new features or contract changes
the website must adopt, **major** for breaking changes.

```sh
git checkout main && git pull
npm version patch        # or minor / major: bumps package.json, commits, creates tag vX.Y.Z
git push --follow-tags
```

`npm version` refuses to run on a dirty working tree, which is intended: everything must be
committed first. Pushing `main` also redeploys the GitHub Pages demo through
`.github/workflows/deploy.yml`.

Write a short entry for the tag on GitHub Releases: what changed, and whether the website
needs anything beyond the version bump (new prop, new environment variable, new backend
endpoint, CORS).

## 5. Update the website

In `waterpath-web` (branch `source`):

```sh
# package.json
"waterpath-data-integration-tool": "github:WaterPath-Project/waterpath-data-integration-tool#vX.Y.Z"

npm install             # the package builds itself during install (prepare script)
npm run develop         # re-check /model/ once
git commit -am "Update data integration tool to vX.Y.Z"
npm run deploy          # or the usual site deployment
```

Pin to the tag, not to `#main`, so a site build is reproducible and can be rolled back.

## 6. Backend and environment

- The website selects the backend with `GATSBY_WATERPATH_API_URL`. If a release needs a
  new backend or new endpoints, deploy the backend **first**, then the package, then the site.
- The backend must allow the website's origin in CORS (the tool now calls it from the site's
  own domain, no longer from the GitHub Pages iframe origin), including `POST`.
- If a release changes what the tool stores in a session or expects from one, say so in the
  release notes; links such as `/model?session=<id>` must keep working or be documented as broken.

## 7. Rolling back

The website only ever runs the version named in its `package.json`. To roll back, point it at
the previous tag, run `npm install`, and redeploy the site. Nothing has to change in this
repository. Fix forward on `main` afterwards and release a new patch.

## 8. Checklist

- [ ] Branch merged into `main`, working tree clean
- [ ] `npm run build`, `build:ghpages`, `build:embed` pass
- [ ] Wizard tested inside `waterpath-web` with `file:` link (texts, hash routing, styling, map, download)
- [ ] `npm version <patch|minor|major>` and `git push --follow-tags`
- [ ] GitHub Release notes written (including anything the website must do)
- [ ] Backend deployed / CORS updated if needed
- [ ] Website dependency bumped to the new tag, installed, checked, deployed
