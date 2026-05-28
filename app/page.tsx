import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ArrowRight, Github, Zap, Link2, MapPin, Radio, Database, UploadCloud, ChevronRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: '@periodic/arsenic — Semantic Runtime Monitoring' }

const features = [
  { Icon: Zap,         title: 'Zero Dependencies',    desc: 'Pure TypeScript core. No runtime bloat, no side effects on import. Small, fast, and safe.' },
  { Icon: Link2,       title: 'Request Correlation',  desc: 'Every query linked to its HTTP request via AsyncLocalStorage. Fully automatic, zero boilerplate.' },
  { Icon: MapPin,      title: 'Callsite Attribution', desc: 'Exact file and line number for every slow query. Know immediately which code to fix.' },
  { Icon: Radio,       title: '30+ Semantic Signals', desc: 'Critical, warning, and info. Hot path, N+1, unbounded, fan-out — explained, not just detected.' },
  { Icon: Database,    title: 'Multi-Database',       desc: 'Mongoose, Prisma, pg, Redis. Drop in an adapter for your stack and get instant observability.' },
  { Icon: UploadCloud, title: 'Exporter-First',       desc: 'Send events anywhere. PagerDuty, Slack, Datadog, OpenTelemetry. You own the destination.' },
]

const signals = [
  { name: 'hot_path',        sev: 'critical', desc: 'Slow query on a frequently hit path — highest priority target.' },
  { name: 'n_plus_one',      sev: 'critical', desc: 'Multiple queries where a single batch should suffice.' },
  { name: 'unbounded_query', sev: 'critical', desc: 'Missing LIMIT — may return entire collections.' },
  { name: 'slow_query',      sev: 'warning',  desc: 'Exceeded configured latency threshold.' },
  { name: 'fan_out',         sev: 'warning',  desc: 'Too many queries per single request.' },
  { name: 'cache_candidate', sev: 'info',     desc: 'Query pattern would benefit from caching.' },
]

const periodicPackages = [
  { pkg: 'strontium',       desc: 'Core HTTP client',               category: 'Core' },
  { pkg: 'strontium-react', desc: 'React hooks integration',        category: 'React' },
  { pkg: 'strontium-next',  desc: 'Next.js integration',            category: 'Next.js' },
  { pkg: 'iridium',         desc: 'Structured logging',             category: 'Logging' },
  { pkg: 'arsenic',         desc: 'Semantic runtime monitoring',    category: 'Monitoring', current: true },
  { pkg: 'zirconium',       desc: 'Environment configuration',      category: 'Config' },
  { pkg: 'vanadium',        desc: 'Idempotency & distributed locks',category: 'Locks' },
  { pkg: 'obsidian',        desc: 'HTTP error handling',            category: 'Errors' },
  { pkg: 'titanium',        desc: 'Rate limiting',                  category: 'Security' },
  { pkg: 'osmium',          desc: 'Redis caching',                  category: 'Cache' },
]

const sevDot: Record<string, string> = {
  critical: 'bg-red-500',
  warning:  'bg-amber-400',
  info:     'bg-blue-400',
}
const sevBadge: Record<string, string> = {
  critical: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50',
  warning:  'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50',
  info:     'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50',
}
const leftBorder: Record<string, string> = {
  critical: 'border-l-red-500',
  warning:  'border-l-amber-400',
  info:     'border-l-blue-400',
}

const quickCode = `import { createMonitor, expressContext, mongooseAdapter } from '@periodic/arsenic';

const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
    else if (event.severity === 'warning') sendToSlack(event);
    else logger.info(event);
  },
});

app.use(expressContext(monitor));
mongooseAdapter(monitor, mongoose);`

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Dot grid bg */}
          <div className="absolute inset-0 dot-bg opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />

          {/* Blue glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-10 dark:opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, oklch(0.488 0.243 264.376) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-slide-up stagger-1"
                style={{ borderColor: 'oklch(0.488 0.243 264.376 / 0.35)', background: 'oklch(0.488 0.243 264.376 / 0.08)', color: 'var(--primary)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--primary)' }} />
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)' }}>npm install @periodic/arsenic</span>
              </div>

              {/* Headline */}
              <h1
                className="font-extrabold tracking-tight leading-[1.08] mb-7 animate-slide-up stagger-2"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--foreground)' }}
              >
                Reveal what&apos;s{' '}
                <span className="text-blue-gradient">breaking</span>
                <br />your system.
              </h1>

              {/* Sub */}
              <p className="text-xl mb-10 max-w-2xl leading-relaxed animate-slide-up stagger-3" style={{ color: 'var(--muted-foreground)' }}>
                <code className="font-mono text-[0.95em] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', background: 'oklch(0.488 0.243 264.376 / 0.1)', color: 'var(--primary)', border: '1px solid oklch(0.488 0.243 264.376 / 0.2)' }}>
                  @periodic/
                </code>{' '}
                is production-grade semantic runtime monitoring for Node.js. It doesn&apos;t just tell you something is slow — it tells you <em>exactly why</em>, with callsite attribution, request correlation, and 30+ classified signals.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-12 animate-slide-up stagger-4">
                <Link
                  href="/docs/quickstart"
                  className="flex items-center gap-2 h-11 px-6 rounded-xl text-base font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', boxShadow: '0 4px 24px oklch(0.488 0.243 264.376 / 0.4)' }}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/udaythakur7469/periodic-arsenic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 h-11 px-6 rounded-xl text-base font-semibold border transition-all hover:bg-accent"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 animate-slide-up stagger-5">
                {[
                  { v: '30+', l: 'Signals' },
                  { v: '0',   l: 'Dependencies' },
                  { v: '6',   l: 'Databases' },
                  { v: '10',  l: 'Periodic packages' },
                ].map(({ v, l }) => (
                  <div
                    key={l}
                    className="px-4 py-2.5 rounded-xl border flex items-center gap-2.5"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
                  >
                    <span className="font-extrabold text-2xl leading-none text-blue-gradient" style={{ fontFamily: 'var(--font-display)' }}>{v}</span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CODE + OUTPUT ═══════════════════════════════════════════ */}
        <section className="py-20 border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>Drop in. Observe immediately.</p>
              <h2 className="font-extrabold text-4xl tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                Three lines of setup.
              </h2>
              <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>No agents. No YAML. No proprietary SDKs.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {/* Setup */}
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d1117] shadow-2xl">
                <div className="flex items-center gap-3 px-4 py-3 bg-[#161b22] border-b border-zinc-800">
                  <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f57]"/><span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><span className="w-3 h-3 rounded-full bg-[#28ca41]"/></div>
                  <span className="text-xs text-zinc-500" style={{ fontFamily: 'var(--font-mono)' }}>app.ts</span>
                </div>
                <pre className="p-5 text-[0.8125rem] leading-[1.85] overflow-x-auto text-zinc-200" style={{ fontFamily: 'var(--font-mono)' }}>
                  <code>{quickCode}</code>
                </pre>
              </div>

              {/* Event output */}
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d1117] shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f57]"/><span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><span className="w-3 h-3 rounded-full bg-[#28ca41]"/></div>
                    <span className="text-xs text-zinc-500" style={{ fontFamily: 'var(--font-mono)' }}>Event output</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-red-950/50 text-red-400 border-red-900/50">🔴 critical</span>
                </div>
                <pre className="p-5 text-[0.8125rem] leading-[1.85] overflow-x-auto text-zinc-200" style={{ fontFamily: 'var(--font-mono)' }}>
{`{
  "type": "db.query",
  "model": "User",
  "operation": "findOne",
  "durationMs": 312,
  "slow": true,
  "signals": ["hot_path", "unbounded_query"],
  "severity": "critical",
  "request": {
    "method": "GET",
    "route": "/users/:id"
  },
  "callsite": {
    "file": "src/routes/users.ts",
    "line": 14
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ════════════════════════════════════════════════ */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>Why Arsenic</p>
              <h2 className="font-extrabold text-4xl tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                Everything your backend is already emitting
              </h2>
              <p className="text-lg max-w-lg mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                Built through real-world production experience to surface the hidden signals before they become incidents.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="group p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:shadow-lg"
                    style={{ background: 'oklch(0.488 0.243 264.376 / 0.1)', border: '1px solid oklch(0.488 0.243 264.376 / 0.2)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>{title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SIGNALS ═════════════════════════════════════════════════ */}
        <section className="py-24 border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>Signal Intelligence</p>
                <h2 className="font-extrabold text-4xl tracking-tight mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                  30+ signals.<br />Three severity levels.
                </h2>
                <p className="text-[1.0625rem] mb-7 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  Every event is automatically classified and explained. Critical signals go to PagerDuty.
                  Warnings go to Slack. Info signals go to your structured logs.
                </p>
                <div className="flex gap-2 mb-8">
                  {[
                    { label: '16 Critical', cls: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50' },
                    { label: '9 Warning',   cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50' },
                    { label: '14 Info',     cls: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50' },
                  ].map(({ label, cls }) => (
                    <span key={label} className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${cls}`}>{label}</span>
                  ))}
                </div>
                <Link
                  href="/docs/signals"
                  className="inline-flex items-center gap-2 text-base font-semibold px-5 py-2.5 rounded-xl border transition-all hover:bg-accent"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  View all 30+ signals <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {signals.map(s => (
                  <div key={s.name} className={`flex items-start gap-3.5 p-4 rounded-xl border border-border border-l-4 ${leftBorder[s.sev]} transition-all hover:translate-x-1`}
                    style={{ background: 'var(--card)' }}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${sevDot[s.sev]}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <code className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>{s.name}</code>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevBadge[s.sev]}`}>{s.sev}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="pl-5 pt-1">
                  <Link href="/docs/signals" className="text-sm font-medium flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: 'var(--primary)' }}>
                    View 24 more signals <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ ECOSYSTEM ═══════════════════════════════════════════════ */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>The Periodic Series</p>
              <h2 className="font-extrabold text-4xl tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                10 packages. One production stack.
              </h2>
              <p className="text-lg max-w-lg mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                Build complete production-grade Node.js APIs with the full Periodic suite by Uday Thakur.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {periodicPackages.map(pkg => (
                <a
                  key={pkg.pkg}
                  href={`https://www.npmjs.com/package/@periodic/${pkg.pkg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                  style={{
                    background: pkg.current ? 'oklch(0.488 0.243 264.376 / 0.06)' : 'var(--card)',
                    borderColor: pkg.current ? 'oklch(0.488 0.243 264.376 / 0.4)' : 'var(--border)',
                  }}
                >
                  {pkg.current && (
                    <span
                      className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'oklch(0.488 0.243 264.376 / 0.12)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}
                    >
                      you are here
                    </span>
                  )}
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                    style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                  >
                    {pkg.category}
                  </span>
                  <code className="block text-xs font-bold mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    @periodic/{pkg.pkg}
                  </code>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{pkg.desc}</p>
                  <ExternalLink className="h-3 w-3 absolute bottom-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: 'var(--muted-foreground)' }} />
                </a>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/ecosystem"
                className="inline-flex items-center gap-2 text-base font-semibold px-5 py-2.5 rounded-xl border transition-all hover:bg-accent"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                View full ecosystem <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════════════ */}
        <footer className="border-t py-14" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg border-2 flex flex-col items-center justify-center" style={{ borderColor: 'var(--primary)', background: 'oklch(0.488 0.243 264.376 / 0.1)' }}>
                  <span className="text-[9px] font-black leading-none" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>As</span>
                </div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>@periodic/arsenic</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Semantic runtime monitoring for Node.js. MIT License. Built by Uday Thakur.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>Documentation</p>
              <div className="space-y-2.5">
                {[['Introduction', '/docs'], ['Quick Start', '/docs/quickstart'], ['Signals Reference', '/docs/signals'], ['Redis Adapter', '/docs/adapters/redis'], ['API Reference', '/docs/api-reference']].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-sm transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>Links</p>
              <div className="space-y-2.5">
                {[['npm', 'https://www.npmjs.com/package/@periodic/arsenic'], ['GitHub', 'https://github.com/udaythakur7469/periodic-arsenic']].map(([l, h]) => (
                  <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="block text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>{l}</a>
                ))}
                <Link href="/ecosystem" className="block text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>Ecosystem</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
