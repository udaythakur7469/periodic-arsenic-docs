import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Database Adapters' }

const adapters = [
  { title: 'Mongoose', href: '/docs/adapters/mongoose', desc: 'MongoDB via Mongoose ODM', badge: '🍃', status: 'Full support' },
  { title: 'Prisma',   href: '/docs/adapters/prisma',   desc: 'PostgreSQL, MySQL, SQLite, CockroachDB', badge: '🔷', status: 'Full support' },
  { title: 'pg',       href: '/docs/adapters/pg',       desc: 'PostgreSQL raw driver', badge: '🐘', status: 'Full support' },
  { title: 'Redis',    href: '/docs/adapters/redis',    desc: '32 commands classified + monitoring', badge: '🔴', status: 'Full support + Command Monitoring' },
]

export default function AdaptersPage() {
  return (
    <article className="prose-doc">
      <h1>Database Adapters</h1>
      <p>Arsenic supports six databases through four adapters. Each adapter hooks into the database driver cleanly — no monkey-patching, no prototype mutation. Drop in the adapter for your stack and get immediate semantic observability.</p>

      <h2>Supported databases</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {adapters.map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-start gap-4 p-5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <span className="text-3xl shrink-0 mt-0.5">{a.badge}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>{a.title}</span>
                <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: 'var(--primary)' }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{a.desc}</p>
              <span className="text-xs font-medium mt-1 block" style={{ color: 'var(--primary)' }}>✓ {a.status}</span>
            </div>
          </Link>
        ))}
      </div>

      <h2>How adapters work</h2>
      <p>Adapters instrument your database driver at the point of instantiation. All subsequent queries are automatically observed — no changes to your application code required.</p>

      <h2>Common setup pattern</h2>
      <p>All adapters follow the same pattern: <strong>create monitor → attach framework middleware → attach adapter</strong>.</p>
    </article>
  )
}
