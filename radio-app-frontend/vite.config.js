import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@api': '/src/api',
      '@components': '/src/components',
      '@views': '/src/views',
      '@assets': '/src/assets'
    }
  }
});
