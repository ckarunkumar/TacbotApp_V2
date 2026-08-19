---
description: Strict Design System Rules for TACBot Dashboard
---

# Design System Rules (STRICT ENFORCEMENT)

Every component and style in this project must strictly comply with the following non-negotiable rules:

### 1. Spacing & Gaps
- **Gaps & Margins**: Must be **EXACTLY 8px** (`gap-2`, `m-2`, `mt-2`, `mb-2`, `mx-2`, `my-2`). No exceptions.
- **Paddings**: Must be **EXACTLY 8px (`p-2`, `px-2`, `py-2`) or 16px (`p-4`, `px-4`, `py-4`)**.

### 2. Corner Radius Standard (STRICT)
- **Cards, Containers & Modals**: 8px (`rounded-[8px]`).
- **Buttons, Inputs, Selects & Interactive Controls**: 4px (`rounded-[4px]`).

### 3. Tooltip Component Standard
- **Background**: `#182235` (dark slate/navy).
- **Text Color**: `#ffffff` (white).
- **Typography**: Poppins, Regular (`400`), `text-[11px]`.
- **Corner Radius**: `8px` (`rounded-[8px]`).
- **Padding**: `px-4 py-2` (16px horizontal, 8px vertical).
- **Arrow Pointer**: Center directional triangular arrow matching `#182235`.
- **Shadow**: `shadow-lg`.

### 4. Grid Sizing Units
- **Height Unit (1 Row)**: Exactly **112px** (height of SLA Health card).
- **Width Unit (1 Col)**: Exactly **1 Column** in the 4-column layout.

### 5. Typography Rules
- **Font Family**: Poppins only.
- **Allowed Font Weights**: Regular (`400`), Medium (`500`), and Semibold (`600`).
- **PROHIBITED Weights**: NEVER use Bold (`700`), Extra Bold (`800`), or Black (`900`).

### 6. Color Theme & Gradient Rules
- **Primary Color**: **Arista Blue** (`#002E5D` / `#0A3492` hover).
- **AI Button Gradient**: Any button containing `AiIcon` MUST feature signature TAI AI Gradient (`bg-[linear-gradient(135deg,#005899_0%,#006eb0_50%,#0181c4_100%)]`). Standard non-AI buttons use flat solid colors (no gradients).
- **Canvas**: `#F2F4F6` (`arista-neutral-50`).
- **Borders**: `#EAEEF3` (`arista-neutral-100`).
- **Tone**: Mild, matured, professional B2B styling. Avoid loud bright fills.
