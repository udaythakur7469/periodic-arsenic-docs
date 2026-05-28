import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Ecosystem — The Periodic Series' }

const packages = [
  { pkg: 'strontium',       name: 'Strontium',      desc: 'The core HTTP client. Lightweight, type-safe, built for modern Node.js. Foundation for strontium-react and strontium-next.', category: 'Core', sym: 'Sr', num: '38', features: ['Type-safe requests', 'Interceptors', 'Error handling', 'Retry logic'], accent: 'blue' },
  { pkg: 'strontium-react', name: 'Strontium React', desc: 'React hooks integration for @periodic/strontium. Data fetching, mutations, and cache invalidation.', category: 'React', sym: 'Sr', num: 'Rx', features: ['useQuery / useMutation', 'Automatic caching', 'Optimistic updates', 'React 18'], accent: 'cyan' },
  { pkg: 'strontium-next',  name: 'Strontium Next',  desc: 'Next.js integration for @periodic/strontium. SSR, SSG, and App Router support with server-side data fetching.', category: 'Next.js', sym: 'Sr', num: 'Nx', features: ['App Router', 'Server Components', 'SSR / SSG', 'Edge ready'], accent: 'slate' },
  { pkg: 'iridium',         name: 'Iridium',         desc: 'Structured logging for Node.js. Multiple transports, formatters, and log levels. Pairs perfectly with Arsenic.', category: 'Logging', sym: 'Ir', num: '77', features: ['JSON formatters', 'Multiple transports', 'Log levels', 'Contextual'], accent: 'violet' },
  { pkg: 'arsenic',         name: 'Arsenic',          desc: 'Semantic runtime monitoring for Node.js. 30+ signals, zero dependencies, request-correlated database observability.', category: 'Monitoring', sym: 'As', num: '33', features: ['30+ signals', 'Request correlation', 'Callsite attribution', '6 databases'], accent: 'blue', current: true },
  { pkg: 'zirconium',       name: 'Zirconium',       desc: 'Environment configuration management for Node.js. Type-safe env parsing, validation, and defaults.', category: 'Config', sym: 'Zr', num: '40', features: ['Type-safe env', 'Validation', 'Defaults', 'Secrets masking'], accent: 'orange' },
  { pkg: 'vanadium',        name: 'Vanadium',         desc: 'Idempotency and distributed locks for Node.js. Prevent duplicate operations and coordinate distributed systems.', category: 'Locks', sym: 'V', num: '23', features: ['Idempotency keys', 'Distributed locks', 'Redis backend', 'Retry safe'], accent: 'rose' },
  { pkg: 'obsidian',        name: 'Obsidian',         desc: 'HTTP error handling middleware for Express and Fastify. Consistent error responses and client-friendly messages.', category: 'Errors', sym: 'Ob', num: '—', features: ['Consistent errors', 'Error classification', 'Stack masking', 'Express + Fastify'], accent: 'zinc' },
  { pkg: 'titanium',        name: 'Titanium',         desc: 'Rate limiting middleware for Express and Fastify. Token bucket, sliding window, and fixed window algorithms.', category: 'Security', sym: 'Ti', num: '22', features: ['Token bucket', 'Sliding window', 'Redis backend', 'Per-user limits'], accent: 'amber' },
  { pkg: 'osmium',          name: 'Osmium',           desc: 'Redis caching utilities for Node.js. Simple, type-safe cache operations with serialization and TTL management.', category: 'Cache', sym: 'Os', num: '76', features: ['Cache-aside', 'TTL management', 'Type-safe', 'Serialization'], accent: 'red' },
]

// Tailwind-safe accent classes (must be in source for Tailwind to detect)
const accentMap: Record<string, { border: string; bg: string; text: string }> = {
  blue:   { border: 'border-blue-200/60 dark:border-blue-900/50',   bg: 'bg-blue-50 dark:bg-blue-950/30',   text: 'text-blue-700 dark:text-blue-400' },
  cyan:   { border: 'border-cyan-200/60 dark:border-cyan-900/50',   bg: 'bg-cyan-50 dark:bg-cyan-950/30',   text: 'text-cyan-700 dark:text-cyan-400' },
  slate:  { border: 'border-slate-200/60 dark:border-slate-700/50', bg: 'bg-slate-50 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-300' },
  violet: { border: 'border-violet-200/60 dark:border-violet-900/50',bg: 'bg-violet-50 dark:bg-violet-950/30',text: 'text-violet-700 dark:text-violet-400' },
  orange: { border: 'border-orange-200/60 dark:border-orange-900/50',bg: 'bg-orange-50 dark:bg-orange-950/30',text: 'text-orange-700 dark:text-orange-400' },
  rose:   { border: 'border-rose-200/60 dark:border-rose-900/50',   bg: 'bg-rose-50 dark:bg-rose-950/30',   text: 'text-rose-700 dark:text-rose-400' },
  zinc:   { border: 'border-zinc-200/60 dark:border-zinc-700/50',   bg: 'bg-zinc-50 dark:bg-zinc-900/30',   text: 'text-zinc-700 dark:text-zinc-300' },
  amber:  { border: 'border-amber-200/60 dark:border-amber-900/50', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400' },
  red:    { border: 'border-red-200/60 dark:border-red-900/50',     bg: 'bg-red-50 dark:bg-red-950/30',     text: 'text-red-700 dark:text-red-400' },
}

export default function EcosystemPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24">

        {/* Header */}
        <div className="mb-14">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70" style={{ color: 'var(--muted-foreground)' }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>The Periodic Series</p>
          <h1 className="font-extrabold text-5xl sm:text-6xl tracking-tight mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            10 packages.<br />One production stack.
          </h1>
          <p className="text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            The <strong>Periodic series</strong> by Uday Thakur is a cohesive collection of Node.js packages — each named after a chemical element — designed to work together as a complete production-grade backend infrastructure.
          </p>
          <div className="flex gap-2.5 mt-6">
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full border" style={{ background: 'oklch(0.488 0.243 264.376 / 0.08)', borderColor: 'oklch(0.488 0.243 264.376 / 0.3)', color: 'var(--primary)' }}>10 packages live on npm</span>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>MIT License</span>
          </div>
        </div>

        {/* Package grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {packages.map(pkg => {
            const ac = accentMap[pkg.accent] || accentMap.blue
            return (
              <a
                key={pkg.pkg}
                href={`https://www.npmjs.com/package/@periodic/${pkg.pkg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden relative"
                style={{
                  background: pkg.current ? 'oklch(0.488 0.243 264.376 / 0.04)' : 'var(--card)',
                  borderColor: pkg.current ? 'oklch(0.488 0.243 264.376 / 0.4)' : 'var(--border)',
                }}
              >
                {pkg.current && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary)' }} />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${ac.bg} ${ac.border} ${ac.text}`}>
                          {pkg.category}
                        </span>
                        {pkg.current && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.488 0.243 264.376 / 0.12)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                            you are here
                          </span>
                        )}
                      </div>
                      <code className={`font-bold text-sm ${ac.text}`} style={{ fontFamily: 'var(--font-mono)' }}>@periodic/{pkg.pkg}</code>
                    </div>

                    {/* Element tile */}
                    <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 ${ac.bg} ${ac.border}`}>
                      <span className={`font-black text-base leading-none ${ac.text}`} style={{ fontFamily: 'var(--font-mono)' }}>{pkg.sym}</span>
                      <span className={`text-[8px] leading-none opacity-60 ${ac.text}`} style={{ fontFamily: 'var(--font-mono)' }}>{pkg.num}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>{pkg.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {pkg.features.map(f => (
                      <span key={f} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', borderColor: 'var(--border)' }}>
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mt-4 text-xs opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                    <ExternalLink className="h-3 w-3" />
                    <span>npmjs.com/package/@periodic/{pkg.pkg}</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <h2 className="font-extrabold text-3xl mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>Start with @periodic/arsenic</h2>
          <p className="mb-7 text-lg" style={{ color: 'var(--muted-foreground)' }}>Add semantic observability to your Node.js backend in minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/docs/quickstart" className="h-11 px-6 rounded-xl text-base font-semibold flex items-center transition-all hover:opacity-90" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Get Started
            </Link>
            <Link href="/docs" className="h-11 px-6 rounded-xl text-base font-semibold flex items-center border transition-all hover:bg-accent" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              Read the docs
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
