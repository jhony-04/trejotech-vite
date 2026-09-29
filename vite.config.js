import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = "/trejotech-vite/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      scope: base,
      manifest: {
        id: base,
        name: "TrejoTech · Bitácoras de campo",
        short_name: "TrejoTech",
        description: "Herramientas de trabajo y bitácoras de campo.",
        lang: "es-MX",
        start_url: `${base}?herramienta=bitacoras`,
        scope: base,
        display: "standalone",
        theme_color: "#1959d1",
        background_color: "#f6f8fc",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff,woff2}"],
        navigateFallback: `${base}index.html`,
        navigateFallbackAllowlist: [/^\/trejotech-vite\//],
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,
      },
    }),
  ],
});