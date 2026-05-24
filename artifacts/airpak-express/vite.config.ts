vite_fix = '''import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { componentTagger } from "lovable-tagger";

// Clean URLs plugin - removes .html extension from links
function cleanUrlsPlugin(staticDir: string) {
  return {
    name: "clean-urls",
    enforce: "post" as const,
    async generateBundle(_options: any, bundle: Record<string, any>) {
      const fs = await import("fs");
      const files = fs.readdirSync(staticDir).filter((f: string) => f.endsWith(".html"));
      for (const file of files) {
        const content = fs.readFileSync(path.join(staticDir, file), "utf-8");
        const clean = content.replace(/href="([^"]+)\.html"/g, 'href="$1"');
        bundle[file] = { type: "asset", source: clean, fileName: file };
      }
    },
  };
}

// Dark mode injection plugin - properly injects dark class
function injectDark() {
  return {
    name: "inject-dark",
    transformIndexHtml(html: string) {
      const darkClass = `<script>document.documentElement.classList.add('dark')</script>`;
      // Inject before closing </head> tag
      if (html.includes("</head>")) {
        html = html.replace("</head>", `${darkClass}\n</head>`);
      }
      return html;
    },
  };
}

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: ["airpak-express.site", "www.airpak-express.site", "localhost"],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Airpak Express',
        short_name: 'Airpak',
        description: 'Global logistics and courier services',
        theme_color: '#E53935',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    componentTagger(),
    cleanUrlsPlugin(path.resolve(import.meta.dirname, "public")),
    injectDark(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['wouter'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'vendor-icons': ['lucide-react'],
        }
      }
    }
  },
  css: {
    devSourcemap: true,
  },
});
'''

with open('/mnt/agents/output/airpak-repair/vite.config.ts', 'w') as f:
    f.write(vite_fix)

