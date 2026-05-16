# Airpak Express Nova — Project Site Map

## Overview
Airpak Express Nova is a next-generation logistics platform redesign with iOS 26 / macOS Sequoia UI aesthetics, glassmorphism design language, and a premium dark/light theme system.

---

## Pages (8 Total)

### 1. Landing Page — `index.html`
**URL:** `/` | **Purpose:** Marketing homepage
- iOS 26 style frosted glass navbar with language pill, translate icon, theme toggle
- Full-viewport hero with animated grid background + floating orbs
- Track shipment search widget (glassmorphism card)
- Services grid (6 cards with glass effect)
- Features strip (6-column grid)
- Shipping solutions tabs (ShipNow / ShipLite / GETOnline)
- CTA section with gradient background
- Multi-column footer with social links

---

### 2. Signup Page — `signup.html`
**URL:** `/signup.html` | **Purpose:** Account registration
- **Full-viewport video background** (cargo ship at sea, slow motion)
- Animated particle overlay system
- Split layout: value props left + glass card form right
- Language pill + translate button in navbar
- Theme toggle (light/dark)
- Google SSO button + divider
- Multi-field registration form (name, email, company, country, size, password)
- Terms checkbox with inline links
- Trust bar at bottom (SSL, SOC2, GDPR, Rating)
- iOS 26 glassmorphism throughout

---

### 3. ShipNow Login — `shipnow-login.html`
**URL:** `/shipnow-login.html` | **Purpose:** Prepaid account login
- Split: glass form left / branded hero panel right
- Google SSO + email/password
- Company code field
- "Forgot password" link
- Feature highlights on right panel
- Language + theme controls in navbar

---

### 4. ShipNow Dashboard — `shipnow-dashboard.html`
**URL:** `/shipnow-dashboard.html` | **Purpose:** Main prepaid user dashboard
- Collapsible dark sidebar (72px → 260px)
- Stats row: Total Shipments, Delivered, In Transit, Pending
- Recent shipments data table with status badges
- Account balance glass card with top-up
- Quick actions grid (6 actions)
- Recent activity feed
- Language pill + translate + theme toggle in topbar

---

### 5. ShipNow New Shipment — `shipnow-new-shipment.html`
**URL:** `/shipnow-new-shipment.html` | **Purpose:** Create a new shipment
- 5-step stepper: Sender → Receiver → Package → Services → Review
- Multi-section form with glass cards
- Address row with autocomplete styling
- Package item cards with dimensions/weight
- Service radio options (Express/Economy/Air Freight)
- Additional services checkboxes (Insurance, Signature, SMS)
- Sticky quote summary card (dark glass)
- Real-time price breakdown

---

### 6. GETOnline Dashboard — `getonline-dashboard.html`
**URL:** `/getonline-dashboard.html` | **Purpose:** Enterprise full dashboard
- Left sidebar (white, 240px) with section groups
- Topbar with search bar, language, translate, theme, user chip
- 5-stat grid: Total, Delivered, In Transit, Exceptions, Revenue
- Charts row: bar chart (volume) + donut chart (status breakdown)
- Filter bar with dropdowns
- Full data table with 8 columns
- Bottom widgets: Alerts, Top Carriers, Top Routes

---

### 7. Shipment Tracking — `tracking.html`
**URL:** `/tracking.html` | **Purpose:** Track & trace a shipment
- **Full-page map visualization** (animated route line with pulsing current position)
- Route markers: Singapore → Dubai Hub → Cardiff Wales
- 5-step progress bar (Picked Up → Processing → In Transit → Customs → Delivered)
- Shipment history timeline (6 events)
- Glass cards: Route addresses, Package details, Contact info, Actions
- Translate button + language pill + theme toggle
- Wales address: "Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom"

---

### 8. Settings & More — Settings Page (integrated in dashboard)
**URL:** Via sidebar | **Purpose:** Account & platform settings
- Team members management
- API keys & integrations
- Billing & invoices
- Notification preferences
- Theme preferences per user
- Language preferences

---

## Design System — Nova

### Colors
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--bg-primary` | #F8FAFC | #050A14 | Page background |
| `--bg-glass` | rgba(255,255,255,0.6) | rgba(15,30,55,0.6) | Glass cards |
| `--accent` | #0066FF | #0066FF | Primary action |
| `--accent-cyan` | #00D4FF | #00D4FF | Highlights |
| `--text-primary` | #0F172A | #F1F5F9 | Headings |
| `--text-muted` | #94A3B8 | #64748B | Secondary text |

### Typography
- **Font:** Inter (Google Fonts) — weights 300–900
- **Headings:** -0.03em letter-spacing, weight 700–900
- **Body:** weight 400–500, line-height 1.6

### Glass System
```css
background: var(--bg-glass);
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid var(--border-glass);
border-radius: 20px;
box-shadow: var(--shadow-glass);
```

### iOS 26 UI Elements
- **Nav buttons:** 36px, border-radius 10px, glass surface, scale hover
- **Language pill:** 20px radius, icon + text, glass background
- **Theme toggle:** rotates 15deg on hover, sun/moon swap
- **Translate icon:** with notification dot badge
- **User chips:** avatar + name + role

### Motion
- Card hover: `translateY(-4px)` + enhanced shadow
- Button hover: `translateY(-1px to -2px)` + glow
- Glass transition: 0.3s ease
- Theme switch: 0.4s ease for all color vars

### Addresses (Wales, UK)
**Headquarters:** 45 Changi South Ave 2 #01-01, Singapore 486133

**Tracking Destination:**
- Company: Evans & Partners Ltd
- Address: Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom
- Phone: +44 29 2011 3344

---

## Component Library

### Glass Card
- `backdrop-filter: blur(24px) saturate(180%)`
- Border: 1px solid `var(--border-glass)`
- Border-radius: 20px
- Shadow: `0 8px 32px rgba(0,0,0,0.08)`
- Hover: `translateY(-4px)` + enhanced shadow

### Nav Icon Button (iOS 26)
- 36×36px, border-radius 10px
- Glass surface + 1px border
- Hover: `scale(1.05)` + background swap
- Active: `scale(0.95)`
- Badge variant with red dot

### Language Pill
- 20px radius pill
- Flag emoji + 2-letter code
- Glass background + border
- Hover: background lighten

### Theme Toggle
- 36×36px, border-radius 10px
- Sun/moon emoji swap
- Rotates 15deg on hover
- CSS `[data-theme="dark"]` selector

### Data Table
- Header: uppercase, 11px, 0.05em letter-spacing
- Rows: hover highlight, border-bottom
- Status badges: pill shape, colored backgrounds

### Stepper
- Numbered circles (done/active/pending states)
- Connecting lines with color states
- Active state: blue glow ring
- Labels below each step

### Timeline
- Vertical with left dot + connecting line
- Completed: green checkmark
- Active: blue with glow ring
- Content + timestamp right-aligned

### Map Visualization
- Grid overlay background
- Animated route line (pulsing current position)
- Point markers for origin/current/destination
- Control buttons (zoom, layers, locate)
- Labels at each point

---

## Technical Notes

- **CSS Variables:** All colors/spacing via `:root` with `[data-theme="dark"]` override
- **Theme Detection:** Auto-detects OS preference via `prefers-color-scheme`
- **Video Background:** Uses Mixkit CDN preview for cargo ship video
- **Animations:** Pure CSS `@keyframes`, no external libraries
- **Responsive:** Mobile-first with breakpoints at 640px, 1024px, 1280px
- **Backdrop-filter:** Webkit prefix for Safari compatibility
- **Fonts:** Google Fonts CDN with weights 300–900
- **No JavaScript frameworks** — pure vanilla JS for interactions