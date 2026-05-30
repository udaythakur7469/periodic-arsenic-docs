# Changelog

All notable changes to the `arsenic-docs` website are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- `<Search />` component — Cmd+K fuzzy search modal powered by Fuse.js across all 60+ doc records
- `<Breadcrumbs />` component — automatic breadcrumb trail in the docs layout, driven from `lib/navigation.ts`
- `<TableOfContents />` component — "On this page" right-side anchor panel for `h2`/`h3` headings, visible at `xl` breakpoint
- `lib/search-index.ts` — static search record array covering all pages and all 30 signals
- OpenGraph and Twitter card metadata in `app/layout.tsx` with `metadataBase` pointing to `https://arsenicdev.online`
- `public/og.png` — 1200×630 social preview image
- `scroll-margin-top` on `.prose-doc h2` and `.prose-doc h3` to prevent sticky navbar overlap on anchor scroll
- `README.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `CHANGELOG.md` — project documentation

### Changed
- `app/docs/layout.tsx` — three-column layout (sidebar + content + TOC) replacing two-column; max content width adjusted from `820px` to `780px` to accommodate TOC column
- `app/layout.tsx` — `ThemeProvider` now uses `defaultTheme="system"` and `enableSystem` instead of forcing dark mode
- `components/Navbar.tsx` — navbar link hover replaced inline `onMouseEnter`/`onMouseLeave` JS with Tailwind `hover:text-foreground hover:bg-accent` classes
- `generate-signals.mjs` — generator now skips existing files (append-only); added JSDoc header documenting usage, behaviour, and the workflow for adding new signals

### Fixed
- Ecosystem badge count updated to reflect only packages confirmed live on npm

---

## [0.1.0] — 2026-05-01

### Added
- Initial release of the documentation website
- Landing page (`/`) — hero, features grid, signals preview, ecosystem section, footer
- Full docs section (`/docs`) with 6 categories: Getting Started, Core Concepts, Adapters, Frameworks, Exporters, Reference
- 30 signal pages under `/docs/signals/` — 7 critical, 9 warning, 14 info
- 4 adapter pages — Mongoose, Prisma, PostgreSQL (`pg`), Redis
- 2 framework pages — Express, Fastify
- Ecosystem page (`/ecosystem`) — full `@periodic` package browser
- `<CodeBlock />` — custom syntax highlighter (TypeScript, JavaScript, JSON, Bash, CSS); copy button; filename tab; line numbers
- `<Callout />` — four types: `tip`, `info`, `warning`, `danger`
- `<SignalCard />` — severity-aware signal display card with compact and full modes
- `<Sidebar />` and `<MobileSidebar />` — responsive navigation driven by `lib/navigation.ts`
- `<ThemeToggle />` — light/dark/system toggle via `next-themes`
- `prose-doc` CSS class — custom typography system (OKLCH tokens, no `@tailwindcss/typography` dependency)
- `generate-signals.mjs` — code-generation script for signal page scaffolding
- Accessibility: skip-link, `aria-label` on icon buttons, `aria-current="page"` on active sidebar links
- Full dark mode support via OKLCH CSS variable system

[Unreleased]: https://github.com/thaku7469/arsenic-docs/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/thaku7469/arsenic-docs/releases/tag/v0.1.0
