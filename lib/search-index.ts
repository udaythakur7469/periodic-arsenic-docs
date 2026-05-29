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
      "50+ signals across Critical, Warning, and Info severity levels.",
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
  // ── Redis Signals ─────────────────────────────────────────
  {
    title: "redis_keys",
    href: "/docs/signals/redis-keys",
    section: "Signals",
    description:
      "Full keyspace scan — blocks all Redis operations while running. Critical.",
    tags: ["redis", "keys", "scan", "critical"],
  },
  {
    title: "redis_flushall",
    href: "/docs/signals/redis-flushall",
    section: "Signals",
    description:
      "Deletes every key in every Redis database. No undo. Critical.",
    tags: ["redis", "flushall", "dangerous", "critical"],
  },
  {
    title: "redis_flushdb",
    href: "/docs/signals/redis-flushdb",
    section: "Signals",
    description: "Deletes all keys in the selected Redis database. Critical.",
    tags: ["redis", "flushdb", "dangerous", "critical"],
  },
  {
    title: "redis_blpop",
    href: "/docs/signals/redis-blpop",
    section: "Signals",
    description:
      "Blocking left-side list pop — blocks client until data is available. Critical.",
    tags: ["redis", "blpop", "blocking", "critical"],
  },
  {
    title: "redis_brpop",
    href: "/docs/signals/redis-brpop",
    section: "Signals",
    description: "Blocking right-side list pop. Critical.",
    tags: ["redis", "brpop", "blocking", "critical"],
  },
  {
    title: "redis_brpoplpush",
    href: "/docs/signals/redis-brpoplpush",
    section: "Signals",
    description:
      "Blocking pop-and-push between lists. Deprecated in Redis 6.2. Critical.",
    tags: ["redis", "brpoplpush", "blocking", "critical"],
  },
  {
    title: "redis_blmove",
    href: "/docs/signals/redis-blmove",
    section: "Signals",
    description: "Blocking atomic list move. Critical.",
    tags: ["redis", "blmove", "blocking", "critical"],
  },
  {
    title: "redis_hgetall",
    href: "/docs/signals/redis-hgetall",
    section: "Signals",
    description:
      "Returns every field in a hash — O(N) with hash size. Warning.",
    tags: ["redis", "hgetall", "hash", "warning"],
  },
  {
    title: "redis_smembers",
    href: "/docs/signals/redis-smembers",
    section: "Signals",
    description: "Returns all set members — unbounded on large sets. Warning.",
    tags: ["redis", "smembers", "set", "warning"],
  },
  {
    title: "redis_lrange",
    href: "/docs/signals/redis-lrange",
    section: "Signals",
    description: "Scans a range of list elements. Warning.",
    tags: ["redis", "lrange", "list", "warning"],
  },
  {
    title: "redis_sort",
    href: "/docs/signals/redis-sort",
    section: "Signals",
    description:
      "Sorts list/set/sorted set — memory and CPU intensive. Warning.",
    tags: ["redis", "sort", "warning"],
  },
  {
    title: "redis_scan",
    href: "/docs/signals/redis-scan",
    section: "Signals",
    description: "Full dataset scan when iterated to completion. Warning.",
    tags: ["redis", "scan", "sscan", "hscan", "zscan", "warning"],
  },
  {
    title: "redis_sunion",
    href: "/docs/signals/redis-sunion",
    section: "Signals",
    description: "Set union — O(N) across all input sets. Warning.",
    tags: ["redis", "sunion", "set", "warning"],
  },
  {
    title: "redis_sinter",
    href: "/docs/signals/redis-sinter",
    section: "Signals",
    description: "Set intersection — O(N) across all input sets. Warning.",
    tags: ["redis", "sinter", "set", "warning"],
  },
  {
    title: "redis_sdiff",
    href: "/docs/signals/redis-sdiff",
    section: "Signals",
    description: "Set difference — O(N) across all input sets. Warning.",
    tags: ["redis", "sdiff", "set", "warning"],
  },
  {
    title: "redis_sunionstore",
    href: "/docs/signals/redis-sunionstore",
    section: "Signals",
    description: "Set union and store result. Warning.",
    tags: ["redis", "sunionstore", "set", "warning"],
  },
  {
    title: "redis_sinterstore",
    href: "/docs/signals/redis-sinterstore",
    section: "Signals",
    description: "Set intersection and store result. Warning.",
    tags: ["redis", "sinterstore", "set", "warning"],
  },
  {
    title: "redis_sdiffstore",
    href: "/docs/signals/redis-sdiffstore",
    section: "Signals",
    description: "Set difference and store result. Warning.",
    tags: ["redis", "sdiffstore", "set", "warning"],
  },
  {
    title: "redis_zrange",
    href: "/docs/signals/redis-zrange",
    section: "Signals",
    description:
      "Sorted set range query — linear in elements returned. Warning.",
    tags: ["redis", "zrange", "sorted set", "warning"],
  },
  {
    title: "redis_zrangebyscore",
    href: "/docs/signals/redis-zrangebyscore",
    section: "Signals",
    description: "Sorted set score-based range query. Warning.",
    tags: ["redis", "zrangebyscore", "sorted set", "warning"],
  },
  {
    title: "redis_zrangebylex",
    href: "/docs/signals/redis-zrangebylex",
    section: "Signals",
    description: "Sorted set lexicographic range query. Warning.",
    tags: ["redis", "zrangebylex", "sorted set", "warning"],
  },
  {
    title: "redis_zrevrange",
    href: "/docs/signals/redis-zrevrange",
    section: "Signals",
    description: "Reverse sorted set range query. Warning.",
    tags: ["redis", "zrevrange", "sorted set", "warning"],
  },
  {
    title: "redis_zrevrangebyscore",
    href: "/docs/signals/redis-zrevrangebyscore",
    section: "Signals",
    description: "Reverse sorted set score-based range query. Warning.",
    tags: ["redis", "zrevrangebyscore", "sorted set", "warning"],
  },
  {
    title: "redis_zinterstore",
    href: "/docs/signals/redis-zinterstore",
    section: "Signals",
    description:
      "Sorted set intersection — expensive with large inputs. Warning.",
    tags: ["redis", "zinterstore", "sorted set", "warning"],
  },
  {
    title: "redis_zunionstore",
    href: "/docs/signals/redis-zunionstore",
    section: "Signals",
    description: "Sorted set union — expensive with large inputs. Warning.",
    tags: ["redis", "zunionstore", "sorted set", "warning"],
  },
  {
    title: "redis_object",
    href: "/docs/signals/redis-object",
    section: "Signals",
    description:
      "Inspects Redis internal metadata — overhead in tight loops. Warning.",
    tags: ["redis", "object", "warning"],
  },
  {
    title: "redis_wait",
    href: "/docs/signals/redis-wait",
    section: "Signals",
    description:
      "Blocks until replicas acknowledge writes — replication lag. Warning.",
    tags: ["redis", "wait", "replication", "warning"],
  },
];
