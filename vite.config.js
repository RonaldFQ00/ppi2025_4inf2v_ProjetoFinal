import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // aceita acesso externo (Codespaces)
    port: 5173,        // porta padrão do Vite
    strictPort: true   // não troca de porta sozinho
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
