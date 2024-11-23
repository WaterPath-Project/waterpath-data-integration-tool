import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/waterpath-data-integrationt-tool/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
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
