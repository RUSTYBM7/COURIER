import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "node:fs";

const cleanUrlsPlugin = (publicDir: string): Plugin => ({
  name: "clean-urls",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url) return next();
      const [pathname, query] = req.url.split("?");
      if (
        pathname &&
        !pathname.endsWith("/") &&
        !path.extname(pathname) &&
        fs.existsSync(path.join(publicDir, `${pathname}.html`))
      ) {
        req.url = `${pathname}.html${query ? `?${query}` : ""}`;
      }
      next();
    });
  },
});

// Injects dark class into the dist index.html
const injectDark: Plugin = {
  name: "inject-dark",
  apply: "build",
  transformIndexHtml(html) {
    const darkClass = `<script>document.documentElement.classList.add('dark');document.body.classList.add('dark');</script>`;
    if (!html.includes("document.documentElement.classList.add('dark')")) {
      html = html.replace("</body>", `${darkClass}\n</body>`);
    }
    return html;
  },
};

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;
const basePath = process.env.BASE_PATH ?? "/";
const isDev = process.env.NODE_ENV !== "production";
const isReplit = process.env.REPL_ID !== undefined;

const replitPlugins = isDev && isReplit
  ? await Promise.all([
      import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
      import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
      ),
    ])
  : [];

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    cleanUrlsPlugin(path.resolve(import.meta.dirname, "static")),
    injectDark,
    ...replitPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  publicDir: path.resolve(import.meta.dirname, "static"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "index.html"),
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});