export interface NavItem {
  label: string
  href: string
  badge?: string
}

export interface NavSection {
  section: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    section: 'Getting Started',
    items: [
      { label: 'Introduction',    href: '/docs' },
      { label: 'Installation',    href: '/docs/installation' },
      { label: 'Quick Start',     href: '/docs/quickstart' },
      { label: 'Configuration',   href: '/docs/configuration' },
    ],
  },
  {
    section: 'Core Concepts',
    items: [
      { label: 'Core Concepts',   href: '/docs/core-concepts' },
      { label: 'Signals',         href: '/docs/signals', badge: '30+' },
      { label: 'Event Examples',  href: '/docs/event-examples' },
      { label: 'Patterns',        href: '/docs/patterns' },
    ],
  },
  {
    section: 'Database Adapters',
    items: [
      { label: 'Adapters Overview', href: '/docs/adapters' },
      { label: 'Mongoose',          href: '/docs/adapters/mongoose' },
      { label: 'Prisma',            href: '/docs/adapters/prisma' },
      { label: 'PostgreSQL (pg)',   href: '/docs/adapters/pg' },
      { label: 'Redis',             href: '/docs/adapters/redis', badge: '29 cmds' },
    ],
  },


  {
    section: 'Frameworks',
    items: [
      { label: 'Express',           href: '/docs/frameworks/express' },
      { label: 'Fastify',           href: '/docs/frameworks/fastify' },
    ],
  },
  {
    section: 'Exporters',
    items: [
      { label: 'Exporters',         href: '/docs/exporters' },
    ],
  },
  {
    section: 'Reference',
    items: [
      { label: 'API Reference',     href: '/docs/api-reference' },
      { label: 'Setup Guide',       href: '/docs/setup' },
      { label: 'Ecosystem',         href: '/ecosystem', badge: '10 pkgs' },
    ],
  },
]

export const signalsList = [
  // Critical
  { name: "hot_path", severity: "critical", slug: "hot-path" },
  { name: "n_plus_one", severity: "critical", slug: "n-plus-one" },
  { name: "unbounded_query", severity: "critical", slug: "unbounded-query" },
  { name: "blocking_io", severity: "critical", slug: "blocking-io" },
  { name: "retry_loop", severity: "critical", slug: "retry-loop" },
  { name: "write_contention", severity: "critical", slug: "write-contention" },
  {
    name: "connection_pool_exhaustion",
    severity: "critical",
    slug: "connection-pool-exhaustion",
  },
  // Warning
  { name: "slow_query", severity: "warning", slug: "slow-query" },
  { name: "fan_out", severity: "warning", slug: "fan-out" },
  {
    name: "high_variance_latency",
    severity: "warning",
    slug: "high-variance-latency",
  },
  { name: "high_cpu", severity: "warning", slug: "high-cpu" },
  { name: "high_memory", severity: "warning", slug: "high-memory" },
  { name: "large_payload", severity: "warning", slug: "large-payload" },
  { name: "deprecated_api", severity: "warning", slug: "deprecated-api" },
  { name: "overfetching", severity: "warning", slug: "overfetching" },
  {
    name: "read_heavy_hotspot",
    severity: "warning",
    slug: "read-heavy-hotspot",
  },
  // Info
  { name: "fast_query", severity: "info", slug: "fast-query" },
  { name: "bounded_query", severity: "info", slug: "bounded-query" },
  { name: "indexed_lookup", severity: "info", slug: "indexed-lookup" },
  { name: "stable_latency", severity: "info", slug: "stable-latency" },
  { name: "cached_query", severity: "info", slug: "cached-query" },
  { name: "index_hit", severity: "info", slug: "index-hit" },
  { name: "single_query", severity: "info", slug: "single-query" },
  { name: "optimized_join", severity: "info", slug: "optimized-join" },
  { name: "connection_reused", severity: "info", slug: "connection-reused" },
  { name: "low_memory", severity: "info", slug: "low-memory" },
  { name: "low_cpu", severity: "info", slug: "low-cpu" },
  { name: "stable_response", severity: "info", slug: "stable-response" },
  { name: "cache_candidate", severity: "info", slug: "cache-candidate" },
  { name: "healthy_hot_path", severity: "info", slug: "healthy-hot-path" },

  // ── Redis Signals ──────────────────────────────────────
  // Dangerous
  { name: "redis_keys", severity: "critical", slug: "redis-keys" },
  { name: "redis_flushall", severity: "critical", slug: "redis-flushall" },
  { name: "redis_flushdb", severity: "critical", slug: "redis-flushdb" },
  // Blocking
  { name: "redis_blpop", severity: "critical", slug: "redis-blpop" },
  { name: "redis_brpop", severity: "critical", slug: "redis-brpop" },
  { name: "redis_brpoplpush", severity: "critical", slug: "redis-brpoplpush" },
  { name: "redis_blmove", severity: "critical", slug: "redis-blmove" },
  // Slow
  { name: "redis_hgetall", severity: "warning", slug: "redis-hgetall" },
  { name: "redis_smembers", severity: "warning", slug: "redis-smembers" },
  { name: "redis_lrange", severity: "warning", slug: "redis-lrange" },
  { name: "redis_sort", severity: "warning", slug: "redis-sort" },
  { name: "redis_scan", severity: "warning", slug: "redis-scan" },
  { name: "redis_sunion", severity: "warning", slug: "redis-sunion" },
  { name: "redis_sinter", severity: "warning", slug: "redis-sinter" },
  { name: "redis_sdiff", severity: "warning", slug: "redis-sdiff" },
  { name: "redis_sunionstore", severity: "warning", slug: "redis-sunionstore" },
  { name: "redis_sinterstore", severity: "warning", slug: "redis-sinterstore" },
  { name: "redis_sdiffstore", severity: "warning", slug: "redis-sdiffstore" },
  { name: "redis_zrange", severity: "warning", slug: "redis-zrange" },
  {
    name: "redis_zrangebyscore",
    severity: "warning",
    slug: "redis-zrangebyscore",
  },
  { name: "redis_zrangebylex", severity: "warning", slug: "redis-zrangebylex" },
  { name: "redis_zrevrange", severity: "warning", slug: "redis-zrevrange" },
  {
    name: "redis_zrevrangebyscore",
    severity: "warning",
    slug: "redis-zrevrangebyscore",
  },
  { name: "redis_zinterstore", severity: "warning", slug: "redis-zinterstore" },
  { name: "redis_zunionstore", severity: "warning", slug: "redis-zunionstore" },
  { name: "redis_object", severity: "warning", slug: "redis-object" },
  { name: "redis_wait", severity: "warning", slug: "redis-wait" },
] as const;
