import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";
import { createRollupLicensePlugin } from "rollup-license-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createRollupLicensePlugin({
      additionalFiles: {
        "acknowledgments.json": (packages) => {
          const favIconAttribution = {
            name: "favicon.svg",
            author: "Mihimihi",
            source: "https://www.flaticon.com/free-icon/love_9812568?term=finger+heart&page=1&position=1&origin=tag&related_id=9812568"
          };

          packages.unshift(favIconAttribution);
          return JSON.stringify(packages, null, 2);
        }
      }
    }),
  ],
  base: "/will-you-be-mine/" 
})
