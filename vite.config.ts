import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Package build (`npm run build`, also run by `prepare` so git/npm installs build it).
 *
 * Output: dist/index.js (ESM), dist/index.cjs, dist/style.css, dist/index.d.ts.
 *
 * - React and ReactDOM are peer dependencies and stay external, so the host's React is used
 *   (a single React instance is required for hooks and context).
 * - Everything else is bundled, deliberately including react-router: the tool's router is a
 *   separate module instance from any router the host runs, so it can never collide with it.
 * - Assets (category icons, the Rive loader, the MapLibre worker, Leaflet images) are inlined,
 *   so a host only deals with the JS and the CSS file.
 */
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src"],
      exclude: ["src/main.tsx", "src/mainFunction.ts", "src/globalfunction.tsx"],
      insertTypesEntry: true,
    }),
  ],
  assetsInclude: ["**/*.riv"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "WaterpathDataIntegrationTool",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "style",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom/client"],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom/client": "ReactDOMClient",
        },
      },
    },
  },
});
