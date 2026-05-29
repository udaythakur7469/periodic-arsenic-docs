import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Signals Reference' }

const criticalSignals = [
  {
    name: "hot_path",
    href: "/docs/signals/hot-path",
    summary: "Slow query on a frequently hit execution path",
    issue:
      "Slow query on a high-frequency execution path — both slow AND frequent.",
    fix: "Add indexes, implement caching, add pagination.",
  },
  {
    name: "n_plus_one",
    href: "/docs/signals/n-plus-one",
    summary: "Multiple queries where a single query should suffice",
    issue: "N queries fired in a loop where one batched query would do.",
    fix: "Use populate(), include, or a single IN clause.",
  },
  {
    name: "unbounded_query",
    href: "/docs/signals/unbounded-query",
    summary: "Missing LIMIT clause — potential unbounded data fetch",
    issue: "No LIMIT/take — can return entire collections on large datasets.",
    fix: "Always add pagination limits to list queries.",
  },
  {
    name: "blocking_io",
    href: "/docs/signals/blocking-io",
    summary: "Blocking operations detected on event loop",
    issue: "Synchronous operation blocking the Node.js event loop.",
    fix: "Use async alternatives; move CPU work to worker threads.",
  },
  {
    name: "retry_loop",
    href: "/docs/signals/retry-loop",
    summary: "Excessive retries detected on query execution",
    issue: "Query retrying excessively — often signals deadlock or contention.",
    fix: "Investigate root cause; add backoff and retry limits.",
  },
  {
    name: "write_contention",
    href: "/docs/signals/write-contention",
    summary: "High-frequency writes to the same record",
    issue: "Multiple concurrent writes to the same document/row.",
    fix: "Use atomic operations, queues, or optimistic locking.",
  },
  {
    name: "connection_pool_exhaustion",
    href: "/docs/signals/connection-pool-exhaustion",
    summary: "Database connection pool nearing or at capacity",
    issue: "Pool is full — new requests queue or fail.",
    fix: "Increase pool size, reduce connection hold time, fix leaks.",
  },
  // Redis — dangerous
  {
    name: "redis_keys",
    href: "/docs/signals/redis-keys",
    summary: "Full keyspace scan — blocks all Redis operations while running",
    issue:
      "KEYS performs a full keyspace scan, blocking all Redis ops while running.",
    fix: "Replace with SCAN cursor iteration.",
  },
  {
    name: "redis_flushall",
    href: "/docs/signals/redis-flushall",
    summary: "Deletes every key in every Redis database. No undo.",
    issue: "Wipes every key in every database on the instance. Irreversible.",
    fix: "Restrict via Redis ACLs. Use targeted DEL or UNLINK.",
  },
  {
    name: "redis_flushdb",
    href: "/docs/signals/redis-flushdb",
    summary: "Deletes all keys in the currently selected Redis database",
    issue: "Wipes all keys in the selected database. Equally destructive.",
    fix: "Restrict via ACLs. Use selective key deletion instead.",
  },
  // Redis — blocking
  {
    name: "redis_blpop",
    href: "/docs/signals/redis-blpop",
    summary: "Blocking left-side list pop",
    issue:
      "Blocks the client connection until data is available or timeout fires.",
    fix: "Always set a timeout. Use a dedicated connection pool.",
  },
  {
    name: "redis_brpop",
    href: "/docs/signals/redis-brpop",
    summary: "Blocking right-side list pop",
    issue:
      "Blocks the client connection until data is available or timeout fires.",
    fix: "Always set a timeout. Use a dedicated connection pool.",
  },
  {
    name: "redis_brpoplpush",
    href: "/docs/signals/redis-brpoplpush",
    summary: "Blocking pop-and-push between lists. Deprecated in Redis 6.2.",
    issue: "Blocks until source list has data. Deprecated since Redis 6.2.",
    fix: "Replace with BLMOVE.",
  },
  {
    name: "redis_blmove",
    href: "/docs/signals/redis-blmove",
    summary: "Blocking atomic list move",
    issue: "Blocks client until source list has data or timeout fires.",
    fix: "Always specify a timeout to prevent indefinite blocking.",
  },
];

const warningSignals = [
  {
    name: "slow_query",
    href: "/docs/signals/slow-query",
    summary: "Query exceeded configured threshold",
    issue: "Query duration exceeded slowQueryThresholdMs.",
    fix: "Add indexes, optimise query shape, or increase threshold.",
  },
  {
    name: "fan_out",
    href: "/docs/signals/fan-out",
    summary: "Single request triggered multiple database queries",
    issue:
      "One HTTP request fired many DB queries — aggregated latency adds up.",
    fix: "Batch queries, use DataLoader, or denormalise.",
  },
  {
    name: "high_variance_latency",
    href: "/docs/signals/high-variance-latency",
    summary: "Query latency is inconsistent across executions",
    issue:
      "Same query runs fast sometimes, slow others — suggests lock contention.",
    fix: "Investigate locks, index fragmentation, or cold cache.",
  },
  {
    name: "high_cpu",
    href: "/docs/signals/high-cpu",
    summary: "Query or request caused high CPU consumption",
    issue: "Excessive CPU used during query execution.",
    fix: "Profile the query; check for full scans or regex filters.",
  },
  {
    name: "high_memory",
    href: "/docs/signals/high-memory",
    summary: "Query or request caused high memory usage",
    issue: "Large heap allocation during query — often from unbounded results.",
    fix: "Add LIMIT, use streaming, or paginate results.",
  },
  {
    name: "large_payload",
    href: "/docs/signals/large-payload",
    summary: "Query returned an excessively large dataset",
    issue: "Response payload is very large — high serialisation cost.",
    fix: "Add projection, pagination, or field exclusion.",
  },
  {
    name: "deprecated_api",
    href: "/docs/signals/deprecated-api",
    summary: "Query used deprecated database methods",
    issue: "Calling a deprecated driver or ORM API.",
    fix: "Migrate to the recommended replacement.",
  },
  {
    name: "overfetching",
    href: "/docs/signals/overfetching",
    summary: "Query selects more fields than necessary",
    issue: "Selecting all fields when only a subset is used.",
    fix: "Add field projection / select() to limit returned fields.",
  },
  {
    name: "read_heavy_hotspot",
    href: "/docs/signals/read-heavy-hotspot",
    summary: "Concentrated read activity on specific records",
    issue: "Same records read at very high frequency — cache pressure.",
    fix: "Cache hot records; add read replicas for scaling.",
  },
  // Redis — slow
  {
    name: "redis_hgetall",
    href: "/docs/signals/redis-hgetall",
    summary: "Returns every field in a hash — O(N) with hash size",
    issue: "Fetches all hash fields even when only a few are needed.",
    fix: "Use HMGET with explicit field names, or HSCAN.",
  },
  {
    name: "redis_smembers",
    href: "/docs/signals/redis-smembers",
    summary: "Returns all set members — unbounded on large sets",
    issue: "Returns the full set — no pagination, no limit.",
    fix: "Use SSCAN to iterate, or SRANDMEMBER for sampling.",
  },
  {
    name: "redis_lrange",
    href: "/docs/signals/redis-lrange",
    summary: "Scans a range of list elements",
    issue: "Wide ranges on large lists are O(N) in the range size.",
    fix: "Use narrow ranges or cursor-based pagination.",
  },
  {
    name: "redis_sort",
    href: "/docs/signals/redis-sort",
    summary: "Sorts list/set/sorted set — memory and CPU intensive",
    issue: "SORT is O(N+M*log(M)) — expensive on large collections.",
    fix: "Pre-sort at write time using sorted sets.",
  },
  {
    name: "redis_scan",
    href: "/docs/signals/redis-scan",
    summary: "Full dataset scan when iterated to completion",
    issue: "SCAN/SSCAN/HSCAN/ZSCAN are O(N) when fully iterated.",
    fix: "Use count hints; move full scans to background jobs.",
  },
  {
    name: "redis_sunion",
    href: "/docs/signals/redis-sunion",
    summary: "Set union — O(N) across all input sets",
    issue: "SUNION iterates all members of all input sets.",
    fix: "Cache results for stable inputs.",
  },
  {
    name: "redis_sinter",
    href: "/docs/signals/redis-sinter",
    summary: "Set intersection — O(N) across all input sets",
    issue: "SINTER iterates all members to compute intersection.",
    fix: "Cache results for stable inputs.",
  },
  {
    name: "redis_sdiff",
    href: "/docs/signals/redis-sdiff",
    summary: "Set difference — O(N) across all input sets",
    issue: "SDIFF iterates all input sets to compute difference.",
    fix: "Cache results for stable inputs.",
  },
  {
    name: "redis_sunionstore",
    href: "/docs/signals/redis-sunionstore",
    summary: "Set union and store result",
    issue: "Same O(N) cost as SUNION plus a write.",
    fix: "Run as background job, cache with TTL.",
  },
  {
    name: "redis_sinterstore",
    href: "/docs/signals/redis-sinterstore",
    summary: "Set intersection and store result",
    issue: "Same O(N) cost as SINTER plus a write.",
    fix: "Run as background job, cache with TTL.",
  },
  {
    name: "redis_sdiffstore",
    href: "/docs/signals/redis-sdiffstore",
    summary: "Set difference and store result",
    issue: "Same O(N) cost as SDIFF plus a write.",
    fix: "Run as background job, cache with TTL.",
  },
  {
    name: "redis_zrange",
    href: "/docs/signals/redis-zrange",
    summary: "Sorted set range query — linear in elements returned",
    issue: "O(log(N)+M) — linear in the number of elements returned.",
    fix: "Paginate with LIMIT offset count.",
  },
  {
    name: "redis_zrangebyscore",
    href: "/docs/signals/redis-zrangebyscore",
    summary: "Sorted set score-based range query",
    issue: "Linear in the number of elements in the score range.",
    fix: "Paginate with LIMIT offset count.",
  },
  {
    name: "redis_zrangebylex",
    href: "/docs/signals/redis-zrangebylex",
    summary: "Sorted set lexicographic range query",
    issue: "Linear in the number of elements in the lex range.",
    fix: "Paginate with LIMIT offset count.",
  },
  {
    name: "redis_zrevrange",
    href: "/docs/signals/redis-zrevrange",
    summary: "Reverse sorted set range query",
    issue: "Same cost as ZRANGE in reverse — linear in returned elements.",
    fix: "Paginate with LIMIT.",
  },
  {
    name: "redis_zrevrangebyscore",
    href: "/docs/signals/redis-zrevrangebyscore",
    summary: "Reverse sorted set score-based range query",
    issue: "Same cost as ZRANGEBYSCORE in reverse.",
    fix: "Paginate with LIMIT.",
  },
  {
    name: "redis_zinterstore",
    href: "/docs/signals/redis-zinterstore",
    summary: "Sorted set intersection — expensive with large inputs",
    issue: "O(N*K)+O(M*log(M)) — scales with number of sets and their sizes.",
    fix: "Cache results, run in background workers.",
  },
  {
    name: "redis_zunionstore",
    href: "/docs/signals/redis-zunionstore",
    summary: "Sorted set union — expensive with large inputs",
    issue: "O(N)+O(M*log(M)) — linear in total members across all input sets.",
    fix: "Cache results, run in background workers.",
  },
  {
    name: "redis_object",
    href: "/docs/signals/redis-object",
    summary: "Inspects Redis internal metadata — overhead in tight loops",
    issue: "OBJECT ENCODING/REFCOUNT/IDLETIME adds overhead in hot paths.",
    fix: "Use only for diagnostics, never in application hot paths.",
  },
  {
    name: "redis_wait",
    href: "/docs/signals/redis-wait",
    summary: "Blocks until replicas acknowledge writes — replication lag",
    issue:
      "Blocks the client until N replicas confirm the write or timeout fires.",
    fix: "Set a reasonable timeout; use only where strong consistency is required.",
  },
];

const infoSignals = [
  {
    name: "fast_query",
    href: "/docs/signals/fast-query",
    summary: "Query executed well under threshold",
    issue: "Query completed significantly under slowQueryThresholdMs.",
    fix: undefined,
  },
  {
    name: "bounded_query",
    href: "/docs/signals/bounded-query",
    summary: "Proper LIMIT usage detected",
    issue: "Query includes a LIMIT/take clause — result size is bounded.",
    fix: undefined,
  },
  {
    name: "indexed_lookup",
    href: "/docs/signals/indexed-lookup",
    summary: "Efficient index usage confirmed",
    issue: "Query is hitting an index — not a full collection scan.",
    fix: undefined,
  },
  {
    name: "stable_latency",
    href: "/docs/signals/stable-latency",
    summary: "Consistent performance across requests",
    issue: "Low variance in query duration — predictable performance.",
    fix: undefined,
  },
  {
    name: "cached_query",
    href: "/docs/signals/cached-query",
    summary: "Cache hit detected",
    issue: "Result served from cache — no database round trip needed.",
    fix: undefined,
  },
  {
    name: "index_hit",
    href: "/docs/signals/index-hit",
    summary: "Confirmed index usage",
    issue: "Query plan confirms index usage.",
    fix: undefined,
  },
  {
    name: "single_query",
    href: "/docs/signals/single-query",
    summary: "No N+1 patterns detected",
    issue: "Only one query fired for this request — no N+1 detected.",
    fix: undefined,
  },
  {
    name: "optimized_join",
    href: "/docs/signals/optimized-join",
    summary: "Efficient joins in use",
    issue: "Join is using indexes — not a nested loop full scan.",
    fix: undefined,
  },
  {
    name: "connection_reused",
    href: "/docs/signals/connection-reused",
    summary: "Connection pool working effectively",
    issue: "Reusing an existing pooled connection — no handshake overhead.",
    fix: undefined,
  },
  {
    name: "low_memory",
    href: "/docs/signals/low-memory",
    summary: "Memory-efficient query execution",
    issue: "Query allocated minimal heap memory.",
    fix: undefined,
  },
  {
    name: "low_cpu",
    href: "/docs/signals/low-cpu",
    summary: "CPU-efficient operation",
    issue: "Low CPU usage during query execution.",
    fix: undefined,
  },
  {
    name: "stable_response",
    href: "/docs/signals/stable-response",
    summary: "Matches performance baselines",
    issue: "Response time matches established baseline — no regression.",
    fix: undefined,
  },
  {
    name: "cache_candidate",
    href: "/docs/signals/cache-candidate",
    summary: "Query would benefit from caching",
    issue: "Repeated identical query — a good candidate for caching.",
    fix: undefined,
  },
  {
    name: "healthy_hot_path",
    href: "/docs/signals/healthy-hot-path",
    summary: "High-frequency query is fast and stable",
    issue: "High-frequency path with consistently fast execution. Healthy.",
    fix: undefined,
  },
];

function SignalRow({
  name,
  href,
  summary,
  issue,
  fix,
  sev,
}: {
  name: string;
  href: string;
  summary: string;
  issue?: string;
  fix?: string;
  sev: "critical" | "warning" | "info";
}) {
  const left = {
    critical: "border-l-red-500",
    warning: "border-l-amber-400",
    info: "border-l-blue-400",
  }[sev];
  const badge = {
    critical:
      "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50",
    warning:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50",
    info: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50",
  }[sev];
  return (
    <Link
      href={href}
      className={`block p-5 rounded-r-xl border border-border border-l-4 ${left} hover:translate-x-1 transition-all hover:shadow-sm group`}
      style={{ background: "var(--card)" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <code
          className="text-sm font-semibold group-hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}
        >
          {name}
        </code>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge}`}
        >
          {sev}
        </span>
      </div>
      <p
        className="text-sm leading-relaxed mb-1"
        style={{ color: "var(--muted-foreground)" }}
      >
        {issue ?? summary}
      </p>
      {fix && (
        <p className="text-sm">
          <span className="font-semibold" style={{ color: "var(--primary)" }}>
            Fix:{" "}
          </span>
          <span style={{ color: "var(--muted-foreground)" }}>{fix}</span>
        </p>
      )}
    </Link>
  );
}

export default function SignalsPage() {
  return (
    <article className="prose-doc">
      <h1>Signals Reference</h1>
      <p>
        Arsenic detects <strong>57 semantic signals</strong> across three
        severity levels — including 27 Redis-specific command signals. Every
        signal includes a human-readable explanation — not just a metric. Click
        any signal to view its full documentation page.
      </p>

      <div className="not-prose grid grid-cols-3 gap-3 my-8">
        {[
          {
            label: "14 Critical",
            count: 14,
            bg: "bg-red-50 dark:bg-red-950/30",
            text: "text-red-700 dark:text-red-400",
            border: "border-red-200/50 dark:border-red-900/50",
          },
          {
            label: "29 Warning",
            count: 29,
            bg: "bg-amber-50 dark:bg-amber-950/30",
            text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-200/50 dark:border-amber-900/50",
          },
          {
            label: "14 Info",
            count: 14,
            bg: "bg-blue-50 dark:bg-blue-950/30",
            text: "text-blue-600 dark:text-blue-400",
            border: "border-blue-200/50 dark:border-blue-900/50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`p-4 rounded-xl border text-center ${s.bg} ${s.border}`}
          >
            <div
              className={`text-3xl font-extrabold ${s.text}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.count}
            </div>
            <div className={`text-sm font-semibold mt-1 ${s.text}`}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <h2 id="critical">🔴 Critical Signals (14)</h2>
      <p>
        High-impact issues requiring immediate attention. Route these to
        PagerDuty or on-call systems.
      </p>
      <div className="not-prose space-y-1.5 my-4">
        {criticalSignals.map((s) => (
          <SignalRow key={s.name} {...s} sev="critical" />
        ))}
      </div>

      <h2 id="warning">⚠️ Warning Signals (29)</h2>
      <p>
        Issues worth tracking before they escalate. Route these to Slack or
        dashboards.
      </p>
      <div className="not-prose space-y-1.5 my-4">
        {warningSignals.map((s) => (
          <SignalRow key={s.name} {...s} sev="warning" />
        ))}
      </div>

      <h2 id="info">ℹ️ Info Signals (14 — opt-in)</h2>
      <p>
        Positive signals confirming healthy patterns. Disabled by default to
        reduce noise. Enable with <code>emitPositiveSignals: true</code>.
      </p>
      <Callout type="warning" title="Info signals are disabled by default">
        They emit on every healthy query and can be very noisy in production.
        Enable selectively — in development, or routed to a dedicated
        low-priority log.
      </Callout>
      <CodeBlock
        language="typescript"
        code={`const monitor = createMonitor({
  emitPositiveSignals: true, // opt-in
  exporter: (event) => {
    if (event.signals.includes('cache_candidate')) {
      console.log('Consider caching:', event.model, event.operation);
    }
  },
});`}
      />
      <div className="not-prose space-y-1.5 my-4">
        {infoSignals.map((s) => (
          <SignalRow key={s.name} {...s} sev="info" />
        ))}
      </div>

      <h2>Signal routing patterns</h2>
      <CodeBlock
        language="typescript"
        code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

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
});`}
      />

      <h2>Signal-based filtering</h2>
      <CodeBlock
        language="typescript"
        code={`const monitor = createMonitor({
  exporter: (event) => {
    const criticalSignals = ['hot_path', 'n_plus_one', 'unbounded_query'];
    if (event.signals.some(s => criticalSignals.includes(s))) {
      triggerPagerDuty(event);
    }
  },
});`}
      />
    </article>
  );
}
