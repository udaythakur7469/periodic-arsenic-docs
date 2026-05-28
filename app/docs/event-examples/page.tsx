import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = { title: 'Event Examples' }

const examples = [
  {
    title: 'Critical — Hot Path (MongoDB)',
    badge: 'critical',
    db: 'mongoose',
    code: `{
  "type": "db.query",
  "db": "mongodb",
  "adapter": "mongoose",
  "model": "User",
  "operation": "findOne",
  "durationMs": 342,
  "slow": true,
  "signals": ["slow_query", "hot_path", "unbounded_query"],
  "severity": "critical",
  "request": { "id": "req_8f29a3b1c", "method": "GET", "route": "/api/users/:id", "userId": "user_abc123" },
  "callsite": { "file": "/src/routes/users.ts", "line": 42 },
  "timestamp": "2025-02-11T15:30:45.123Z",
  "metadata": { "limit": null }
}`,
  },
  {
    title: 'Critical — N+1 Query (PostgreSQL)',
    badge: 'critical',
    db: 'pg',
    code: `{
  "type": "db.query",
  "db": "postgres",
  "adapter": "pg",
  "model": "posts",
  "operation": "select",
  "durationMs": 156,
  "slow": false,
  "signals": ["n_plus_one"],
  "severity": "critical",
  "request": { "id": "req_7k3m9x2p", "method": "GET", "route": "/api/posts", "userId": "user_xyz789" },
  "callsite": { "file": "/src/services/postService.ts", "line": 78 },
  "metadata": { "query": "SELECT * FROM posts WHERE user_id = $1", "rowsAffected": 1 }
}`,
  },
  {
    title: 'Critical — Redis KEYS Command',
    badge: 'critical',
    db: 'ioredis',
    code: `{
  "type": "db.query",
  "db": "redis",
  "adapter": "ioredis",
  "operation": "keys",
  "durationMs": 1250,
  "slow": true,
  "signals": ["slow_query", "deprecated_api", "blocking_io"],
  "severity": "critical",
  "request": { "id": "req_2h7k9m3n", "method": "POST", "route": "/api/cache/clear" },
  "callsite": { "file": "/src/services/cacheService.ts", "line": 56 },
  "metadata": { "command": "KEYS", "commandCategory": "dangerous", "commandDocs": "https://periodic.dev/redis/keys", "args": ["user:*"] }
}`,
  },
  {
    title: 'Info — Healthy Query (Prisma)',
    badge: 'info',
    db: 'prisma',
    code: `{
  "type": "db.query",
  "db": "postgres",
  "adapter": "prisma",
  "model": "Product",
  "operation": "findUnique",
  "durationMs": 8,
  "slow": false,
  "signals": ["fast_query", "bounded_query", "indexed_lookup", "stable_latency", "connection_reused", "low_cpu", "low_memory"],
  "severity": "info",
  "request": { "id": "req_5p8k2n9m", "method": "GET", "route": "/api/products/:id" },
  "callsite": { "file": "/src/routes/products.ts", "line": 23 },
  "metadata": { "args": { "where": { "id": "prod_12345" } }, "cpuUsage": 12.5, "memoryUsage": 8388608, "connectionReused": true, "indexUsed": true, "rowsAffected": 1 }
}`,
  },
  {
    title: 'Warning — Background Job (No request context)',
    badge: 'warning',
    db: 'prisma',
    code: `{
  "type": "db.query",
  "db": "postgres",
  "adapter": "prisma",
  "model": "Report",
  "operation": "aggregate",
  "durationMs": 2340,
  "slow": true,
  "signals": ["slow_query", "large_payload"],
  "severity": "warning",
  "callsite": { "file": "/src/jobs/reportGenerator.ts", "line": 203 },
  "timestamp": "2025-02-11T15:37:29.456Z",
  "metadata": { "payloadSize": 3145728, "rowsAffected": 50000 }
}`,
  },
]

const badgeStyle: Record<string, string> = {
  critical: 'bg-red-950/50 text-red-400 border-red-900/50',
  warning:  'bg-amber-950/50 text-amber-400 border-amber-900/50',
  info:     'bg-blue-950/50 text-blue-400 border-blue-900/50',
}
const sevIcon: Record<string, string> = { critical: '🔴', warning: '⚠️', info: 'ℹ️' }

export default function EventExamplesPage() {
  return (
    <article className="prose-doc">
      <h1>Event Examples</h1>
      <p>Complete <code>ForgeEvent</code> JSON output from all adapters. Use these to understand what your exporter receives and how to route different event types.</p>

      <div className="not-prose space-y-6 mt-8">
        {examples.map((ex, i) => (
          <div key={i} className="rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 p-4 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle[ex.badge]}`}>
                {sevIcon[ex.badge]} {ex.badge}
              </span>
              <span className="font-semibold text-sm" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{ex.title}</span>
              <span className="text-xs ml-auto font-mono" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{ex.db}</span>
            </div>
            <CodeBlock code={ex.code} language="json" />
          </div>
        ))}
      </div>

      <h2>Field reference</h2>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          {[
            ['type',         '"db.query"',          'Always "db.query"'],
            ['db',           'string',              'Database type: mongodb, postgres, redis'],
            ['adapter',      'string',              'Adapter: mongoose, prisma, pg, ioredis'],
            ['model',        'string',              'Model/table/collection name'],
            ['operation',    'string',              'Operation: find, select, update, etc.'],
            ['durationMs',   'number',              'Query duration in milliseconds'],
            ['slow',         'boolean',             'Whether query exceeded slowQueryThresholdMs'],
            ['signals',      'string[]',            'Array of detected signal names'],
            ['severity',     '"critical"|"warning"|"info"', 'Overall event severity'],
            ['explanations', 'object',              'Signal explanations keyed by signal name'],
            ['request',      'object (optional)',   'HTTP request context (absent in background jobs)'],
            ['callsite',     'object (optional)',   'Source file and line number'],
            ['metadata',     'object (optional)',   'Adapter-specific metadata'],
            ['timestamp',    'string',              'ISO 8601 timestamp'],
          ].map(([f, t, d]) => (
            <tr key={f}><td><code>{f}</code></td><td><code>{t}</code></td><td>{d}</td></tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}
