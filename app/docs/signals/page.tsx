import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Signals Reference' }

const criticalSignals = [
  { name: 'hot_path',                   href: '/docs/signals/hot-path',                   summary: 'Slow query on a frequently hit execution path' },
  { name: 'n_plus_one',                 href: '/docs/signals/n-plus-one',                 summary: 'Multiple queries where a single query should suffice' },
  { name: 'unbounded_query',            href: '/docs/signals/unbounded-query',            summary: 'Missing LIMIT clause — potential unbounded data fetch' },
  { name: 'blocking_io',                href: '/docs/signals/blocking-io',                summary: 'Blocking operations detected on event loop' },
  { name: 'retry_loop',                 href: '/docs/signals/retry-loop',                 summary: 'Excessive retries detected on query execution' },
  { name: 'write_contention',           href: '/docs/signals/write-contention',           summary: 'High-frequency writes to the same record' },
  { name: 'connection_pool_exhaustion', href: '/docs/signals/connection-pool-exhaustion', summary: 'Database connection pool nearing or at capacity' },
]

const warningSignals = [
  { name: 'slow_query',           href: '/docs/signals/slow-query',           summary: 'Query exceeded configured threshold' },
  { name: 'fan_out',              href: '/docs/signals/fan-out',              summary: 'Single request triggered multiple database queries' },
  { name: 'high_variance_latency',href: '/docs/signals/high-variance-latency',summary: 'Query latency is inconsistent across executions' },
  { name: 'high_cpu',             href: '/docs/signals/high-cpu',             summary: 'Query or request caused high CPU consumption' },
  { name: 'high_memory',          href: '/docs/signals/high-memory',          summary: 'Query or request caused high memory usage' },
  { name: 'large_payload',        href: '/docs/signals/large-payload',        summary: 'Query returned an excessively large dataset' },
  { name: 'deprecated_api',       href: '/docs/signals/deprecated-api',       summary: 'Query used deprecated database methods' },
  { name: 'overfetching',         href: '/docs/signals/overfetching',         summary: 'Query selects more fields than necessary' },
  { name: 'read_heavy_hotspot',   href: '/docs/signals/read-heavy-hotspot',   summary: 'Concentrated read activity on specific records' },
]

const infoSignals = [
  { name: 'fast_query',         href: '/docs/signals/fast-query',          summary: 'Query executed well under threshold' },
  { name: 'bounded_query',      href: '/docs/signals/bounded-query',       summary: 'Proper LIMIT usage detected' },
  { name: 'indexed_lookup',     href: '/docs/signals/indexed-lookup',      summary: 'Efficient index usage confirmed' },
  { name: 'stable_latency',     href: '/docs/signals/stable-latency',      summary: 'Consistent performance across requests' },
  { name: 'cached_query',       href: '/docs/signals/cached-query',        summary: 'Cache hit detected' },
  { name: 'index_hit',          href: '/docs/signals/index-hit',           summary: 'Confirmed index usage' },
  { name: 'single_query',       href: '/docs/signals/single-query',        summary: 'No N+1 patterns detected' },
  { name: 'optimized_join',     href: '/docs/signals/optimized-join',      summary: 'Efficient joins in use' },
  { name: 'connection_reused',  href: '/docs/signals/connection-reused',   summary: 'Connection pool working effectively' },
  { name: 'low_memory',         href: '/docs/signals/low-memory',          summary: 'Memory-efficient query execution' },
  { name: 'low_cpu',            href: '/docs/signals/low-cpu',             summary: 'CPU-efficient operation' },
  { name: 'stable_response',    href: '/docs/signals/stable-response',     summary: 'Matches performance baselines' },
  { name: 'cache_candidate',    href: '/docs/signals/cache-candidate',     summary: 'Query would benefit from caching' },
  { name: 'healthy_hot_path',   href: '/docs/signals/healthy-hot-path',    summary: 'High-frequency query is fast and stable' },
]

function SignalRow({ name, href, summary, sev }: { name: string; href: string; summary: string; sev: 'critical'|'warning'|'info' }) {
  const dot = { critical: 'bg-red-500', warning: 'bg-amber-400', info: 'bg-blue-400' }[sev]
  const left = { critical: 'border-l-red-500', warning: 'border-l-amber-400', info: 'border-l-blue-400' }[sev]
  return (
    <Link
      href={href}
      className={`flex items-center gap-3.5 p-3.5 rounded-r-xl border border-border border-l-4 ${left} hover:translate-x-1 transition-all hover:shadow-sm group`}
      style={{ background: 'var(--card)' }}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      <code className="text-sm font-semibold group-hover:text-primary transition-colors flex-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>{name}</code>
      <span className="text-sm hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>{summary}</span>
    </Link>
  )
}

export default function SignalsPage() {
  return (
    <article className="prose-doc">
      <h1>Signals Reference</h1>
      <p>
        Arsenic detects <strong>30 semantic signals</strong> across three severity levels. Every signal includes a human-readable explanation — not just a metric. Click any signal to view its full documentation page.
      </p>

      <div className="not-prose grid grid-cols-3 gap-3 my-8">
        {[
          { label: '16 Critical', count: 16, bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200/50 dark:border-red-900/50' },
          { label: '9 Warning',   count: 9,  bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200/50 dark:border-amber-900/50' },
          { label: '14 Info',     count: 14, bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200/50 dark:border-blue-900/50' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-xl border text-center ${s.bg} ${s.border}`}>
            <div className={`text-3xl font-extrabold ${s.text}`} style={{ fontFamily: 'var(--font-display)' }}>{s.count}</div>
            <div className={`text-sm font-semibold mt-1 ${s.text}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 id="critical">🔴 Critical Signals (16)</h2>
      <p>High-impact issues requiring immediate attention. Route these to PagerDuty or on-call systems.</p>
      <div className="not-prose space-y-1.5 my-4">
        {criticalSignals.map(s => <SignalRow key={s.name} {...s} sev="critical" />)}
        <p className="text-sm pl-5 pt-1" style={{ color: 'var(--muted-foreground)' }}>+ 9 more critical signals including <code style={{ fontFamily: 'var(--font-mono)' }}>deadlock_detected</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>index_missing</code>, and others.</p>
      </div>

      <h2 id="warning">⚠️ Warning Signals (9)</h2>
      <p>Issues worth tracking before they escalate. Route these to Slack or dashboards.</p>
      <div className="not-prose space-y-1.5 my-4">
        {warningSignals.map(s => <SignalRow key={s.name} {...s} sev="warning" />)}
      </div>

      <h2 id="info">ℹ️ Info Signals (14 — opt-in)</h2>
      <p>Positive signals confirming healthy patterns. Disabled by default to reduce noise. Enable with <code>emitPositiveSignals: true</code>.</p>
      <Callout type="warning" title="Info signals are disabled by default">
        They emit on every healthy query and can be very noisy in production. Enable selectively — in development, or routed to a dedicated low-priority log.
      </Callout>
      <CodeBlock language="typescript" code={`const monitor = createMonitor({
  emitPositiveSignals: true, // opt-in
  exporter: (event) => {
    if (event.signals.includes('cache_candidate')) {
      console.log('Consider caching:', event.model, event.operation);
    }
  },
});`} />
      <div className="not-prose space-y-1.5 my-4">
        {infoSignals.map(s => <SignalRow key={s.name} {...s} sev="info" />)}
      </div>

      <h2>Signal routing patterns</h2>
      <CodeBlock language="typescript" code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

const monitor = createMonitor({
  exporter: (event) => {
    switch (event.severity) {
      case SignalSeverity.CRITICAL:
        sendToPagerDuty(event);
        break;
      case SignalSeverity.WARNING:
        sendToSlack(event);
        break;
      case SignalSeverity.INFO:
        logger.info('db.event', event);
        break;
    }
  },
});`} />

      <h2>Signal-based filtering</h2>
      <CodeBlock language="typescript" code={`const monitor = createMonitor({
  exporter: (event) => {
    const criticalSignals = ['hot_path', 'n_plus_one', 'unbounded_query'];
    if (event.signals.some(s => criticalSignals.includes(s))) {
      triggerPagerDuty(event);
    }
  },
});`} />
    </article>
  )
}
