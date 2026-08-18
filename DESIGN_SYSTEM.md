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

### 3.1 Backgrounds & Surfaces
| Token Name | Hex Code | Tailwind Equivalent / Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#f1f4fa` | `bg-[#f1f4fa]` — Main page body background |
| **Card Surface** | `#ffffff` | `bg-white` — Dashboard cards, modals, popovers |
| **Subtle Neutral Surface** | `#f8fafc` | `bg-slate-50` — Hover rows, table headers, inactive pill backgrounds |
| **Border Neutral** | `#e2e8f0` | `border-slate-200/85` — Standard card and container borders |
| **Divider Line** | `#f1f5f9` | `border-slate-100` — Separator between list items |

### 3.2 Brand & AI Accents
| Purpose | Colors / Gradient | Class / Usage |
| :--- | :--- | :--- |
| **Primary Accent (Blue)** | `#1d4ed8` / `#2563eb` | `text-[#1d4ed8]`, active tab underline, highlighted keywords |
| **AI Glow & Buttons (Purple/Pink)** | `linear-gradient(to right, #9333ea, #d946ef)` | `bg-gradient-to-r from-[#9333ea] to-[#d946ef]` — Send button, AI highlights |
| **Assistant Glow Layer** | Multi-color subtle aura | `from-blue-300/40 via-purple-300/40 to-pink-300/40 blur-md` |
| **Dark Navy Brand** | `#0e3b6f` / `#1e2e68` | `bg-[#0e3b6f]` — Logo container, primary "TAI Chat" button |

### 3.3 Status, Severity & SLA Colors
All status indicators and badges use the 3-layer system: **Light Tinted Background + Soft Border + High-Contrast Saturated Text**.

| Status Level | Text Color | Background | Border | Example Usage |
| :--- | :--- | :--- | :--- | :--- |
| **High / Breached / Critical** | `#dc2626` | `#fef2f2` | `#fecaca` | Breached SLA, High severity badge, Overdue countdowns |
| **Medium / Nearing Breach** | `#d97706` | `#fffbeb` | `#fde68a` | Medium severity badge, Near-breach warning dots |
| **Low / SLA Met / Target** | `#16a34a` | `#f0fdf4` | `#bbf7d0` | Low severity badge, SLA OK segments, positive trends |
| **New Case / Info** | `#2563eb` | `#eff6ff` | `#bfdbfe` | New case dot, active filters, info notices |

### 3.4 Treemap Progressive Green Hierarchy
1. **Dominant Tier (e.g. Cisco ~35-40%)**: `#94d47c` (`border-[#83c66a]`)
2. **Second Tier (e.g. Juniper ~20-25%)**: `#b6e6a1` (`border-[#a3da8b]`)
3. **Third Tier (e.g. Arista ~15%)**: `#daf2cb` (`border-[#cbe6bb]`)
4. **Fourth Tier (e.g. Fortinet ~10%)**: `#e6f7db` (`border-[#d6ebd0]`)
5. **Fifth Tier (e.g. Palo Alto ~6%)**: `#f0fae8` (`border-[#e1f0d8]`)
6. **Sixth Tier (e.g. F5 ~3%)**: `#f6fcf0` (`border-[#e8f5e1]`)
7. **Long Tail / Others**: `#fafefa` (`border-[#eef8eb]`)

---

## 4. Component Construction Standard

```tsx
<div className="bg-white rounded-xl border border-slate-200/85 p-4 shadow-xs flex flex-col justify-between h-full">
  {/* Card Header (8px margin bottom) */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-xs font-semibold text-slate-800 tracking-tight">Card Title</h3>
    <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Info">
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
- [x] **Corner Radius**: Only `2px` (`rounded-[2px]`).
- [x] **Font Family**: Poppins only.
- [x] **Font Weights**: Regular (400), Medium (500), and Semibold (600) only. No Bold, Extra Bold, or Black.
