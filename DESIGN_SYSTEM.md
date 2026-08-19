# TAI Design System & UI Guidelines

This document outlines the **mandatory design system standards and UI rules** for all pages, components, modals, and charts across the TAI Operations & TAC application. All developers and AI agents must strictly follow these specifications.

---

## 1. Strict Spatial Rules: Margins, Gaps & Paddings

### 1.1 Margins and Gaps (Strict 8px Rule)
- **All margins and gaps across the entire project MUST be strictly 8px.**
- **No exceptions**: Do not use 4px, 6px, 10px, 12px, 14px, 20px, etc.
- **Tailwind tokens**: `gap-2` (8px), `m-2` (8px), `mb-2` (8px), `mt-2` (8px), `mx-2` (8px), `my-2` (8px).

### 1.2 Paddings (Strict 8px & 16px Rule)
- **All paddings across the entire project MUST be strictly either 8px or 16px.**
- **No other padding values are permitted** (no 4px, 6px, 10px, 12px, 24px, etc.).
- **Tailwind tokens**:
  - `p-2` / `px-2` / `py-2` (8px)
  - `p-4` / `px-4` / `py-4` (16px)
  - `px-4 py-2` (16px horizontal, 8px vertical)

### 1.3 Corner Radius Standard (8px for Containers, 4px for Buttons & Inputs)
- **Cards, Containers & Modals**: Must be strictly 8px (`rounded-[8px]`).
- **Buttons, Inputs, Selects, Badges & Interactive Controls**: Must be strictly 4px (`rounded-[4px]`).

---

## 2. Modal vs Sliding Window Rule (Mandatory Standard)

### 2.1 Centered Popups / Modals
- **Exclusively used for**:
  - Read-only system alerts and warning notices
  - Informational banners & tooltips
  - Quick confirmation prompts (where **no form input** or user data entry is required)
- **Constraint**: Centered popups must NEVER contain multi-field forms, builders, catalog selectors, or complex editing flows.

### 2.2 Sliding Windows (Right Drawers)
- **Mandatory for all interactive user workflows**:
  - **Create New Dashboard** (name, categories, archetype selection)
  - **Add Widget to Dashboard** (search, filters, catalog cards, custom metric builder)
  - **Edit Widget Configuration** (display title, column/row span dimensions)
  - Any drawer or form where the user enters text, configures settings, selects items, or provides inputs.
- **Drawer Structure**: Right-aligned sliding window with subtle backdrop blur, clean top header (with blue icon box and close button), scrollable body, and primary button footer.

---

## 3. Arista Blue Color System

### 3.1 Primary Arista Brand Blue Scale (`arista-*`)

| Scale | Hex Code | Token Name / Usage | Tailwind Utility Class |
| :--- | :--- | :--- | :--- |
| **50** | `#F9FBFF` | **Arista Surface** — Lightest surface tint & card hover | `bg-arista-50` / `bg-arista-surface` |
| **100** | `#ECF3FF` | **Arista Tint** — Primary soft active background / tab highlight | `bg-arista-100` / `bg-arista-tint` |
| **200** | `#D4E4FE` | Soft hover tint & light badge background | `bg-arista-200` |
| **300** | `#A1C4FC` | Active focus rings & subtle interactive highlights | `border-arista-300` |
| **400** | `#5E94EE` | Secondary interactive accents & active indicators | `text-arista-400` |
| **500** | `#2F6ADB` | Bright interactive blue (primary links & CTA buttons) | `bg-arista-500` |
| **600** | `#1B4EB8` | Deep interactive hover state | `bg-arista-600` |
| **700** | `#293283` | **Arista Indigo** — Secondary brand navy / sidebar background | `bg-arista-700` / `bg-arista-indigo` |
| **800** | `#002E5D` | **Arista Navy** — Primary brand header / dark blue anchor | `bg-arista-800` / `bg-arista-navy` |
| **900** | `#001F42` | Deep navy container surface & dark mode header | `bg-arista-900` |
| **950** | `#00122B` | Ultra deep navy surface (dark mode background) | `bg-arista-950` |

### 3.2 Neutral Slate Scale (`arista-neutral-*`)

| Scale | Hex Code | Token Name / Usage | Tailwind Utility Class |
| :--- | :--- | :--- | :--- |
| **50** | `#F2F4F6` | **Arista Canvas** — Main application background canvas | `bg-arista-neutral-50` / `bg-arista-canvas` |
| **100** | `#EAEEF3` | **Arista Border** — Standard card, table & container border | `border-arista-neutral-100` / `border-arista-border` |
| **200** | `#D5DEE7` | Container divider & hover border | `border-arista-neutral-200` |
| **300** | `#B3C1D0` | Subtle disabled text & secondary border | `text-arista-neutral-300` |
| **400** | `#7790A9` | **Arista Slate** — Muted text, secondary icons, subtitle text | `text-arista-neutral-400` / `text-arista-slate` |
| **500** | `#576B81` | Secondary body text & form labels | `text-arista-neutral-500` |
| **600** | `#3F4E60` | Primary body text | `text-arista-neutral-600` |
| **700** | `#2C3746` | Heading & sub-header dark text | `text-arista-neutral-700` |
| **800** | `#1A222D` | Dark surface container background | `bg-arista-neutral-800` |
| **900** | `#0F151D` | Dark mode surface background | `bg-arista-neutral-900` |
| **950** | `#070A0F` | Dark mode deep background | `bg-arista-neutral-950` |

### 3.3 Status, Severity & SLA Colors
All status indicators and badges use the 3-layer system: **Light Tinted Background + Soft Border + High-Contrast Saturated Text**.

| Status Level | Text Color | Background | Border | Example Usage |
| :--- | :--- | :--- | :--- | :--- |
| **High / Breached / Critical** | `#dc2626` | `#fef2f2` | `#fecaca` | Breached SLA, High severity badge, Overdue countdowns |
| **Medium / Nearing Breach** | `#d97706` | `#fffbeb` | `#fde68a` | Medium severity badge, Near-breach warning dots |
| **Low / SLA Met / Target** | `#16a34a` | `#f0fdf4` | `#bbf7d0` | Low severity badge, SLA OK segments, positive trends |
| **New Case / Info** | `#002E5D` | `#ECF3FF` | `#D4E4FE` | New case dot, active filters, info notices |

### 3.4 Button Gradient Standard
- **AI Buttons (Containing `AiIcon`)**: Must feature the signature **TAI AI Gradient** (`bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)] text-white hover:opacity-95`).
- **Standard Action Buttons**: Must use flat solid colors (`#002E5D` Arista Navy with `#0A3492` hover, `#16A34A` Green, `#ECF3FF` Canvas). **No gradients permitted on non-AI buttons**.

---

## 4. Component Construction Standard

```tsx
<div className="bg-white rounded-[8px] border border-arista-border p-4 shadow-xs flex flex-col justify-between h-full hover:bg-arista-surface transition-colors">
  {/* Card Header (8px margin bottom) */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-xs font-semibold text-arista-neutral-700 tracking-tight">Card Title</h3>
    <button className="text-arista-slate hover:text-arista-neutral-700 transition-colors cursor-pointer" title="Info">
      <Info className="w-3.5 h-3.5" />
    </button>
  </div>

  {/* Card Body (8px gap) */}
  <div className="flex-1 flex flex-col gap-2">
    {/* Visualizations or Content */}
  </div>
</div>
```

---

## 5. Summary Checklist for Code Reviews

- [x] **Margins & Gaps**: Only `8px` (`gap-2`, `m-2`, `mb-2`, `mt-2`, `mx-2`, `my-2`).
- [x] **Paddings**: Only `8px` (`p-2`, `px-2`, `py-2`) or `16px` (`p-4`, `px-4`, `py-4`, `px-4 py-2`).
- [x] **Corner Radius**: Only `8px` (`rounded-[8px]`).
- [x] **Font Family**: Poppins only.
- [x] **Font Weights**: Regular (400), Medium (500), and Semibold (600) only. No Bold, Extra Bold, or Black.
- [x] **Color Tokens**: Primary Arista Blue scale (`arista-*`) and Slate scale (`arista-neutral-*`).
