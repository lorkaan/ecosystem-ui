import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ecosystem/core-ui": path.resolve(__dirname, "../../packages/core-ui/src"),
      "@ecosystem/foundation": path.resolve(__dirname, "../../packages/foundation/src"),
      "@ecosystem/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
      "@ecosystem/auth": path.resolve(__dirname, "../../packages/auth/src"),
    },
  },
});