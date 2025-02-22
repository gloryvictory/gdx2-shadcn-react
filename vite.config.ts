import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
    react(), 
    // visualizer({ open: true }), // Анализ бандлов
  ],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
  build: {
      chunkSizeWarningLimit: Infinity, // Настройка лимита
      sourcemap: true, // Ensure source maps are generated
    }
})
