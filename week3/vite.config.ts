import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: false }), react(), tailwindcss()],
  resolve: {
    // tsconfig.json의 paths와 맞춰서 "@/..."를 src 폴더로 연결해요.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
