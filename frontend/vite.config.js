import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Cho phép truy cập từ bên ngoài
    port: 8080,      // Port bạn sẽ khai báo với Koyeb
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,      // Port này dùng khi chạy npm run preview
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
        },
      },
    },
  },
});