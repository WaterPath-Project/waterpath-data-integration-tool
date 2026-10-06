import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjected from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), cssInjected(),],
  assetsInclude: ["**/*.riv"],
  base: "/waterpath-data-integration-tool/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // maplibre-gl v6 loads its web worker via `new URL("./maplibre-gl-worker.mjs", import.meta.url)`.
    // Pre-bundling copies the module into node_modules/.vite/deps without the worker file next to it,
    // so both it and the Leaflet plugin that inlines it must be served from node_modules directly.
    exclude: ["maplibre-gl", "@maplibre/maplibre-gl-leaflet"],
  },
  define: {
    "process.env": {}, // ✅ avoid 'process is not defined'
  },
  build: {
    cssCodeSplit: false, // 👈 bundle CSS into JS
    minify: true,
    lib: {
      entry: "./src/mainFunction.ts",
      name: "DataIntegrationTool",
      fileName: () => `data-integration-tool.js`,
    },
  },
});
