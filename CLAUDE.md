# CLAUDE.md

## Project: SplitBill AI (Stateless, Mobile-First)

This project is a mobile-first web application that scans receipts using AI and allows users to split bills interactively.

========================
CORE PRINCIPLES
========================

1. STATELESS APPLICATION
- NO database allowed
- NO backend persistence
- All data lives in frontend state
- Optional: localStorage only

2. MOBILE-FIRST DESIGN (MANDATORY)
- Always design for mobile first
- Avoid wide layouts
- NO horizontal scroll
- Use card-based UI instead of tables on mobile
- Large touch targets (min height 48px)

3. SIMPLE ARCHITECTURE
- Do not over-engineer
- Keep logic separated:
  - UI
  - State
  - Utils (calculation, parsing)

========================
TECH STACK RULES
========================

- Frontend: React (Vite) + TypeScript
- Styling: Tailwind CSS ONLY
- State: Zustand or useState
- NO Redux
- NO database (MongoDB, MySQL, etc)

Backend (ONLY IF NEEDED):
- Minimal API for OCR (serverless or express)
- No business logic in backend
- Backend ONLY handles AI request

========================
AI OCR RULES
========================

- AI is used ONLY for:
  - Extracting receipt items

- AI must return STRICT JSON:
[
  {
    "name": string,
    "price": number,
    "qty": number
  }
]

- MUST validate AI response:
  - Remove invalid rows
  - Ignore totals, tax, discounts
  - Ensure price is number
  - Ensure qty >= 1

- NEVER trust AI blindly

========================
UI RULES
========================

- Mobile = Card layout
- Desktop = optional table

Each item MUST include:
- Name (editable input)
- Price (editable)
- Qty (editable)
- Split (editable)
- Result per person (auto)

- Use Tailwind:
  - rounded-xl
  - shadow-sm
  - p-4
  - gap-4

========================
FEATURE RULES
========================

Required:
- Upload receipt image
- Scan receipt (AI)
- Editable items
- Split per item
- Real-time calculation
- Sticky bottom summary

Optional:
- Add/remove item
- Reset
- Export JSON

========================
CALCULATION RULES
========================

For each item:
- total = price * qty
- perPerson = total / split

- Must update in real-time
- Must handle edge cases:
  - split = 0 (prevent)
  - invalid numbers

========================
CODE STRUCTURE
========================

Use feature-based structure:

src/
  features/
    receipt/
      components/
      hooks/
      utils/
      types/
  shared/
    components/
    ui/

========================
DO NOT DO THIS
========================

- Do NOT add database
- Do NOT add authentication
- Do NOT redesign UI drastically
- Do NOT switch to desktop-first
- Do NOT introduce complex state libraries
- Do NOT trust AI output without validation
- Do NOT mix logic inside components

========================
EXPECTED BEHAVIOR
========================

- Keep code clean and modular
- Prefer reusable components
- Keep functions small and focused
- Maintain type safety
- Optimize for mobile UX

========================
GOAL
========================

Deliver a clean, simple, mobile-first Split Bill app where:
- AI extracts receipt data
- User can edit and split easily
- Everything works without database