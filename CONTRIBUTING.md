# Contributing to arsenic-docs

Thanks for wanting to improve the `@periodic/arsenic` documentation. This guide covers everything from fixing a typo to adding a brand-new section.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Content Guidelines](#content-guidelines)
  - [Writing style](#writing-style)
  - [Code examples](#code-examples)
  - [Using components](#using-components)
- [Adding and Editing Pages](#adding-and-editing-pages)
  - [Existing doc page](#editing-an-existing-doc-page)
  - [New doc page](#adding-a-new-doc-page)
  - [Signal pages](#adding-or-editing-a-signal-page)
  - [Search index](#updating-the-search-index)
- [PR Checklist](#pr-checklist)
- [Issue Templates](#issue-templates)

---

## Code of Conduct

Be respectful. This is a small project maintained by one developer — please keep feedback constructive and assume good intent.

---

## Ways to Contribute

You do not need to be a developer to contribute. The most valuable contributions are often content improvements.

| Contribution type | Skill needed |
|---|---|
| Fix a typo | Minimal — edit one file |
| Correct a factual error in docs | Minimal — edit one file |
| Improve a signal's "How to Fix" section | Moderate — understand the signal |
| Add a missing code example | Moderate — TypeScript knowledge |
| Add a missing adapter or framework page | Advanced — full page authoring |
| Report a broken link or layout bug | None — just open an issue |
| Suggest a new page or section | None — just open an issue |

---

## Development Setup

### Requirements

- **Node.js** 18.17 or later
- **npm** 9 or later

### Steps

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/udaythakur7469/arsenic-docs.git
cd arsenic-docs

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The site is live at [http://localhost:3000](http://localhost:3000) with hot reload.

---

## Contribution Workflow

1. **Open an issue first** for non-trivial changes (new pages, structural edits). This lets us align before you spend time writing.

2. **Create a branch** from `main`:

```bash
git checkout -b docs/fix-mongoose-example
# or
git checkout -b docs/add-drizzle-adapter-page
```

3. **Make your changes.** Follow the [Content Guidelines](#content-guidelines) below.

4. **Test locally.** Run `npm run build` before pushing — it catches TypeScript errors and broken imports that the dev server misses.

5. **Open a PR** against `main`. Fill in the PR template. Link the related issue if one exists.

6. **Address review feedback.** PRs are typically reviewed within a few days.

---

## Content Guidelines

### Writing style

- **Second person, present tense.** "You can configure the threshold with…" not "The threshold can be configured with…"
- **Short sentences.** One idea per sentence. If a sentence needs a semicolon, split it.
- **Active voice.** "The adapter intercepts queries" not "Queries are intercepted by the adapter."
- **No marketing language.** Avoid "powerful", "blazing fast", "seamless". Describe what the thing does, not how great it is.
- **Signal names in code font.** Always write signal names as `inline code`: `hot_path`, `n_plus_one`.
- **Callouts sparingly.** One or two `<Callout>` components per page at most. If everything is a warning, nothing is.

### Code examples

Every code example must be:

- **Runnable as shown** — no placeholder logic that silently does nothing
- **Minimal** — show only what's needed to illustrate the point
- **Annotated with comments** where the behaviour isn't obvious
- **TypeScript** unless the page specifically demonstrates JavaScript usage

```tsx
// ✅ Good — minimal, annotated, runnable
const monitor = createMonitor({
  slowQueryThresholdMs: 200,           // queries over 200ms emit slow_query
  exporter: (event) => console.log(event),
})

// ❌ Bad — relies on undefined variables, no comments
const monitor = createMonitor({
  slowQueryThresholdMs: myConfig.threshold,
  exporter: myExporter,
})
```

For bad/good comparisons, always show the bad pattern **first**, then the good pattern. Mark them with `// BAD` and `// GOOD` comments.

### Using components

The following components are available on every doc page. Import from the paths shown.

#### `<CodeBlock />`

```tsx
import { CodeBlock } from '@/components/CodeBlock'

// Basic
<CodeBlock language="typescript" code={`const x = 1`} />

// With filename tab
<CodeBlock language="typescript" filename="monitor.ts" code={`...`} />

// With line numbers
<CodeBlock language="typescript" showLineNumbers code={`...`} />
```

Supported languages: `typescript`, `javascript`, `json`, `bash`, `css`. For other languages, use `language="bash"` as a fallback (no highlighting, but correct font and copy button).

#### `<Callout />`

```tsx
import { Callout } from '@/components/Callout'

<Callout type="tip" title="Optional title">Content</Callout>
<Callout type="info" title="Optional title">Content</Callout>
<Callout type="warning" title="Optional title">Content</Callout>
<Callout type="danger" title="Optional title">Content</Callout>
```

#### `<SignalCard />`

Only used on signal pages and the signals index. Do not add `SignalCard` to adapter or framework pages.

---

## Adding and Editing Pages

### Editing an existing doc page

Every doc page is a plain `.tsx` file under `app/docs/`. Find the page you want to edit, make your changes, and verify the result locally.

The only rule: **don't change the `metadata.title`** without updating `lib/search-index.ts` to match — the search result titles are pulled from there.

### Adding a new doc page

1. Create the directory and file:

```bash
mkdir -p app/docs/<section>/<page-slug>
touch app/docs/<section>/<page-slug>/page.tsx
```

2. Use this template:

```tsx
import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Page Title Here' }

export default function PageNamePage() {
  return (
    <article className="prose-doc">
      <h1>Page Title Here</h1>
      <p>Lead paragraph — one or two sentences that summarise what this page covers.</p>

      <h2>First section</h2>
      {/* content */}
    </article>
  )
}
```

3. Add to the sidebar in `lib/navigation.ts` — find the right section and add your `NavItem`.

4. Add a record to `lib/search-index.ts`.

5. If the section doesn't exist yet, also add the section header to `lib/navigation.ts`.

### Adding or editing a signal page

**To edit an existing signal page:** find it under `app/docs/signals/<slug>/page.tsx` and edit directly.

**To add a new signal:**

1. Add the signal definition to the `signals` array in `generate-signals.mjs`:

```js
{
  slug: 'your-signal-slug',       // kebab-case — becomes the URL
  name: 'your_signal_name',       // snake_case — the actual signal name
  severity: 'warning',            // 'critical' | 'warning' | 'info'
  summary: 'One-line description',
  detail: 'Two or three sentence explanation of when and why this fires.',
  causes: [
    'Root cause 1',
    'Root cause 2',
  ],
  fixes: [
    'Step 1 to resolve',
    'Step 2 to resolve',
  ],
  code: `// BAD\n...\n\n// GOOD\n...`,
}
```

2. Run the generator:

```bash
node generate-signals.mjs
```

The generator creates `app/docs/signals/<slug>/page.tsx` and **skips the file if it already exists**. It is safe to re-run at any time.

3. Add to `lib/search-index.ts`.

4. Add to `signalsList` in `lib/navigation.ts` (in the correct severity group).

### Updating the search index

The search index is a static array in `lib/search-index.ts`. Any time you add a page, rename a page, or change a page's description, update the corresponding record.

Each record shape:

```ts
{
  title: string        // Exact page/signal name — used as result heading
  href: string         // Route path — must start with /
  section: string      // Section label shown in the result
  description: string  // 1–2 sentence summary
  tags?: string[]      // Extra keywords: synonyms, common misspellings, related terms
}
```

**Tips for good `tags` values:**
- Include both snake_case and human-readable forms: `['n+1', 'n plus one', 'batch']` for `n_plus_one`
- Include the severity: `['critical']`, `['warning']`, `['info']`
- Include adapter names where relevant: `['mongoose', 'prisma', 'pg', 'redis']`

---

## PR Checklist

Before marking a PR ready for review:

- [ ] `npm run build` completes with no errors
- [ ] New pages are added to `lib/navigation.ts`
- [ ] New pages are added to `lib/search-index.ts`
- [ ] Code examples are TypeScript and run as shown
- [ ] `<Callout>` is used for genuinely important notes only
- [ ] No placeholder text (`TODO`, `FIXME`, `Lorem ipsum`) left in
- [ ] Signal pages generated via `generate-signals.mjs` (not hand-scaffolded)

---

## Issue Templates

When opening an issue, choose the most appropriate template:

- **`doc_bug.md`** — incorrect information, broken code example, wrong API signature
- **`content_request.md`** — missing page, missing section, missing signal documentation
- **`site_bug.md`** — layout broken, search not working, broken link, rendering issue

If none of these fit, open a blank issue with a clear title.

---

Thank you for contributing. Every improvement — even a one-word fix — makes the docs better for every developer who uses `@periodic/arsenic`.
