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
