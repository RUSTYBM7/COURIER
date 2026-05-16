# AIRPAK NOVA PRO — Full Upgrade Plan

## Checkpoint
`/Users/macbook/Downloads/checkpoint-airpak-20260515-231047.tar.gz`

---

## What to do (and what NOT to do)

### Landing Page (index.html) — TOUCH LAST / MINIMALLY
- **EXACT mirror of airpak-express.com** — no changes to content, layout, nav, video
- ONLY add: UK-focused chat widget at **bottom-left** (not bottom-right)
- ONLY change: "Singapore" → "United Kingdom" in features
- NO rebuild, no restructuring

### Interior Pages → shadcn/Radix UI Patterns
All post-auth and interior pages convert to Apple iOS 26 aesthetic with Radix UI component patterns:
- Cards with hover states
- Form inputs with floating labels
- Accordion components
- Dialog/modals
- Navigation with active states
- Data tables

### Pages to Build/Upgrade
| Page | Pattern | Notes |
|------|---------|-------|
| `dashboard.html` | Full split-view iMessage chat + stats | Remove any duplicate chat widget |
| `settings.html` | Apple Preferences (grouped lists) | No chat widget, full page |
| `chat.html` (NEW) | Full iMessage page | Replace chat-hub.html with this |
| `tracking.html` | Full Apple Maps style | Replace mock map with real interactive map |
| `payment.html` | Apple Wallet style | Cards, transactions, payment methods |
| `admin.html` | Full CRUD table | Verify/Upgrade/Block/Delete per row |
| `faq.html` | 97 questions, 7 categories | Already done — verify |
| `COMPONENT_LIBRARY.html` | Admin-only gate | Password: airpak-admin-2025 |

### shadcn Preset
```bash
cd /Users/macbook/Downloads/airpak-nova-pro
pnpm dlx shadcn@latest apply --preset b3kHzcrpK
```

### Data Strategy
- All mock arrays → realistic fake data (real names, addresses, tracking numbers)
- Wales UK address: `Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom`
- No lorem ipsum

### Architecture Rules
1. No double chat widgets — widget only on landing, full page for interior
2. No COMPONENT_LIBRARY.html in public nav
3. Sidebar active states on all interior pages
4. Theme toggle (dark/light) on all pages
5. Language pill (EN/ZH/MS/AR) on all pages

---

## Execution Order
1. Install shadcn preset
2. Build/upgrade tracking page (Apple Maps)
3. Build/upgrade payment page (Apple Wallet)
4. Build/upgrade chat page (iMessage full)
5. Upgrade dashboard (remove duplicate widget)
6. Upgrade settings (Apple Preferences)
7. Upgrade admin (full CRUD)
8. Landng page — ONLY add UK widget + Singapore → UK
9. Final sweep: no emojis, no mock data, all links work