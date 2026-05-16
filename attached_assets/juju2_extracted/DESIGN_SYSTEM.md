# Airpak Express — Nova Design System

## Brand Identity
- **Name:** Airpak Express
- **Tagline:** "Seamless International Express Courier Services"
- **Heritage:** 30+ years of logistics expertise, Singapore-based global network

---

## Color Palette — Nova Theme

### Primary
| Token | Hex | Usage |
|---|---|---|
| `--nova-deep` | `#0A1628` | Primary backgrounds, dark surfaces |
| `--nova-navy` | `#1E3A5F` | Headers, navbars, primary buttons |
| `--nova-blue` | `#0066FF` | Primary actions, links, focus states |
| `--nova-cyan` | `#00D4FF` | Accents, highlights, live indicators |
| `--nova-sky` | `#4DA6FF` | Secondary actions, hover states |

### Accent
| Token | Hex | Usage |
|---|---|---|
| `--nova-gold` | `#FFB800` | Premium features, warnings, star ratings |
| `--nova-amber` | `#FF8C00` | Alerts, in-transit status |
| `--nova-green` | `#00C853` | Success, delivered, online status |
| `--nova-red` | `#FF3B3B` | Errors, rejected, critical alerts |
| `--nova-purple` | `#7B61FF` | Special features, enterprise badges |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `--nova-white` | `#FFFFFF` | Cards, inputs, primary text on dark |
| `--nova-100` | `#F5F7FA` | Page backgrounds |
| `--nova-200` | `#E8ECF1` | Borders, dividers |
| `--nova-300` | `#C5CED9` | Placeholder text, disabled |
| `--nova-500` | `#6B7A8C` | Secondary text |
| `--nova-800` | `#2D3748` | Primary text on light |
| `--nova-900` | `#1A202C` | Headings, high contrast text |

---

## Typography — SM Sans (Nova variant)

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Scale
| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-xs` | 11px | 400 | 1.4 | Labels, captions |
| `--text-sm` | 13px | 400/500 | 1.5 | Secondary text, table cells |
| `--text-base` | 15px | 400 | 1.6 | Body text |
| `--text-lg` | 17px | 500 | 1.5 | Subheadings |
| `--text-xl` | 20px | 600 | 1.4 | Card titles |
| `--text-2xl` | 24px | 700 | 1.3 | Section headings |
| `--text-3xl` | 30px | 700 | 1.2 | Page titles |
| `--text-4xl` | 38px | 800 | 1.1 | Hero headlines |
| `--text-5xl` | 48px | 800 | 1.0 | Landing hero |

### Letter Spacing
- Headings: `-0.02em`
- Body: `0`
- Labels: `0.03em` (uppercase transforms)

---

## Spacing System — 4px Base

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, small chips |
| `--radius-md` | 8px | Buttons, inputs, cards |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Hero sections |
| `--radius-2xl` | 24px | Feature cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows — Nova Elevation

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(10,22,40,0.08)` | Card hover, inputs |
| `--shadow-md` | `0 4px 12px rgba(10,22,40,0.12)` | Dropdowns, popovers |
| `--shadow-lg` | `0 8px 24px rgba(10,22,40,0.16)` | Modals, overlays |
| `--shadow-xl` | `0 16px 48px rgba(10,22,40,0.20)` | Hero elements |
| `--shadow-glow` | `0 0 20px rgba(0,102,255,0.3)` | Focus glows, CTAs |

---

## Motion — Nova Swift

| Token | Value | Usage |
|---|---|---|
| `--ease-swift` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Default transitions |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success animations |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions |
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-base` | 250ms | Standard transitions |
| `--duration-slow` | 400ms | Page loads, reveals |

---

## Components

### Buttons

#### Primary Button
- Background: `var(--nova-blue)`
- Text: `#FFFFFF`, weight 600
- Padding: 12px 24px
- Border radius: 8px
- Shadow on hover: `var(--shadow-glow)`
- Transform: scale(1.02) on hover
- Active: scale(0.98)

#### Secondary Button
- Background: transparent
- Border: 1.5px solid `var(--nova-blue)`
- Text: `var(--nova-blue)`, weight 600
- Hover: fill with `rgba(0,102,255,0.08)`

#### Ghost Button
- Background: transparent
- Text: `var(--nova-500)`
- Hover: background `var(--nova-100)`

#### Danger Button
- Background: `var(--nova-red)`
- Text: `#FFFFFF`

#### Sizes
- `btn-sm`: 10px 16px, 13px font
- `btn-md`: 12px 24px, 15px font
- `btn-lg`: 14px 32px, 17px font

### Inputs

- Height: 48px
- Border: 1.5px solid `var(--nova-200)`
- Border radius: 8px
- Focus: border `var(--nova-blue)`, shadow `0 0 0 3px rgba(0,102,255,0.15)`
- Error: border `var(--nova-red)`, icon right
- Disabled: background `var(--nova-100)`, cursor not-allowed

### Cards

- Background: `var(--nova-white)`
- Border radius: 12px
- Shadow: `var(--shadow-sm)`
- Hover: `var(--shadow-md)`, translateY(-2px)
- Padding: 24px

### Badges / Status Chips

| Status | Background | Text |
|---|---|---|
| Pending | `#FFF3E0` | `#FF8C00` |
| In Transit | `#E3F2FD` | `#0066FF` |
| Delivered | `#E8F5E9` | `#00C853` |
| Cancelled | `#FFEBEE` | `#FF3B3B` |
| Processing | `#F3E5F5` | `#7B61FF` |

### Tables

- Header: background `var(--nova-100)`, weight 600, uppercase, letter-spacing 0.05em
- Rows: border-bottom `var(--nova-200)`, hover background `var(--nova-100)`
- Cell padding: 16px horizontal, 14px vertical
- Border radius on corners: 8px for container

### Navigation

- Top nav: height 72px, background `var(--nova-white)`, shadow `var(--shadow-sm)`
- Logo left, links center, actions right
- Active link: underline with gradient `var(--nova-blue)` → `var(--nova-cyan)`
- Mobile: hamburger menu, slide-in drawer from right

### Modals

- Overlay: rgba(10,22,40,0.6), backdrop-filter blur(4px)
- Container: max-width 560px, border-radius 16px
- Header: 24px font, weight 700
- Entrance: fade + scale from 0.95

### Tooltips

- Background: `var(--nova-900)`
- Text: `#FFFFFF`, 13px
- Arrow: 6px
- Animation: fade in 150ms

---

## Page Structure

### Landing Page
- Sticky nav with transparency → solid on scroll
- Hero: full-viewport, gradient overlay on background image
- Services section: horizontal scroll cards
- Shipping solutions: tab-based panel
- Stats/Trust: number counters with animation
- CTA section: gradient background
- Footer: multi-column with newsletter

### Signup Pages
- Split layout: form left, hero illustration right
- Progress indicator for multi-step
- Floating labels (animate up on focus)
- Inline validation on blur
- Password strength meter

### Dashboard Pages
- Sidebar navigation (280px), collapsible to 72px icons
- Top bar with search, notifications bell, user avatar
- Main content area: 12-column grid
- Widgets: drag-and-drop capable
- Quick stats row at top

### Tracking Page
- Search hero at top
- Timeline view (vertical)
- Map integration placeholder
- Collapsible detail sections

---

## Features & Interactions

### Form Validation
- Validate on blur, show error below input
- Success: green checkmark inside input
- Error: red border + icon + message
- Required fields: red asterisk after label

### Data Tables
- Sortable columns (click header)
- Filter dropdowns in header row
- Pagination: showing X-Y of Z, page buttons
- Row selection with checkbox
- Bulk actions bar appears when rows selected
- Empty state: illustration + message

### Notifications
- Bell icon with red dot for unread count
- Dropdown panel: grouped by time (Today, Earlier)
- Mark all read action
- Click to navigate to relevant page

### Loading States
- Skeleton screens (not spinners) for content areas
- Button loading: spinner replaces text, button disabled
- Page transition: fade overlay

### Empty States
- Friendly illustration
- Clear message + subtext explaining why
- CTA button to resolve (e.g., "Create your first shipment")

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, stacked nav |
| Tablet | 640–1024px | 2-column grid, collapsed sidebar |
| Desktop | 1024–1440px | Full layout, expanded sidebar |
| Wide | > 1440px | Max-width container, centered |

---

## Accessibility

- Color contrast ratio: minimum 4.5:1 for text
- Focus visible: outline 2px solid `var(--nova-cyan)`
- ARIA labels on all interactive elements
- Keyboard navigation: Tab, Enter, Escape
- Screen reader: proper heading hierarchy (h1 → h2 → h3)