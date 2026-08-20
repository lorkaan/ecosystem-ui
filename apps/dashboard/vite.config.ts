import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@ecosystem": path.resolve(__dirname, "../../packages"),
    },
  },
});