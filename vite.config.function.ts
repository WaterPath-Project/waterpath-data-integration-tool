import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.riv"],
  base: "/model/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: true,
    lib: {
      entry: "./src/mainFunction.ts",
      name: "DataIntegrationTool",
      fileName: () => `data-integration-tool.js`,
    },
  },
});
