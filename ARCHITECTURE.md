# Architecture

Technical decisions, system design, and component explanations for the `arsenic-docs` codebase.

---

## Table of Contents

- [Why no doc framework?](#why-no-doc-framework)
- [Routing model](#routing-model)
- [Layout hierarchy](#layout-hierarchy)
- [Styling architecture](#styling-architecture)
- [Component design decisions](#component-design-decisions)
  - [CodeBlock — custom highlighter](#codeblock--custom-highlighter)
  - [Search — client-side Fuse.js](#search--client-side-fusejs)
  - [TableOfContents — DOM-based](#tableofcontents--dom-based)
  - [Breadcrumbs — nav-config-driven](#breadcrumbs--nav-config-driven)
- [Data flow](#data-flow)
- [Performance considerations](#performance-considerations)
- [What was intentionally left out](#what-was-intentionally-left-out)

---

## Why no doc framework?

The most common question: why not use [Nextra](https://nextra.site/), [Fumadocs](https://fumadocs.vercel.app/), or [Docusaurus](https://docusaurus.io/)?

**The answer:** control over the design system.

The `@periodic` brand uses a specific OKLCH-based colour system, Roboto Slab as a display font, and a signal-specific component (`SignalCard`) that has no equivalent in any doc framework. Adapting an existing framework to this design would require the same amount of work as building from scratch — plus the ongoing constraint of the framework's opinion on layout and structure.

Building from scratch also means:
- Zero framework-level bundle overhead
- Full control over metadata and OpenGraph generation
- Custom syntax highlighting without a 200kb Shiki import
- Signal pages that are real Next.js routes (SEO-indexable, linkable, shareable)

The tradeoff is that standard doc framework features (MDX, auto-generated sidebars, versioning) require manual implementation if needed in the future. Currently none are needed.

---

## Routing model

The site uses the **Next.js App Router** with file-based routing. All routes are under `app/`.

```
/                           → app/page.tsx           (landing)
/ecosystem                  → app/ecosystem/page.tsx
/docs                       → app/docs/page.tsx       (introduction)
/docs/installation          → app/docs/installation/page.tsx
/docs/signals               → app/docs/signals/page.tsx
/docs/signals/hot-path      → app/docs/signals/hot-path/page.tsx
...
```

All `app/docs/**` routes share the `app/docs/layout.tsx` shell (Navbar + Sidebar + Breadcrumbs + TOC).

**Why page.tsx files instead of MDX?**

MDX would allow writing docs in Markdown, but it adds complexity:
- MDX components need to be explicitly configured in `next.config.mjs`
- Custom components (`CodeBlock`, `Callout`, `SignalCard`) still need to be imported or provided as MDX components globally
- TypeScript type safety is weaker in MDX files
- The existing signal pages are generated programmatically — JSX is easier to generate correctly than MDX

The TSX approach means every page is a typed React component, which is simpler to reason about and toolchain.

---

## Layout hierarchy

```
RootLayout (app/layout.tsx)
  ├── ThemeProvider (next-themes)
  ├── skip-link
  └── {children}
        ├── HomePage (app/page.tsx)                    — full-page, no Sidebar
        ├── EcosystemPage (app/ecosystem/page.tsx)     — no Sidebar
        └── DocsLayout (app/docs/layout.tsx)
              ├── Navbar
              ├── Sidebar (desktop, 64px fixed left)
              ├── MobileSidebar (drawer, hidden desktop)
              └── main#main-content
                    ├── Breadcrumbs
                    ├── {children}   ← individual doc page
                    └── TableOfContents (xl+ only, right side)
```

The `DocsLayout` is a server component. `Breadcrumbs`, `TableOfContents`, `Search`, and `MobileSidebar` are client components (they use `usePathname`, `useEffect`, or `useState`).

The `Sidebar` is a server component — it reads `lib/navigation.ts` at build time and renders static HTML. Active state is applied client-side by `MobileSidebar` (which mirrors the sidebar for mobile) and by CSS matching in `Sidebar.tsx` via `usePathname`.

---

## Styling architecture

### CSS variables (OKLCH)

All colours are defined as OKLCH CSS custom properties in `app/globals.css` under `:root` (light) and `.dark` (dark). Tailwind's theme extension in `tailwind.config.ts` maps all colour utilities to these variables.

OKLCH was chosen because:
- Perceptually uniform — equal numeric steps produce visually equal changes
- Better dark mode: dark backgrounds feel genuinely dark, not washed out
- Supports the full P3 colour gamut in modern browsers
- The blue primary (`oklch(0.488 0.243 264)`) is more vibrant than its sRGB equivalent

### `prose-doc` class

Rather than using `@tailwindcss/typography`, a custom `prose-doc` CSS class is defined in `globals.css`. This class directly styles HTML elements (`h1`, `h2`, `p`, `table`, etc.) with the same specificity and without the reset overhead of the Tailwind plugin.

The reason for a custom class: `@tailwindcss/typography` targets a generic reading experience, but arsenic-docs needs specific heading sizes, custom list bullets (using `›` character), numbered list circles with coloured backgrounds, and table styles that match the card design system.

### No CSS modules, no styled-components

All component styling is Tailwind utility classes with inline CSS variables for values that can't be expressed as utilities (e.g. complex OKLCH values for gradients and shadows). This keeps the styling co-located with the component and eliminates the CSS module indirection.

---

## Component design decisions

### CodeBlock — custom highlighter

**What it does:** Tokenises code strings and wraps tokens in `<span>` elements with colour classes.

**Why not Shiki?** Shiki's WASM bundle is ~1.8MB. For a documentation site that already has 60+ signal pages, adding 1.8MB of JS to every code block is not justified. The custom highlighter is ~80 lines of JavaScript and handles the four languages used on this site (TypeScript, JSON, Bash, CSS) with a multi-pass approach:

1. Strings are masked with placeholder tokens before keyword matching. This prevents `"const"` inside a string from being coloured as a keyword.
2. Keywords, types, operators, and comments are matched with targeted regex.
3. Placeholders are restored with the string colour applied.

The tradeoff is that the highlighter does not support all edge cases (template literals with complex expressions, decorators, some generics). For the code examples on this site, it is accurate enough.

### Search — client-side Fuse.js

**Why client-side?** The site is statically deployable with `next export` if needed (no server required). A server-side search API would require a backend or a third-party service. Fuse.js runs entirely in the browser on the static `lib/search-index.ts` array.

**Why not Algolia DocSearch?** Algolia is the standard choice for larger doc sites but requires an external service, an API key, a crawler configuration, and a waiting period for the free OSS tier to be approved. Fuse.js works immediately with zero external dependencies.

**Performance:** The search index is ~50 records, each under 200 bytes. The entire index is under 12KB — small enough to bundle with the component without lazy-loading. The Fuse.js library itself is ~24KB minified+gzipped. This is added only to the `Search` client component bundle and is not present on pages where search is not rendered.

**Fuse.js configuration:**
```ts
new Fuse(searchIndex, {
  keys: [
    { name: 'title',       weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'tags',        weight: 0.2 },
  ],
  threshold: 0.35,      // 0 = exact match, 1 = match anything; 0.35 is moderately strict
  includeScore: true,
  minMatchCharLength: 2,
})
```

### TableOfContents — DOM-based

**Why DOM-based?** Doc page content is defined in TypeScript JSX, not MDX or Markdown. There is no AST to extract headings from at build time without a custom remark/rehype plugin. The DOM query approach (`querySelectorAll('article.prose-doc h2, h3')`) runs client-side after hydration and works without any changes to individual page files.

**`IntersectionObserver` for active heading:** The TOC uses a single `IntersectionObserver` with `rootMargin: '-64px 0% -70% 0%'` to detect which heading is near the top of the viewport. The 64px top margin accounts for the fixed navbar. The 70% bottom margin means only headings in the top third of the viewport are considered "active".

**Limitation:** The TOC only sees `h2` and `h3` elements — `h4` and below are not included. This is an intentional constraint: pages that need `h4` headings should be split into multiple pages.

### Breadcrumbs — nav-config-driven

The `Breadcrumbs` component resolves segment labels from two sources (in order):

1. The `labelMap` built from `lib/navigation.ts` — covers all routes in the sidebar
2. `SEGMENT_LABELS` hardcoded map — covers intermediate segments like `/docs/adapters` that may or may not have a dedicated nav item
3. Fallback: title-case the URL segment (`mongoose` → `Mongoose`, `hot-path` → `Hot Path`)

This means breadcrumbs stay in sync with the sidebar labels automatically. The only manual step is updating `SEGMENT_LABELS` when a new top-level section is added that isn't in the nav config.

---

## Data flow

```
lib/navigation.ts
  └── Sidebar.tsx             (renders nav groups + items)
  └── MobileSidebar.tsx       (renders same nav, mobile drawer)
  └── Breadcrumbs.tsx         (derives labels from nav items)

lib/search-index.ts
  └── Search.tsx              (Fuse.js instance, search modal)

app/docs/<page>/page.tsx
  └── DocsLayout              (wraps all doc pages)
      └── TableOfContents.tsx (queries DOM for h2/h3 after render)
```

There is no global state management (no Zustand, no Context). The nav config is a static import. Search state (`open`, `query`, `results`) is local to the `Search` component. TOC state (`headings`, `active`) is local to `TableOfContents`.

---

## Performance considerations

- **All doc pages are server components** — they render to HTML at build time with no client JS unless a client component is imported.
- **Client components are leaf nodes** — `Search`, `TableOfContents`, `Breadcrumbs`, `ThemeToggle`, and `MobileSidebar` are client components but they are never parent components of the doc content. The content itself is static HTML.
- **No `useEffect` for data fetching** — all data is static. `useEffect` is used only for DOM queries (TOC), event listeners (Search keyboard shortcut), and scroll locking (MobileSidebar).
- **Fonts are loaded from Google Fonts via `next/font`** — they are preloaded and self-hosted by Next.js, with no layout shift.
- **No images in doc pages** — diagrams and illustrations do not exist yet. When they are added, they should use `next/image` with explicit `width` and `height` to prevent CLS.

---

## What was intentionally left out

| Feature | Why not included |
|---|---|
| MDX support | JSX pages are simpler, typed, and easier to code-generate |
| Versioned docs | `@periodic/arsenic` is pre-1.0; versioning adds complexity before the API is stable |
| i18n / translations | Not in scope for v1 |
| Full-text search (Algolia) | Fuse.js is sufficient for the current index size; Algolia can be added later |
| Comment system | Not appropriate for library documentation |
| `@tailwindcss/typography` | Replaced by custom `prose-doc` class for design system control |
| Shiki / Prism | Replaced by custom highlighter to avoid WASM bundle overhead |
| Turbopack | Next 14 Turbopack is stable but not yet the default; will adopt in a future update |
