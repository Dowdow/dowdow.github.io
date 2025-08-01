import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  assetsInclude: ["**/*.md"],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
  },
  plugins: [react(), tailwindcss()],
  root: "./src",
});
