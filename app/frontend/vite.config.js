import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const devPort = Number(process.env.FRONTEND_DEV_PORT || 5173);
const gatewayUrl = process.env.VITE_GATEWAY_URL || "http://gateway:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: devPort,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: gatewayUrl,
        changeOrigin: true,
      },
    },
  },
});