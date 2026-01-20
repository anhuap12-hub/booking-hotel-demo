import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  // Xóa bỏ manualChunks nếu không quá cần thiết để giảm lỗi 404 khi load module
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});