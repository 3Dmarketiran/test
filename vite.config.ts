import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_BASE_PATH is set by the GitHub Actions workflow (deploy.yml) so a
// GitHub Pages *project* site (username.github.io/repo/) resolves asset
// URLs correctly. Defaults to "/" for a custom domain or a user/org page.
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
