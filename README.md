# HSV EIU Portal

**Cổng Thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (Khóa II, Nhiệm kỳ 2026 – 2028)**

> *“Trí sáng - Đồng tâm - Vươn tầm - Cất cánh”*

HSV EIU Portal is the unified digital portal, student-services platform, and paperless E-Office for the **Vietnam Student Association at Eastern International University (HSV EIU)** for Term II (2026–2028). Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, it implements EIU's institutional design language alongside HSV EIU's official bylaws, organizational hierarchy, volunteer-day rules, e-certificate workflows, and *"Sinh viên 5 Tốt"* (5-Good Student) evaluation standards.

---

## Table of Contents

1. [Project Scope & Architecture](#1-project-scope--architecture)
2. [Current Implementation Status](#2-current-implementation-status)
3. [Tech Stack](#3-tech-stack)
4. [Prerequisites & Machine Setup](#4-prerequisites--machine-setup)
5. [Environment Variables](#5-environment-variables)
6. [Available Scripts & Verification](#6-available-scripts--verification)
7. [Testing Roles & Multi-Position Context Switching](#7-testing-roles--multi-position-context-switching)
8. [Repository Structure](#8-repository-structure)
9. [Domain Rules & Design Standards](#9-domain-rules--design-standards)
10. [Contributor & AI Workflow Guidelines](#10-contributor--ai-workflow-guidelines)
11. [Team & Credits](#11-team--credits)

---

## 1. Project Scope & Architecture

The application is organized into **three Next.js App Router route groups** serving distinct audiences:

### 1.1 Public Portal — `src/app/(public)` (No Login Required)
* **`/`** — Home page featuring the angled polygon Hero banner, Bento Showcase ("Khám phá HSV EIU"), Bento Magazine editorial news, SV5T event filter pills, and the *Gương sáng Sinh viên 5 tốt* infinite seamless carousel.
* **`/gioi-thieu`** — Introduction to HSV EIU and Term II Executive Board / Inspection Committee structure.
* **`/tin-tuc` & `/tin-tuc/[slug]`** — News hub (feathered-scrim carousel + 3×3 grid with pagination) and article detail pages, synced with `[HSV NEWS]` data.
* **`/su-kien`** — Event calendar with multi-criteria filtering (status tags, volunteer days, training points `+1 ĐRL`, time of day, location) and registration modal.
* **`/to-chuc` & `/to-chuc/[slug]`** — Directory and micro-sites for the **25 Faculty Branches** (`CIT`, `BBS`, `SET`, `SNS`) and **30 Clubs / Teams / Groups**.
* **`/cuoc-thi`** — Public overview and entry point for Online Quiz competitions.
* **`/van-ban`** — Public archive of HSV EIU decisions, notices, and guidelines.
* **`/tra-cuu-gcn`** — E-Certificate & Recognition Decision verification portal (by student ID / decision / certificate code).

### 1.2 Student & Member Portal — `src/app/(student-portal)`
* **`/portal`** — Personal student workspace (`?tab=...` / interactive modules):
  * **Sổ tay Sinh viên 5 Tốt (`sv5t`)** — 5-Good Student personal progress tracker across 5 criteria (*Đạo đức, Học tập, Thể lực, Tình nguyện, Hội nhập*).
  * **Máy tính GPA (`gpa`)** — Credit-weighted GPA calculator prioritizing `MAX(annual GPA, cumulative GPA)` per Decision `09/QĐ-HSV`.
  * **Kho E-Certificate (`certs`)** — Issued certificates and volunteer-day totals.
  * **Phòng thi Trắc nghiệm (`quiz`)** — Timed Online Quiz exam system (`ContestExamModal` in `src/components/shared/contest-system.tsx`).
  * **Thẻ Hội viên Số (`idcard`)** — Digital member ID card with decoded `@eiu.edu.vn` email and 10-digit student ID metadata.
  * **Hộp thư Lắng nghe (`voice`)** — Student feedback and opinion submission box.

### 1.3 Internal E-Office & Management Workspace — `src/app/(workspace)`
* **`/workspace`** — Role-gated internal workspace (RBAC Levels 2–6) with 8 operational modules defined in `src/app/(workspace)/workspace/layout.tsx`:
  * `overview` — System-wide executive dashboard across 55 grassroots units (25 Branches + 30 Clubs/Teams).
  * `certificates` — Volunteer-day pre-approval (≥ 3-day rule), Appendix 1 ascending-MSSV list export, and 7-working-day SLA tracking (`QĐ 28/QĐ-HSV`).
  * `sv5t` — 3-tier SV5T review board (Branch/Club → Specialized Dept → Standing Committee) and Top 10% Outstanding candidate ranking (`QĐ 09/QĐ-HSV`).
  * `collective` — *Tập thể Sinh viên 5 Tốt* compliance monitor for all 25 Branches (100% registration, ≥ 30% achievement, 0% violations).
  * `documents` — Digital document registry & 4-step online plan approval workflow.
  * `tgpt` — Propaganda & Movement Department (`Ban TG-PT`, 2 divisions, 6 subteams), Shock Volunteer Team (`Đội CTVXK`), and CMS publishing.
  * `office` — Office `206.B06` management (duty schedule, equipment loans, official seal ledger, co-managed by Chief of Office & General Secretary per `QĐ 24/QĐ-HSV`).
  * `meetings` — Paperless Meeting room, online resolution voting, and Inspection Committee (`Ban Kiểm tra`) audit view (`QĐ 23/QĐ-HSV`).

### 1.4 API Routes — `src/app/api`
* **`GET /api/news/facebook-feed`** — Fetches `[HSV NEWS]` posts from the official HSV EIU Facebook Fanpage (`https://www.facebook.com/eiuhsv/`) via Facebook Graph API `v19.0`, automatically falling back to `FALLBACK_HSV_NEWS` when offline or unconfigured.

---

## 2. Current Implementation Status

This repository is currently an **active, high-fidelity interactive frontend prototype**:
* **Data & Auth Simulation:** All portal pages, organizational directories, 10-digit MSSV / `@eiu.edu.vn` email decoders, events, certificates, and E-Office workflows run locally on structured TypeScript data in `src/data/mock-data.ts` and client-side role state in `src/context/role-context.tsx`.
* **Live News Integration (Optional):** `src/lib/services/facebook-news.ts` supports live Facebook Graph API integration if `FB_PAGE_ACCESS_TOKEN` is provided, and gracefully falls back to curated local data otherwise.
* **Target Production Backend (Planned):** Authentication (`@eiu.edu.vn` Google OAuth), PostgreSQL 15+ tables, enums, Row Level Security (RLS), Storage, and Realtime on **Supabase** are fully specified in [`docs/03_DATABASE_SCHEMA.md`](docs/03_DATABASE_SCHEMA.md) and [`docs/01_PRD.md`](docs/01_PRD.md) for upcoming integration phases.

---

## 3. Tech Stack

| Layer | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.6` (`cacheComponents: true`, `partialPrefetching: true`) |
| **UI Library** | React / React DOM | `19.3.0` |
| **Language** | TypeScript | `^5` (`strict: true`, path alias `@/*` → `./src/*`) |
| **Styling** | Tailwind CSS | `^4` with `@tailwindcss/turbopack` |
| **Icons** | `lucide-react` | `^1.63.0` |
| **Typography** | `next/font/google` | `Montserrat`, `Be Vietnam Pro`, `Crimson Text` (Vietnamese subset) |
| **Linting** | ESLint | `^9` with `eslint-config-next` (`16.4.6`) |
| **Planned Backend** | Supabase | Auth, PostgreSQL 15+ (RLS), Storage, Realtime (per `docs/03_DATABASE_SCHEMA.md`) |

---

## 4. Prerequisites & Machine Setup

Follow these steps to set up a fresh developer machine and continue working on the project.

### 4.1 Prerequisites
* **Node.js `>= 20.9.0`** (required by Next.js `16.4.6`; recommended: Node 20 LTS, 22 LTS, or newer via [`nvm`](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org/)).
* **npm** (bundled with Node.js; `package-lock.json` is committed, so prefer `npm` to avoid lockfile drift).
* **Git**
* **Recommended IDE Extensions** (VS Code / Cursor / Antigravity):
  * ESLint (`dbaeumer.vscode-eslint`)
  * Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
  * TypeScript and JavaScript Language Features (built-in)

Verify your local toolchain:
```bash
node -v   # Must be >= v20.9.0
npm -v
git --version
```

### 4.2 Clone & Install
```bash
git clone https://github.com/Yukanya/C-NG-TH-NG-TIN--I-N-T--HSV-TR--NG.git
cd C-NG-TH-NG-TIN--I-N-T--HSV-TR--NG
npm install
```

### 4.3 Run the Development Server
No database or API keys are required to run the app locally. Start the dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Environment Variables

The application runs **out of the box** without `.env.local` by using built-in mock data (`src/data/mock-data.ts`) and fallback news (`FALLBACK_HSV_NEWS`).

If you want to enable optional integrations, create a `.env.local` file at the project root (`.env*` is already ignored by `.gitignore`):

```env
# Optional: Live Facebook Fanpage feed for /api/news/facebook-feed
# Used in src/lib/services/facebook-news.ts
FB_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
FB_PAGE_ID=eiuhsv
```

* **`FB_PAGE_ACCESS_TOKEN`** *(optional)* — Facebook Graph API v19.0 Page Access Token. When unset, `getFacebookHsvNews()` returns `FALLBACK_HSV_NEWS`.
* **`FB_PAGE_ID`** *(optional, default: `eiuhsv`)* — Target Facebook Page ID or handle.
* **`VERCEL_OIDC_TOKEN`** *(managed)* — Automatically injected if you link/pull environment settings with the Vercel CLI (`vercel env pull`). Never commit `.env.local` or secrets to Git.

---

## 6. Available Scripts & Verification

Run these commands from the repository root:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server on `http://localhost:3000`. |
| `npm run build` | Build the production bundle (`.next/`). |
| `npm run start` | Serve the production build locally (run `npm run build` first). |
| `npm run lint` | Run ESLint (`eslint-config-next/core-web-vitals` + `typescript`). |
| `npx tsc --noEmit` | Run strict TypeScript type-checking without emitting files. |

> **Before committing:** Always run `npx tsc --noEmit`, `npm run lint`, and check affected pages in the browser.

---

## 7. Testing Roles & Multi-Position Context Switching

To test all 6 permission levels (`role_level` 1–6) and dual-hat appointments without setting up OAuth first, use the **`PersonaSwitcherBar`** pinned at the very top of every page (`src/components/shared/persona-switcher.tsx`):

1. **Persona Selector (10 built-in profiles in `src/context/role-context.tsx`):**
   * Switch between Level 6 (*Chủ tịch HSV Trường*, *Phó Chủ tịch*, *UV Ban Thư ký*), Level 5 (*UV BCH / Ban Kiểm tra*), Level 4 (*Chánh Văn phòng / Trưởng & Phó Ban Chuyên môn*), Level 3 (*Chi hội trưởng / Chủ nhiệm CLB / Đội trưởng*), and Level 1 (*Sinh viên EIU mẫu*).
2. **Role / Unit Context Switcher:**
   * For multi-role officers (e.g., an officer who is simultaneously on `Ban Kiểm tra`, `Ban TC-XDH`, and `BCH Chi hội 25CNTT01`), switch active working unit/position directly from the top bar without logging out.
3. **Global Quick Search:**
   * Search across certificates (`ISSUED_CERTIFICATES`), official documents (`OFFICIAL_DOCUMENTS`), news (`NEWS_POSTS`), events (`EVENT_ITEMS`), branches (`BRANCH_UNITS`), and clubs (`CLUB_UNITS`) right from the top bar.

---

## 8. Repository Structure

```text
.
├── AGENTS.md                        # Agent & developer pre-flight rules (Next.js + HSV architecture)
├── GEMINI_RULES.md                  # Mandatory business, organizational & coding constitution
├── PRODUCT.md                       # Product scope, personas, constraints & brand commitments
├── DESIGN.md                        # Master design system specification
├── next.config.ts                   # Next.js 16 config (cacheComponents, turbopack, remote image hosts)
├── eslint.config.mjs                # ESLint 9 flat config
├── tsconfig.json                    # TypeScript strict config (@/* -> ./src/*)
├── docs/
│   ├── 01_PRD.md                    # Full Product Requirements Document (Term II, 2026–2028)
│   ├── 02_DESIGN_SYSTEM.md          # Detailed UI patterns, colors, typography & hardening rules
│   └── 03_DATABASE_SCHEMA.md        # Target Supabase PostgreSQL 15+ schema, enums & relations
├── KNOWLEDGE/                       # Official HSV EIU source documents (.docx, .pdf, .xlsx, .html)
│                                    # (QĐ 09, QĐ 23, QĐ 24, QĐ 28, TB 04, EIU Student Handbook, etc.)
├── graphify-out/                    # Prebuilt knowledge graph of the codebase & specs
├── public/
│   └── images/                      # EIU & HSV logos, SV5T honoree portraits (/images/sv5t/*)
└── src/
    ├── app/
    │   ├── layout.tsx               # Root layout, Google Fonts, WCAG skip-link, RoleProvider, PersonaSwitcherBar
    │   ├── globals.css              # Tailwind v4 theme tokens & motion classes (.eiu-*)
    │   ├── (public)/                # Public portal pages & layout
    │   ├── (student-portal)/portal/ # Student & member portal
    │   ├── (workspace)/workspace/   # Internal E-Office & management workspace
    │   └── api/news/facebook-feed/  # Facebook Graph API proxy route
    ├── components/
    │   ├── public/                  # PublicNavbar, PublicFooter, SubpageBanner
    │   └── shared/                  # PersonaSwitcherBar, ContestCard, ContestExamModal
    ├── context/
    │   └── role-context.tsx         # RoleProvider & 10 demo personas across 6 RBAC levels
    ├── data/
    │   └── mock-data.ts             # Org units (25 Branches, 30 Clubs), staff, events, docs, email/MSSV decoders
    ├── lib/
    │   └── services/facebook-news.ts# Facebook [HSV NEWS] fetcher + fallback dataset
    └── types/
        └── index.ts                 # Shared TypeScript interfaces & enums
```

---

## 9. Domain Rules & Design Standards

Collaborators must preserve the following non-negotiable domain and visual rules:

### 9.1 Core Business & Legal Rules (per `KNOWLEDGE/` & `docs/01_PRD.md`)
* **Email & Student ID Parsing:** Only `@eiu.edu.vn` accounts are permitted in production auth. Email prefixes encode faculty (`cit`, `bbs`, `set`, `sns`) and cohort (`21`–`26`), and MSSV follows EIU's 10-digit format.
* **Term II Org Structure:** 15 Executive Board members (`BCH`), 5 Inspection Committee members (`BKT`), 3 Specialized Departments (`Văn phòng 206.B06`, `Ban TC-XDH`, `Ban TG-PT` + `Đội CTVXK`), 25 Faculty Branches, and 30 Clubs/Teams/Groups.
* **Volunteer Days & E-Certificates (`28/QĐ-HSV`):**
  * Volunteer-day pre-approval must be submitted **≥ 3 days** before the event.
  * Role multipliers: Organizer Leader = `×3`, Organizer Member = `×2`, Participant/CTV = `×1`; Blood donation = `5 days`.
  * Appendix 1 lists must be sorted **ascending by MSSV**.
  * **7-working-day SLA** from valid list submission to Decision issuance.
  * Appendix 2 E-Certificates display `(Đã ký)` by default (do not insert stamp/signature images without explicit Standing Committee approval flag).
* **Sinh viên 5 Tốt (`09/QĐ-HSV`, 2026 amendment):**
  * Academic GPA `≥ 3.0/4.0` using credit-weighted `MAX(annual GPA, cumulative GPA)`.
  * 3-tier approval (`Cấp 1 Cơ sở → Cấp 2 Ban Chuyên môn → Cấp 3 Thường trực`), Top **10%** cap for *SV5T Tiêu biểu Toàn trường*, and Collective SV5T checks (100% registered, ≥ 30% achieved, 0% violations).

### 9.2 Visual System ("70% EIU Academic Heritage × 30% HSV Youth Identity")
* **Colors:** Institutional Navy (`#133F68`, `#02294E`, `#144069`), HSV Blue (`#0054A6`), Digital Cyan (`#00BCFF`), EIU Crimson (`#C10230`), Active Gold (`#FCB900`), Academic Sand (`#A68556`, `#EAE3D2`, `#DED1BE`).
* **Fonts:** `Montserrat` (headings, nav, badges), `Be Vietnam Pro` (body, forms, tables), `Crimson Text` (academic footer, legal doc numbers, 10-digit MSSV, KPIs — replacing monospace).
* **Geometry & Layout:** `0px` (`rounded-none`) for cards, dropdowns, tables, and media frames; `3–4px` (`rounded`) for form inputs; `9999px` (`rounded-full`) for filter pills/tabs. Follow `.agents/rules/ui-layout-standards.md` when editing public news/event cards (e.g., fixed `+1 ĐRL` when training points apply, feathered scrim gradients, WCAG 2.1 AA contrast & `prefers-reduced-motion`).
* **Remote Images:** Any external image hostname added to `NEWS_POSTS` or events must be whitelisted in `images.remotePatterns` inside `next.config.ts`.

---

## 10. Contributor & AI Workflow Guidelines

1. **Read Before Editing:** Before modifying code, UI, or database specs, read:
   * [`GEMINI_RULES.md`](GEMINI_RULES.md)
   * [`docs/01_PRD.md`](docs/01_PRD.md)
   * [`DESIGN.md`](DESIGN.md) & [`docs/02_DESIGN_SYSTEM.md`](docs/02_DESIGN_SYSTEM.md)
   * [`docs/03_DATABASE_SCHEMA.md`](docs/03_DATABASE_SCHEMA.md)
   * [`.agents/rules/ui-layout-standards.md`](.agents/rules/ui-layout-standards.md)
2. **Next.js 16 Note:** This project uses Next.js `16.4.6` (`AGENTS.md` is auto-maintained by `next dev`). Check `node_modules/next/dist/docs/` if you are unsure about Next.js 16 APIs such as `cacheComponents` or `partialPrefetching`.
3. **Keep Docs & Knowledge Graph Synced:**
   * Update `docs/` whenever business rules, UI standards, or schema definitions change.
   * If you use `graphify`, run `graphify update .` after modifying code files to keep `graphify-out/` current (see [`.agents/rules/graphify.md`](.agents/rules/graphify.md)).

---

## 11. Team & Credits

* **Unit:** Ban Chấp hành Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông — Khóa II (Nhiệm kỳ 2026 – 2028)
* **Project Lead & Chief Architect:** Trương Châu Phước Lộc (Chủ tịch Hội Sinh viên Trường)
* **Development Team:** Trương Châu Phước Lộc, Bùi Nhật Linh, Vũ Đức Tùng
* **Faculty Advisor:** Thầy Nguyễn Xuân Cường
