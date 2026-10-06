import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjected from "vite-plugin-css-injected-by-js";

/**
 * Script-tag build (`npm run build:embed`) for pages that are not React apps.
 * Produces one self-contained dist-embed/data-integration-tool.js that bundles React,
 * injects its (scoped) CSS and exposes `window.dataIntegrationTool(id, options)`.
 */
export default defineConfig({
  plugins: [react(), cssInjected()],
  assetsInclude: ["**/*.riv"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist-embed",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: "./src/mainFunction.ts",
      name: "DataIntegrationTool",
      formats: ["iife"],
      fileName: () => "data-integration-tool.js",
    },
  },
});
