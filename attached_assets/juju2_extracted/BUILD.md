# AIRPAK EXPRESS NOVA — Build Corrections & Full Specification

## ⚠️ CRITICAL CORRECTIONS (Read First)

This document supersedes all previous work. All prior builds are superseded by these corrections.

---

## 🔴 CORRECTION 1: Remove All Emojis → Replace with SVG Icon System

**PROBLEM:** The current build uses emojis (📦, 🚚, 🔍, 💬, etc.) throughout all pages. This makes the site look fake and unprofessional.

**SOLUTION:** Replace ALL emoji icons with a proper SVG icon system using Lucide or Feather icons (open source, Apple-approved aesthetic).

### Icon Implementation

```html
<!-- Replace all emoji nav icons with SVG equivalents -->
<!-- BEFORE: <button class="nav-icon">🔔</button> -->
<!-- AFTER: -->
<button class="nav-icon" aria-label="Notifications">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
</button>
```

### Global Icon Font Method (Simpler)
Use Lucide icons via CDN for the entire project:

```html
<!-- In <head> of every page -->
<script src="https://unpkg.com/lucide@latest"></script>
```

```html
<!-- Usage - Replace emojis with: -->
<i data-lucide="package"></i>      <!-- 📦 -->
<i data-lucide="truck"></i>         <!-- 🚚 -->
<i data-lucide="search"></i>         <!-- 🔍 -->
<i data-lucide="message-circle"></i><!-- 💬 -->
<i data-lucide="settings"></i>      <!-- ⚙️ -->
<i data-lucide="bell"></i>          <!-- 🔔 -->
<i data-lucide="user"></i>          <!-- 👤 -->
<i data-lucide="log-in"></i>        <!-- → -->
<i data-lucide="log-out"></i>       <!-- ← -->
<i data-lucide="check"></i>          <!-- ✓ -->
<i data-lucide="x"></i>             <!-- × -->
<i data-lucide="plus"></i>          <!-- ➕ -->
<i data-lucide="edit"></i>          <!-- ✏️ -->
<i data-lucide="trash-2"></i>        <!-- 🗑️ -->
<i data-lucide="download"></i>       <!-- 📥 -->
<i data-lucide="upload"></i>         <!-- 📤 -->
<i data-lucide="mail"></i>          <!-- 📧 -->
<i data-lucide="phone"></i>         <!-- 📱 -->
<i data-lucide="map-pin"></i>        <!-- 📍 -->
<i data-lucide="clock"></i>          <!-- 🕐 -->
<i data-lucide="eye"></i>           <!-- 👁️ -->
<i data-lucide="bar-chart-2"></i>   <!-- 📊 -->
<i data-lucide="shield"></i>        <!-- 🔒 -->
<i data-lucide="unlock"></i>        <!-- 🔓 -->
<i data-lucide="lock"></i>           <!-- 🔐 -->
<i data-lucide="key"></i>            <!-- 🔑 -->
<i data-lucide="dollar-sign"></i>   <!-- 💰 -->
<i data-lucide="credit-card"></i>   <!-- 💳 -->
<i data-lucide="globe"></i>          <!-- 🌍 -->
<i data-lucide="map"></i>           <!-- 🗺️ -->
<i data-lucide="navigation"></i>     <!-- 🧭 -->
<i data-lucide="send"></i>          <!-- → -->
<i data-lucide="menu"></i>           <!-- hamburger -->
<i data-lucide="moon"></i>           <!-- 🌙 -->
<i data-lucide="sun"></i>            <!-- ☀️ -->
<i data-lucide="flag"></i>           <!-- 🚩 -->
<i data-lucide="alert-circle"></i>  <!-- ⚠️ -->
<i data-lucide="info"></i>           <!-- ℹ️ -->
<i data-lucide="check-circle"></i>   <!-- ✅ -->
<i data-lucide="x-circle"></i>       <!-- ❌ -->
<i data-lucide="help-circle"></i>   <!-- ❓ -->
<i data-lucide="file-text"></i>     <!-- 📄 -->
<i data-lucide="printer"></i>        <!-- 🖨️ -->
<i data-lucide="copy"></i>           <!-- 📋 -->
<i data-lucide="external-link"></i>  <!-- ↗️ -->
<i data-lucide="chevron-down"></i>  <!-- ▼ -->
<i data-lucide="chevron-right"></i>  <!-- ▶ -->
<i data-lucide="arrow-left"></i>     <!-- ← -->
<i data-lucide="arrow-right"></i>    <!-- → -->
<i data-lucide="zap"></i>            <!-- ⚡ -->
<i data-lucide="layers"></i>         <!-- 🧱 -->
<i data-lucide="box"></i>            <!-- 📦 -->
<i data-lucide="refresh-cw"></i>     <!-- 🔄 -->
<i data-lucide="filter"></i>         <!-- ⚙️ -->
```

**Implementation:** Add `<script src="https://unpkg.com/lucide@latest"></script>` before `</body>` AND call `lucide.createIcons()` on page load.

---

## 🔴 CORRECTION 2: Chat Architecture — Landing vs Post-Auth

### Landing Page (index.html) → Chat WIDGET ONLY

The landing page has a **floating widget** — a simple 64px circle trigger button in the bottom-right corner. NOT a full chat interface.

```
Landing Page Chat:
┌──────────────────────────────────────┐
│  [Chat Widget - Bottom Right]          │
│                                       │
│  💬 (64px circle, gradient blue)     │
│  └── Click → Slides up 400×560px panel│
│      └── Quick action buttons         │
│      └── Message input only           │
│      └── NO conversation list          │
│      └── NO call/audio buttons        │
│      └── Simulated responses          │
└──────────────────────────────────────┘
```

**Landing Chat Specifications:**
- Position: `bottom: 32px; right: 32px`
- Trigger: 64px circle, gradient blue (#007AFF to #5856D6)
- Panel: 400px × 560px, frosted glass, slide-up bounce animation
- Content: Quick actions (Track Package, Get Quote, File Claim, Contact)
- Input: Single message field + send button
- Responses: Simulated (no real agent)
- Icon on trigger: `message-circle` from Lucide

### Post-Auth Pages (Dashboard, Settings, Chat-Hub) → Full iMessage Chat

After login, ALL post-auth pages have the FULL iMessage chat experience:

```
Post-Auth Chat (Full iMessage Style):
┌──────────────────────────────────────┐
│  LEFT SIDEBAR          │  RIGHT CHAT  │
│  ┌───────────────┐   │  ┌──────────┐│
│  │ Search         │   │  │ Agent    ││
│  ├───────────────┤   │  │ Header   ││
│  │ Conv 1 ●──────│   │  ├──────────┤│
│  │ Conv 2        │   │  │ Messages ││
│  │ Conv 3        │   │  │ (bubbles)││
│  │ ...           │   │  │          ││
│  └───────────────┘   │  ├──────────┤│
│                      │  │ [input]  ││
│  Call Agent button   │  │  [send]  ││
│  Voice/Video icons  │  └──────────┘│
└──────────────────────────────────────┘
```

**Post-Auth Chat Specifications:**
- Split view: Conversation list (left) + Active thread (right)
- iMessage-style bubbles (blue for user, gray for agent)
- Read receipts (blue checkmarks)
- Typing indicators (3 animated dots)
- Voice call + Video call buttons (in header)
- Attachment support (images, docs, location)
- Real agent integration (not simulated)
- Online status indicators on avatars

---

## 🔴 CORRECTION 3: COMPONENT_LIBRARY.html → Admin ONLY

**PROBLEM:** The component library is currently accessible to anyone via URL.

**SOLUTION:** Add an auth gate. Only logged-in admin users can access it.

**Implementation:**
```html
<!-- At top of COMPONENT_LIBRARY.html -->
<script>
  // Check admin auth
  const isAdmin = sessionStorage.getItem('airpak_admin_auth');
  if (!isAdmin) {
    window.location.href = 'admin-login.html';
  }
</script>
```

OR serve it only via the admin panel navigation (remove direct URL access from nav).

---

## 🔴 CORRECTION 4: All Sidebars → HIGH Active State

**PROBLEM:** Sidebars on all internal pages do not highlight the currently active page.

**SOLUTION:** Every sidebar item must be marked as `.active` when on its page, using `window.location.pathname`.

**JavaScript (add to main.js):**
```javascript
function initSidebarActiveState() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav-item, .ls-nav-item, .admin-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', initSidebarActiveState);
```

**Sidebar CSS Enhancement:**
```css
.sidebar-nav-item.active {
  background: var(--apple-blue);
  color: white;
}
.sidebar-nav-item.active .nav-item-icon {
  background: rgba(255,255,255,0.2);
}
```

---

## 🔴 CORRECTION 5: FAQ → Expand to 97 Questions (7 Categories)

**Current state:** FAQ has ~12 questions.

**Required:** 97 questions across 7 categories:

| # | Category | Questions |
|---|----------|-----------|
| 1 | Getting Started | 12 questions |
| 2 | Tracking | 14 questions |
| 3 | Shipping | 20 questions |
| 4 | Payments | 15 questions |
| 5 | Account | 14 questions |
| 6 | Business | 12 questions |
| 7 | Support | 10 questions |
| **TOTAL** | | **97 questions** |

**FAQ Page Layout:**
- Category pills at top (7 pills with icons)
- Search bar with real-time filtering
- Accordion for each question
- "Related questions" section at bottom
- "Contact support" CTA card

---

## 🔴 CORRECTION 6: Wales UK Address Consistency

**REQUIRED ADDRESS:** `Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom`

This address must appear in:
- [ ] Landing page tracking section
- [ ] Tracking page result
- [ ] Footer (if applicable)
- [ ] Admin panel company info
- [ ] Signup onboarding

---

## 🔴 CORRECTION 7: Video Assets — Real Footage

**Current:** Uses placeholder W3Schools video (`mov_bbb.mp4`)

**Required:** Real cargo/ship logistics video. Use one of:
- [ ] Mixkit free stock (logistics/shipping category)
- [ ] Pexels free stock
- [ ] Place actual video file in `/assets/video/` directory

**Pages needing video:**
1. `signup.html` — Full-viewport cargo/ship background
2. `loading-screen.html` — Full-screen intro with progress

---

## 🟡 CORRECTION 8: Admin Panel — User Management CRUD

**Admin Panel must have per-user action buttons:**
- **Edit** — Opens user edit modal
- **Verify** — Marks user as verified (for pending users)
- **Upgrade** — Upgrades user to Premium/Business
- **Block** — Temporarily blocks user
- **Delete** — Removes user (with confirmation modal)

**Table Columns (horizontal):**
| Checkbox | User | Email | Phone | Status | Role | Joined | Shipments | Actions |

**Stats Bar:**
- Total Users
- Pending Verification
- Blocked
- Premium

**Filters:**
- Search (name, email, phone)
- Status dropdown (All/Active/Pending/Blocked/Premium)
- Role dropdown (All/User/Business/Admin)
- Date range

---

## 🟡 CORRECTION 9: Signup → Post-Signup Flow

**Flow:** Signup → Loading Screen → Dashboard

The loading screen (`loading-screen.html`) acts as the transition after successful signup, showing progress while redirecting to the dashboard.

---

## 🟡 CORRECTION 10: Chat Widget on Post-Auth Pages → Full iMessage

**All post-auth pages (dashboard, settings, chat-hub, etc.):**
- Remove the landing-page-style floating chat widget
- Add full iMessage-style chat in the layout
- Chat is accessible via sidebar icon
- NOT a floating widget — embedded split-view

---

## 📁 PROJECT STRUCTURE

```
airpak-nova-pro/
├── index.html              # Landing page + chat WIDGET only
├── signup.html             # Auth with video background
├── signin.html             # Auth
├── loading-screen.html    # Post-signup transition
├── dashboard.html         # Post-auth dashboard + iMessage chat
├── settings.html          # Apple Preferences style + iMessage chat
├── chat-hub.html          # Dedicated full iMessage chat page
├── tracking.html         # Full-page map + tracking form
├── admin.html             # Admin panel + user management CRUD
├── faq.html               # 97 questions + search
├── payment.html          # Apple Wallet style + Stripe/Crypto
├── COMPONENT_LIBRARY.html # Admin-only component showcase
├── shipnow-login.html     # ShipNow prepaid login
├── shipnow-dashboard.html # ShipNow user dashboard
├── shipnow-new-shipment.html # 5-step shipment wizard
├── getonline-dashboard.html # Enterprise GETOnline dashboard
│
├── css/
│   ├── apple-tokens.css   # Design tokens (colors, typography, spacing)
│   ├── glass-system.css   # Glassmorphism components + layout
│   ├── animations.css      # Spring animations + transitions
│   ├── components.css     # 50+ components
│   └── pages.css           # Page-specific styles
│
├── js/
│   └── main.js            # Theme engine, i18n, chat widget, utilities
│
├── assets/
│   ├── video/             # Cargo/ship footage
│   └── icons/            # Custom SVG icons (optional)
│
├── DESIGN_SYSTEM.md       # Design token documentation
├── SITE_MAP.md            # Project sitemap
└── BUILD.md              # This file — corrections + full spec
```

---

## 🧭 TECHNICAL ARCHITECTURE

### Frontend Stack
- **HTML5** — Semantic markup
- **CSS Variables** — Design tokens, `[data-theme="dark"]` override
- **Vanilla JavaScript** — No frameworks (no React, Vue, jQuery)
- **Icons** — Lucide icons via CDN
- **Fonts** — Inter (Google Fonts), weights 300–900

### Design System Tokens
- Exact Apple hex codes (#007AFF, #34C759, #FF3B30, etc.)
- iOS 26 glass system: `backdrop-filter: blur(20px) saturate(180%)`
- 8pt spacing grid
- iOS 26 spring animation: `cubic-bezier(0.32, 0.72, 0, 1)`
- Border radius scale: 4px → 24px
- Shadow layers: sm, md, lg, xl, glass, glass-strong

### JavaScript Architecture
```javascript
// Exposed as window.AIRPAK
AIRPAK = {
  Theme: { init, set, toggle },       // Dark/light/OS theme
  i18n: { init, setLang, t, translate }, // 4 languages (EN/ZH/MS/AR)
  Chat: { init, toggle, sendMessage },   // Chat widget
  Toast: { success, error, warning, info }, // Toast notifications
  Modal: { open, close },               // Modal system
  Form: { validate },                  // Form validation
  Sidebar: { init },                   // Sidebar active states
  copyToClipboard                     // Utility
}
```

---

## 📋 TODO PRIORITY QUEUE

### High Priority (Must Fix)
- [ ] Replace ALL emojis with Lucide SVG icons
- [ ] Fix landing page chat → widget ONLY (not full chat)
- [ ] Fix post-auth pages → full iMessage chat
- [ ] COMPONENT_LIBRARY.html → Admin-only access
- [ ] All sidebars → Active state for current page
- [ ] Expand FAQ to 97 questions across 7 categories

### Medium Priority
- [ ] Wales UK address consistency check
- [ ] Real video assets for signup + loading-screen
- [ ] Admin panel → Full CRUD (edit/verify/upgrade/block/delete)
- [ ] Mobile hamburger menu for sidebar pages

### Low Priority
- [ ] Stripe payment form → Real integration
- [ ] Favicon SVG generation
- [ ] SEO meta tags per page
- [ ] Analytics pixel integration
- [ ] Tracking form → Real API connection

---

## ✅ VERIFICATION CHECKLIST

Run this before calling any page "done":

- [ ] Zero emojis visible (all replaced with Lucide `<i data-lucide="...">`)
- [ ] Landing page has WIDGET chat only (64px circle trigger, no split view)
- [ ] Post-auth pages have FULL iMessage chat (split view, conversation list)
- [ ] COMPONENT_LIBRARY.html requires admin login
- [ ] All sidebar links highlight active page
- [ ] FAQ has 97 questions across 7 categories
- [ ] Wales address: `Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom`
- [ ] Video on signup/loading-screen is real cargo footage (not placeholder)
- [ ] Admin panel user table has: Edit, Verify, Upgrade, Block, Delete buttons
- [ ] Theme toggle works (dark/light)
- [ ] Language pill works (EN/ZH/MS/AR)
- [ ] All links between pages work (no dead href="#")