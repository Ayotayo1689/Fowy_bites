import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // assets under this size get inlined as data URIs; the scalloped plates and
  // ornaments are small, so keep the default and let the fonts stay as files.
  build: { assetsInlineLimit: 8192 },
})
