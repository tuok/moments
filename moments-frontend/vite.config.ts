import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      BACKEND: process.env.BACKEND,
      DEBUG: process.env.DEBUG_MOMENTS,
    },
  },
});