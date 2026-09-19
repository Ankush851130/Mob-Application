---
name: FlatLedger Mobile System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-card: '#FFFFFF'
  surface-subtle: '#F1F5F9'
  border-delicate: '#E2E8F0'
  border-translucent: rgba(226, 232, 240, 0.6)
  text-primary: '#0F172A'
  text-secondary: '#64748B'
  text-muted: '#94A3B8'
  balance-positive: '#059669'
  balance-positive-bg: '#ECFDF5'
  balance-negative: '#E11D48'
  balance-negative-bg: '#FFF1F2'
  accent-emerald-glow: rgba(5, 150, 105, 0.25)
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a modern, stress-free approach to shared household finances and peer-to-peer expense splitting. Shared living dynamics often introduce friction, awkward money reminders, and administrative clutter. This system resolves that cognitive burden with an ultra-clean, optimistic, and transparent visual language.

### Personality & Aesthetic
- **Reliable & Precise:** Anchored by crisp slate typography and structured balance sheets, communicating high financial security and algorithmic accuracy.
- **Friendly & Welcoming:** Soft rounded corners (`rounded-2xl` to `rounded-3xl`), generous touch ergonomics, and playful micro-interactions remove the tension from settling debts.
- **Modern Fintech Tactile:** A balanced hybrid of clean minimalism and subtle physical tactile depth—crisp white elevated cards resting atop cool slate backgrounds, complemented by refined ambient emerald drop-shadows on key calls to action.

### Target Audience & Mobile Focus
Designed specifically for flatmates, couples, roommates, and trip groups managing recurring bills, split groceries, and shared utilities on mobile devices. Prioritizes comfortable single-hand thumb zones, persistent bottom sheets, clear safe-area insets, and instant balance transparency at a single glance.

## Colors

The color palette centers on financial clarity and emotional ease. It uses a high-contrast pairing of vibrant emerald greens against deep slate typography, grounded on clean cool-tinted canvas neutrals.

### Roles & Semantic Usage
- **Primary (`#059669`) & Tertiary (`#10B981`):** Represents positive state, successful settlement, brand identity, and key interactive calls to action (Sign In, Add Expense, Settle Up).
- **Secondary (`#0F172A`):** Used for authoritative headings, critical data values, active bottom tab icons, and primary high-emphasis copy.
- **Neutral (`#F8FAFC` & `#F1F5F9`):** Provides a cool, crisp backdrop that makes pure white cards (`#FFFFFF`) float with clean optical separation.
- **Financial Balance Semantics:**
  - **Positive / You are owed (`#059669` on `#ECFDF5`):** Calm, clear emerald confirming a credit balance.
  - **Negative / You owe (`#E11D48` on `#FFF1F2`):** Crisp rose-coral calling attention to an outstanding debt without feeling punitive or alarming.
- **Borders & Dividers (`#E2E8F0` / `rgba(226, 232, 240, 0.6)`):** Extremely delicate low-contrast outlines keeping cards and inputs crisp against the canvas.

## Typography

The typography leverages **Plus Jakarta Sans** uniformly across all tiers. Its clean geometric construction, wide apertures, and friendly rounded terminals deliver immediate legibility on handheld screens while maintaining a polished financial presence.

### Hierarchy & Style Principles
- **Title and Logo Lockups:** Prominent titles use tight tracking (`-0.02em` to `-0.03em`) with heavy weight (`700` or `800`) to anchor views.
- **Section Headers & Form Labels:** Form descriptors use `label-caps` (`11px`, `fontWeight: 700`, uppercase with `0.06em` tracking) in muted slate (`#64748B`), establishing effortless field hierarchy.
- **Financial Balances:** Ledger figures utilize `currency-display` with distinct tabular figures (`font-variant-numeric: tabular-nums`) so numbers stack and align cleanly across list items.
- **Microcopy & Metadata:** Secondary dates, split breakdowns, and timestamps render in `body-sm` (`13px`) using `#94A3B8`.

## Layout & Spacing

The layout is built specifically for handheld mobile usage with safe-area consciousness, touch ergonomics, and single-handed reachability.

### Structural Model
- **Mobile Containerization:** The main mobile view operates inside a fluid single-column canvas bounded by `margin-mobile: 1rem` (16px) or `margin: 1.5rem` (24px) for roomy tablet views.
- **Vertical Rhythm:** A strict 4px/8px modular base scale governs all vertical stacking:
  - Micro item gap: `space-xs` (4px)
  - Inter-input and label gap: `space-sm` (8px)
  - Standard card interior padding: `space-lg` (24px)
  - Stacked module gap: `space-lg` (24px) to `space-xl` (32px)
- **Ergonomics & Bottom Affinity:** Core actions (Add Transaction, Confirm Split, Filter) are anchored within the thumb zone via sticky bottom navigation or animated elevated bottom sheets.
- **Safe Area Insets:** All top views conform to `env(safe-area-inset-top)` with extra breathing room for headers, while floating bottom buttons preserve `max(1rem, env(safe-area-inset-bottom))`.

## Elevation & Depth

Visual depth is achieved through high-luminance white surfaces contrasted against tinted neutral backgrounds, augmented by ultra-soft diffused drop shadows and hairline boundaries.

### Depth Tiers
- **Tier 0 (Canvas):** Flat base surface using `#F8FAFC`. No shadow.
- **Tier 1 (Subtle Inset / Inputs):** `#FFFFFF` or `#F1F5F9` nested containers surrounded by a hairline border `1px solid rgba(226, 232, 240, 0.8)`. 
- **Tier 2 (Elevated Cards):** Pure white cards (`#FFFFFF`) sitting on `#F8FAFC` with a delicate dual-layer ambient shadow:
  - `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 20px 25px -5px rgba(15, 23, 42, 0.05);`
  - Border: `1px solid rgba(241, 245, 249, 0.9)`.
- **Tier 3 (Floating Action Elements & CTA Glow):** Primary emerald buttons and floating action triggers leverage an ambient emerald blur:
  - `box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.35), 0 8px 10px -6px rgba(5, 150, 105, 0.2);`
- **Tier 4 (Bottom Sheets & Modals):** Backdrop overlay `rgba(15, 23, 42, 0.4)` with frosted blur `backdrop-filter: blur(8px)`, lifting bottom modals smoothly with `box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.08)`.

## Shapes

The design system adopts a welcoming, contemporary radius scale that emphasizes soft tactile surfaces without sliding into novelty bubble shapes.

### Corner Radius Mapping
- **Primary Buttons & Large Action Bars:** `rounded-2xl` (16px / 1rem) to `rounded-full` for chips and icon action triggers.
- **Form Inputs & Fields:** `rounded-2xl` (16px / 1rem) ensuring comfortable, finger-friendly targets with soft edge definition.
- **Content Cards & Auth Enclosures:** `rounded-3xl` (24px to 28px) delivering an elevated, modular tablet-like aesthetic.
- **Bottom Navigation Dock & Bottom Sheet Modals:** Rounded top-edge curvature of 28px (`rounded-t-[28px]`).
- **Pills, Badges & Avatars:** Full circle `rounded-full` (9999px) for flatmate profile photos, tag chips, and split ratio indicators.

## Components

### Buttons
- **Primary Button:** Background `#059669` transitioning to `#047857` on active press. Text in pure `#FFFFFF`, font weight `700`, height `54px`, `rounded-2xl`, with ambient emerald glow (`rgba(5, 150, 105, 0.3)`). Includes right-aligned icon chevron or arrow with subtle translation on hover/press.
- **Secondary / Ghost Button:** Transparent background, `border: 1.5px solid #E2E8F0`, text in `#0F172A`, active background `#F8FAFC`.
- **Text Action Links:** Clean bold text in `#059669` or `#0F172A` with no underline until hovered/pressed.

### Input Fields
- **Container:** Height `52px`, background `#FFFFFF` or `#F8FAFC`, border `1.5px solid #E2E8F0`, `rounded-2xl`.
- **States:**
  - *Focus:* Border transitions to `#059669` with an outer glow `box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15)`.
  - *Error:* Border switches to `#E11D48` with helper text in `12px` red below the input.
- **Icons & Affordances:** Leading icons (envelope, lock, dollar sign) sit inside the input at `18px` width colored `#94A3B8`. Password reveal toggle on the trailing edge.

### Ledger & Balance Cards
- **Balance Overview Card:** Elevated `#FFFFFF` card with `rounded-3xl`, inner padding `24px`. Displays net standing in `currency-display`.
- **Badge Indicators:** Small rounded status pills showing `You are owed` in `#059669` over `#ECFDF5` or `You owe` in `#E11D48` over `#FFF1F2`.

### Transaction List Items
- Clean horizontal rows with `48px` circular category avatar (groceries, rent, electricity, wifi) in soft slate/emerald tints.
- Title in `15px` `#0F172A` bold; subtitle displaying split participants and timestamp in `13px` `#64748B`.
- Trailing column displays user's split share with explicit `+` or `-` prefix styled semantically.

### Bottom Navigation Bar
- Persistent frosted dock pinned to screen bottom with `backdrop-filter: blur(12px)` and top border `1px solid rgba(226, 232, 240, 0.6)`.
- Features 4 primary tabs (Expenses, Groups, Activity, Profile) with a centered elevated floating emerald action button (`+`) for instant bill scanning or manual expense logging.