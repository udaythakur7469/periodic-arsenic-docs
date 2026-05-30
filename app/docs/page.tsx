import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Introduction' }

export default function DocsPage() {
  return (
    <article className="prose-doc">
      <h1>Introduction</h1>
      <p>
        <strong>@periodic/arsenic</strong> is a production-grade, framework-agnostic semantic runtime monitoring library for Node.js with TypeScript support. Part of the <strong>Periodic</strong> series of Node.js packages by Uday Thakur.
      </p>
      <p>
        It instruments your database layer, correlates queries to HTTP requests, and emits structured events enriched with semantic signals — so you know not just <em>that</em> something is slow, but exactly <em>why</em>.
      </p>

      <h2>The naming</h2>
      <p>
        Arsenic (As, element 33) is a metalloid known for its dual nature — both toxic and medicinal depending on concentration. Historically it was renowned for its sensitivity in trace detection, used to uncover hidden threats before they became crises. <strong>@periodic/arsenic</strong> carries the same spirit: surface the hidden signals your backend is already emitting, before they become incidents.
      </p>

      <h2>Key capabilities</h2>
      <ul>
        <li><strong>60+ production signals</strong> across Critical (14), Warning (32), and Info (16) severity levels</li>
        <li><strong>Request correlation</strong> — every query linked to its HTTP request via AsyncLocalStorage</li>
        <li><strong>Callsite attribution</strong> — exact file and line for every slow query</li>
        <li><strong>Multi-database</strong> — Prisma, Mongoose, PostgreSQL (pg), and Redis</li>
        <li><strong>Multi-framework</strong> — Express and Fastify</li>
        <li><strong>Redis command monitoring</strong> — 32 commands classified (dangerous, blocking, slow, normal)</li>
        <li><strong>OpenTelemetry exporter</strong> — built-in OTEL support</li>
        <li><strong>Zero dependencies</strong> — pure TypeScript monitoring core</li>
        <li><strong>No global state</strong> — safe for multi-tenant applications</li>
        <li><strong>Non-blocking</strong> — exporters run asynchronously, never delay responses</li>
      </ul>

      <Callout type="info" title="Explicit non-goals">
        Arsenic intentionally does not include: built-in dashboards, automatic query rewriting, vendor lock-in, blocking behavior in production, magic on import, file/database transports, metrics collection, or config files. It does one thing well: <strong>semantic runtime observability</strong>.
      </Callout>

      <h2>Quick navigation</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 mt-6">
        {[
          { title: 'Installation',    desc: 'npm install and peer deps',       href: '/docs/installation' },
          { title: 'Quick Start',     desc: 'Up and running in 5 minutes',     href: '/docs/quickstart' },
          { title: 'Core Concepts',   desc: 'Monitors, adapters, exporters',   href: '/docs/core-concepts' },
          { title: 'Signals',         desc: '60+ signals with full reference', href: '/docs/signals' },
          { title: 'Event Examples',  desc: 'Real ForgeEvent JSON output',     href: '/docs/event-examples' },
          { title: 'Ecosystem',       desc: '10 Periodic packages',            href: '/ecosystem' },
        ].map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>{card.title}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: 'var(--primary)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </article>
  )
}
