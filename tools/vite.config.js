import { defineConfig } from "vite"
import baseConfig from "./vite.config.base.js";

// https://vite.dev/config/
export default defineConfig({
    ...baseConfig,
    define: {
        "import.meta.env.VITE_GOOGLE_EMBED_API_KEY": `"${process?.env?.GOOGLE_EMBED_API_KEY}"`
    },
});
