/**
 * Bundles MapLibre's web worker into one self-contained file, src/generated/maplibre-gl-worker.js.
 *
 * MapLibre loads its worker relative to the script that loaded it, which does not exist at
 * that location once the tool is bundled into a host application. The generated file is
 * imported as a string (`?raw`) by src/lib/maplibreWorker.ts and turned into a blob URL at
 * runtime, so the worker travels inside the package bundle whatever the host's bundler does.
 *
 * Runs automatically before `dev` and every `build*` script (npm pre-hooks).
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src/generated");
const entry = require.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs");
const version = require("maplibre-gl/package.json").version;
const stamp = path.join(outDir, ".maplibre-version");

if (fs.existsSync(path.join(outDir, "maplibre-gl-worker.js")) && fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8") === version) {
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
await build({
  configFile: false,
  logLevel: "warn",
  build: {
    outDir,
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
    lib: {
      entry,
      formats: ["es"],
      fileName: () => "maplibre-gl-worker.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
fs.writeFileSync(stamp, version);
console.log(`[worker] bundled maplibre-gl ${version} worker into src/generated/maplibre-gl-worker.js`);
