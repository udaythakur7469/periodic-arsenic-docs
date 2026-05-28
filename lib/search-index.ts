export interface SearchRecord {
  title: string;
  href: string;
  section: string;
  description: string;
  tags?: string[];
}

export const searchIndex: SearchRecord[] = [
  // ── Getting Started ─────────────────────────────────────
  {
    title: "Introduction",
    href: "/docs",
    section: "Getting Started",
    description:
      "Overview of @periodic/arsenic — semantic runtime monitoring for Node.js.",
    tags: ["overview", "about", "what is"],
  },
  {
    title: "Installation",
    href: "/docs/installation",
    section: "Getting Started",
    description:
      "npm install @periodic/arsenic and optional peer dependencies.",
    tags: ["install", "npm", "setup", "peer deps"],
  },
  {
    title: "Quick Start",
    href: "/docs/quickstart",
    section: "Getting Started",
    description: "Up and running in 5 minutes with Express and Mongoose.",
    tags: ["quickstart", "express", "mongoose", "setup"],
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    section: "Getting Started",
    description:
      "createMonitor options: slowQueryThresholdMs, emitPositiveSignals, includeDocs, exporter.",
    tags: ["config", "options", "createMonitor"],
  },

  // ── Core Concepts ────────────────────────────────────────
  {
    title: "Core Concepts",
    href: "/docs/core-concepts",
    section: "Core Concepts",
    description:
      "Monitor, adapters, exporters, and AsyncLocalStorage request correlation.",
    tags: ["monitor", "adapter", "exporter", "async local storage"],
  },
  {
    title: "Signals Reference",
    href: "/docs/signals",
    section: "Core Concepts",
    description:
      "30+ signals across Critical, Warning, and Info severity levels.",
    tags: ["signals", "severity", "critical", "warning", "info"],
  },
  {
    title: "Event Examples",
    href: "/docs/event-examples",
    section: "Core Concepts",
    description: "Real ForgeEvent JSON output for all signal types.",
    tags: ["events", "json", "ForgeEvent", "output"],
  },
  {
    title: "Patterns",
    href: "/docs/patterns",
    section: "Core Concepts",
    description:
      "Common usage patterns: PagerDuty routing, Slack alerts, signal filtering.",
    tags: ["patterns", "pagerduty", "slack", "alerts"],
  },

  // ── Adapters ─────────────────────────────────────────────
  {
    title: "Adapters Overview",
    href: "/docs/adapters",
    section: "Adapters",
    description:
      "Database adapters for Mongoose, Prisma, PostgreSQL, and Redis.",
    tags: ["adapters", "database"],
  },
  {
    title: "Mongoose Adapter",
    href: "/docs/adapters/mongoose",
    section: "Adapters",
    description:
      "Instrument MongoDB operations with mongooseAdapter(monitor, mongoose).",
    tags: ["mongoose", "mongodb", "mongooseAdapter"],
  },
  {
    title: "Prisma Adapter",
    href: "/docs/adapters/prisma",
    section: "Adapters",
    description:
      "Instrument Prisma queries with prismaAdapter(monitor, prisma).",
    tags: ["prisma", "sql", "prismaAdapter"],
  },
  {
    title: "PostgreSQL (pg) Adapter",
    href: "/docs/adapters/pg",
    section: "Adapters",
    description:
      "Instrument raw pg Pool queries with pgAdapter(monitor, pool).",
    tags: ["pg", "postgres", "postgresql", "pgAdapter", "raw sql"],
  },
  {
    title: "Redis Adapter",
    href: "/docs/adapters/redis",
    section: "Adapters",
    description:
      "Instrument Redis commands with redisAdapter. 29 commands classified.",
    tags: ["redis", "ioredis", "redisAdapter", "commands", "KEYS", "FLUSHALL"],
  },

  // ── Frameworks ───────────────────────────────────────────
  {
    title: "Express Middleware",
    href: "/docs/frameworks/express",
    section: "Frameworks",
    description:
      "Attach request context with expressContext(monitor) before your routes.",
    tags: ["express", "expressContext", "middleware"],
  },
  {
    title: "Fastify Plugin",
    href: "/docs/frameworks/fastify",
    section: "Frameworks",
    description:
      "Attach request context with fastifyContext(monitor) as a Fastify plugin.",
    tags: ["fastify", "fastifyContext", "plugin"],
  },

  // ── Exporters ────────────────────────────────────────────
  {
    title: "Exporters",
    href: "/docs/exporters",
    section: "Exporters",
    description: "Route events to PagerDuty, Slack, Datadog, or OpenTelemetry.",
    tags: ["exporters", "otel", "opentelemetry", "datadog", "pagerduty"],
  },

  // ── Reference ────────────────────────────────────────────
  {
    title: "API Reference",
    href: "/docs/api-reference",
    section: "Reference",
    description:
      "Full TypeScript API — createMonitor, adapters, ForgeEvent interface, SignalSeverity enum.",
    tags: [
      "api",
      "typescript",
      "types",
      "ForgeEvent",
      "createMonitor",
      "SignalSeverity",
    ],
  },
  {
    title: "Setup Guide",
    href: "/docs/setup",
    section: "Reference",
    description: "Development setup, contributing, and testing.",
    tags: ["setup", "contributing", "development"],
  },

  // ── Signals (individual) ──────────────────────────────────
  {
    title: "hot_path",
    href: "/docs/signals/hot-path",
    section: "Signals",
    description: "Slow query on a frequently hit execution path. Critical.",
    tags: ["hot path", "slow", "frequent", "critical"],
  },
  {
    title: "n_plus_one",
    href: "/docs/signals/n-plus-one",
    section: "Signals",
    description:
      "Multiple queries where a single query should suffice. Critical.",
    tags: ["n+1", "batch", "loop", "critical"],
  },
  {
    title: "unbounded_query",
    href: "/docs/signals/unbounded-query",
    section: "Signals",
    description:
      "Missing LIMIT clause — potential unbounded data fetch. Critical.",
    tags: ["limit", "unbounded", "pagination", "critical"],
  },
  {
    title: "blocking_io",
    href: "/docs/signals/blocking-io",
    section: "Signals",
    description: "Blocking operations detected on event loop. Critical.",
    tags: ["blocking", "event loop", "sync", "critical"],
  },
  {
    title: "retry_loop",
    href: "/docs/signals/retry-loop",
    section: "Signals",
    description: "Excessive retries detected on query execution. Critical.",
    tags: ["retry", "deadlock", "critical"],
  },
  {
    title: "write_contention",
    href: "/docs/signals/write-contention",
    section: "Signals",
    description: "High-frequency writes to the same record. Critical.",
    tags: ["write", "contention", "lock", "critical"],
  },
  {
    title: "connection_pool_exhaustion",
    href: "/docs/signals/connection-pool-exhaustion",
    section: "Signals",
    description: "Database connection pool nearing or at capacity. Critical.",
    tags: ["pool", "connections", "exhaustion", "critical"],
  },
  {
    title: "slow_query",
    href: "/docs/signals/slow-query",
    section: "Signals",
    description: "Query exceeded configured threshold. Warning.",
    tags: ["slow", "threshold", "latency", "warning"],
  },
  {
    title: "fan_out",
    href: "/docs/signals/fan-out",
    section: "Signals",
    description: "Single request triggered multiple database queries. Warning.",
    tags: ["fan out", "multiple queries", "warning"],
  },
  {
    title: "high_variance_latency",
    href: "/docs/signals/high-variance-latency",
    section: "Signals",
    description: "Query latency is inconsistent across executions. Warning.",
    tags: ["variance", "latency", "inconsistent", "warning"],
  },
  {
    title: "high_cpu",
    href: "/docs/signals/high-cpu",
    section: "Signals",
    description: "Query caused high CPU consumption. Warning.",
    tags: ["cpu", "performance", "warning"],
  },
  {
    title: "high_memory",
    href: "/docs/signals/high-memory",
    section: "Signals",
    description: "Query caused high memory usage. Warning.",
    tags: ["memory", "heap", "warning"],
  },
  {
    title: "large_payload",
    href: "/docs/signals/large-payload",
    section: "Signals",
    description: "Query returned an excessively large dataset. Warning.",
    tags: ["payload", "large", "overfetch", "warning"],
  },
  {
    title: "deprecated_api",
    href: "/docs/signals/deprecated-api",
    section: "Signals",
    description: "Query used deprecated database methods. Warning.",
    tags: ["deprecated", "api", "warning"],
  },
  {
    title: "overfetching",
    href: "/docs/signals/overfetching",
    section: "Signals",
    description: "Query selects more fields than necessary. Warning.",
    tags: ["overfetch", "select", "fields", "warning"],
  },
  {
    title: "read_heavy_hotspot",
    href: "/docs/signals/read-heavy-hotspot",
    section: "Signals",
    description: "Concentrated read activity on specific records. Warning.",
    tags: ["read", "hotspot", "warning"],
  },
  {
    title: "fast_query",
    href: "/docs/signals/fast-query",
    section: "Signals",
    description: "Query executed well under threshold. Info.",
    tags: ["fast", "info"],
  },
  {
    title: "bounded_query",
    href: "/docs/signals/bounded-query",
    section: "Signals",
    description: "Proper LIMIT usage detected. Info.",
    tags: ["limit", "bounded", "info"],
  },
  {
    title: "indexed_lookup",
    href: "/docs/signals/indexed-lookup",
    section: "Signals",
    description: "Efficient index usage confirmed. Info.",
    tags: ["index", "lookup", "info"],
  },
  {
    title: "stable_latency",
    href: "/docs/signals/stable-latency",
    section: "Signals",
    description: "Consistent performance across requests. Info.",
    tags: ["stable", "latency", "info"],
  },
  {
    title: "cached_query",
    href: "/docs/signals/cached-query",
    section: "Signals",
    description: "Cache hit detected. Info.",
    tags: ["cache", "hit", "info"],
  },
  {
    title: "index_hit",
    href: "/docs/signals/index-hit",
    section: "Signals",
    description: "Confirmed index usage. Info.",
    tags: ["index", "info"],
  },
  {
    title: "single_query",
    href: "/docs/signals/single-query",
    section: "Signals",
    description: "No N+1 patterns detected. Info.",
    tags: ["single", "no n+1", "info"],
  },
  {
    title: "optimized_join",
    href: "/docs/signals/optimized-join",
    section: "Signals",
    description: "Efficient joins in use. Info.",
    tags: ["join", "optimized", "info"],
  },
  {
    title: "connection_reused",
    href: "/docs/signals/connection-reused",
    section: "Signals",
    description: "Connection pool working effectively. Info.",
    tags: ["connection", "pool", "reused", "info"],
  },
  {
    title: "low_memory",
    href: "/docs/signals/low-memory",
    section: "Signals",
    description: "Memory-efficient query execution. Info.",
    tags: ["memory", "low", "info"],
  },
  {
    title: "low_cpu",
    href: "/docs/signals/low-cpu",
    section: "Signals",
    description: "CPU-efficient operation. Info.",
    tags: ["cpu", "low", "info"],
  },
  {
    title: "stable_response",
    href: "/docs/signals/stable-response",
    section: "Signals",
    description: "Matches performance baselines. Info.",
    tags: ["stable", "baseline", "info"],
  },
  {
    title: "cache_candidate",
    href: "/docs/signals/cache-candidate",
    section: "Signals",
    description: "Query would benefit from caching. Info.",
    tags: ["cache", "candidate", "info"],
  },
  {
    title: "healthy_hot_path",
    href: "/docs/signals/healthy-hot-path",
    section: "Signals",
    description: "High-frequency query is fast and stable. Info.",
    tags: ["healthy", "hot path", "info"],
  },
];
