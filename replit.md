# Airpak Express

A merged web project combining juju1 (scraped airpak-express.com public site) and juju2 (iOS 26 Apple design interior app pages) into a single Vite-served artifact at `artifacts/airpak-express`.

## Run & Operate

- `pnpm --filter @workspace/airpak-express run dev` — run the frontend (reads PORT from env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite 7 + React 18 + Wouter 3 + Tailwind v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM

## Where things live

- `artifacts/airpak-express/index.html` — Vite root (juju1's real homepage — airpak-express.com scraped)
- `artifacts/airpak-express/public/` — all static files served by Vite
  - `public/dashboard.html`, `public/signin.html`, etc. — juju2 iOS 26 Apple design pages
  - `public/apps/airpak/` — juju1's scraped app assets (CSS, JS, images, vendor libs)
  - `public/css/` — juju2 design system (apple-tokens.css, glass-system.css, etc.)
  - `public/js/main.js` — juju2 main JavaScript
  - `public/pages/` — juju1 scraped inner pages (aboutus.html, contact.html, etc.)
- `artifacts/airpak-express/src/` — React SPA source (Wouter-based routing, Tailwind)
- `artifacts/airpak-express/vercel.json` — deployment rewrite rules for static HTML files

## Architecture decisions

- Root `index.html` is juju1's scraped homepage (not a React entry point) — Vite serves it as-is
- juju2 HTML pages live in `public/` and are served directly as static files by Vite
- Font Awesome 4.7.0, Font Awesome 5, LineIcons, and uicons fonts that weren't captured by the scraper are served from CDN (cdnjs.cloudflare.com, cdn.jsdelivr.net, cdn-uicons.flaticon.com)
- All internal juju1 domain refs changed from `airpak-express.com` to `/` for relative-path serving
- DOCTYPE `prefix="og:..."` attribute removed from all juju1 HTML files (Vite parse5 doesn't support it)

## Product

- `/` — Real Airpak Express public website (red branding, Bootstrap nav, track shipment)
- `/dashboard.html` — iOS 26 Apple design app dashboard (stats, sidebar, shipment volume)
- `/signin.html` — Apple design sign-in page (glass morphism, Google/Apple OAuth buttons)
- `/tracking.html`, `/shipments.html`, etc. — other juju2 app pages
- `/aboutus.html`, `/contact.html`, etc. — juju1 scraped inner pages

## User preferences

- Both juju1 and juju2 sources must be preserved exactly as-is (byte-faithful for juju1, exact HTML/CSS/JS for juju2)
- Do not add new features or modify content beyond fixing broken local asset references

## Gotchas

- juju1 hero images and logo images are not loading — they were served from a CDN that blocked wget scraping. The page renders correctly but with broken image placeholders.
- The `vercel.json` rewrites are needed for static `.html` file serving in production
- Do NOT run `pnpm dev` at the workspace root — use the workflow system instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
