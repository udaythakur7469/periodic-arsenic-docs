#!/usr/bin/env node
/**
 * Signal page generator for @periodic/arsenic docs.
 *
 * USAGE:
 *   node generate-signals.mjs
 *
 * BEHAVIOUR:
 *   - Skips files that already exist (safe to re-run)
 *   - To regenerate a specific page: delete it, then re-run
 *   - Pages are committed to git — the generator is only needed for new signals
 *
 * ADDING A NEW SIGNAL:
 *   1. Add the signal entry to the `signals` array below
 *   2. Run: node generate-signals.mjs
 *   3. Commit the new page file
 *   4. Add the signal to lib/search-index.ts (for search)
 *   5. Add the signal to lib/navigation.ts (if it needs a sidebar entry)
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const signals = [
  {
    slug: "hot-path",
    name: "hot_path",
    severity: "critical",
    summary: "Slow query on a frequently hit execution path",
    detail:
      "This query appears on a hot execution path and contributes significantly to overall request latency. It is a high-priority optimization target because it is both slow AND frequently executed — a compound problem.",
    causes: [
      "Missing indexes on frequently queried fields",
      "Inefficient query structure executed at high frequency",
      "Large dataset without pagination on a popular route",
      "Complex joins on unindexed columns in hot paths",
    ],
    fixes: [
      "Add appropriate indexes for the queried fields",
      "Implement caching (Redis, Memcached) for this result",
      "Optimize the query structure or use projections",
      "Add pagination/limits to bound result size",
    ],
    code: `// BAD — slow findOne on every GET /users/:id
app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
});

// GOOD — add index on _id (already indexed) and cache the result
app.get('/users/:id', async (req, res) => {
  const cached = await redis.get(\`user:\${req.params.id}\`);
  if (cached) return res.json(JSON.parse(cached));

  const user = await User.findOne({ _id: req.params.id }).select('-__v');
  await redis.setex(\`user:\${req.params.id}\`, 300, JSON.stringify(user));
  res.json(user);
});`,
  },
  {
    slug: "n-plus-one",
    name: "n_plus_one",
    severity: "critical",
    summary: "Multiple queries detected where a single query should suffice",
    detail:
      "Data is fetched in a loop instead of a single batch query. This is the classic N+1 problem — 1 query to fetch N items, then N queries to fetch related data for each. Performance degrades linearly with dataset size.",
    causes: [
      "Iterating a result set and querying related data per item",
      "Missing ORM populate/include (.populate in Mongoose, include in Prisma)",
      "No DataLoader pattern for nested resolvers",
      "Lazy loading without eager loading configured",
    ],
    fixes: [
      "Use batch queries or joins",
      "Use Mongoose .populate() or Prisma include",
      "Implement DataLoader pattern",
      "Cache frequently accessed related data",
    ],
    code: `// BAD — N+1 query
const users = await User.find();
for (const user of users) {
  const posts = await Post.find({ userId: user._id }); // N queries
}

// GOOD — single batch query with populate
const users = await User.find().populate('posts');

// GOOD — Prisma equivalent
const users = await prisma.user.findMany({
  include: { posts: true },
});`,
  },
  {
    slug: "unbounded-query",
    name: "unbounded_query",
    severity: "critical",
    summary: "Query missing LIMIT — potential unbounded data fetch",
    detail:
      "This query does not include a LIMIT clause and may return an unexpectedly large dataset, causing memory spikes and performance degradation. On large collections, this can return millions of records.",
    causes: [
      "Missing LIMIT clause on find/select queries",
      "No default limit set at ORM level",
      "Pagination not implemented",
    ],
    fixes: [
      "Always add LIMIT clauses to find queries",
      "Implement cursor-based pagination",
      "Add default limits at ORM level",
      "Use .lean() in Mongoose for read-only queries",
    ],
    code: `// BAD — unbounded query
const users = await User.find({ status: 'active' });

// GOOD — always limit
const users = await User.find({ status: 'active' }).limit(100);

// GOOD — cursor-based pagination
const users = await User.find({
  status: 'active',
  _id: { $gt: lastSeenId }
}).limit(20);`,
  },
  {
    slug: "blocking-io",
    name: "blocking_io",
    severity: "critical",
    summary: "Blocking operations detected on event loop",
    detail:
      "Synchronous I/O operations are blocking the Node.js event loop, degrading overall application responsiveness. While blocked, no other requests can be processed.",
    causes: [
      "Synchronous file operations (fs.readFileSync, fs.writeFileSync)",
      "CPU-intensive operations on the main thread",
      "Synchronous JSON.parse on large payloads",
      "Missing async/await on I/O operations",
    ],
    fixes: [
      "Use async/await for all I/O operations",
      "Use fs.promises instead of synchronous fs methods",
      "Use worker threads for CPU-intensive tasks",
      "Profile event loop lag with clinic.js",
    ],
    code: `// BAD — blocking read on main thread
const config = fs.readFileSync('./config.json', 'utf8');

// GOOD — async file read
const config = await fs.promises.readFile('./config.json', 'utf8');

// GOOD — worker thread for CPU work
const { Worker } = require('worker_threads');
const result = await new Promise((resolve) => {
  const worker = new Worker('./heavy-compute.js');
  worker.on('message', resolve);
});`,
  },
  {
    slug: "retry-loop",
    name: "retry_loop",
    severity: "critical",
    summary: "Excessive retries detected on query execution",
    detail:
      "Query is being retried multiple times, indicating transient failures, deadlocks, or connectivity issues. Excessive retries cause latency spikes and may mask underlying infrastructure problems.",
    causes: [
      "Database connectivity issues",
      "Deadlocks in transactions",
      "Connection pool exhaustion causing timeouts",
      "Optimistic locking conflicts",
    ],
    fixes: [
      "Investigate database connectivity and logs",
      "Check for deadlocks in transaction logs",
      "Implement exponential backoff with jitter",
      "Add circuit breakers to prevent cascading failures",
    ],
    code: `// GOOD — exponential backoff with jitter
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      const jitter = Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}`,
  },
  {
    slug: "write-contention",
    name: "write_contention",
    severity: "critical",
    summary: "High-frequency writes to the same record detected",
    detail:
      "High-frequency writes to the same record may cause lock contention, serialization issues, and performance degradation. Common with counters, metrics, and leaderboards updated on every request.",
    causes: [
      "Counters or metrics updated on every request",
      "Session data written to the same record",
      "Rate limiting state stored in a single document",
      "Leaderboard or ranking updates at high frequency",
    ],
    fixes: [
      "Batch updates using $inc or equivalent atomic operations",
      "Use Redis for high-frequency counters",
      "Implement write buffering / debounce",
      "Consider event sourcing for counters",
    ],
    code: `// BAD — write contention on counter
await Counter.updateOne({ type: 'pageviews' }, { $inc: { count: 1 } });
// Every request hits the same document

// GOOD — buffer in Redis, flush periodically
await redis.incr('counter:pageviews');

// Flush to DB every 60s
setInterval(async () => {
  const count = await redis.getdel('counter:pageviews');
  if (count) await Counter.updateOne(
    { type: 'pageviews' },
    { $inc: { count: parseInt(count) } },
    { upsert: true }
  );
}, 60000);`,
  },
  {
    slug: "connection-pool-exhaustion",
    name: "connection_pool_exhaustion",
    severity: "critical",
    summary: "Database connection pool nearing or at capacity",
    detail:
      "The connection pool is under pressure. This leads to connection timeouts, failed requests, and cascading failures. Under high load, this can bring down an entire service.",
    causes: [
      "Too many concurrent requests for pool size",
      "Connection leaks — connections not returned to pool",
      "Slow queries holding connections too long",
      "Misconfigured pool size for workload",
    ],
    fixes: [
      "Increase pool size in DB config",
      "Investigate connection leaks",
      "Add connection timeout configuration",
      "Use PgBouncer or equivalent pooler",
    ],
    code: `// Mongoose — configure pool size
mongoose.connect(uri, {
  maxPoolSize: 20,        // Increase from default 5
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// pg — configure pool
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});`,
  },
];

const __dir = dirname(fileURLToPath(import.meta.url));

for (const sig of signals) {
  const sev = sig.severity;
  const sevBg = { critical: "red", warning: "amber", info: "blue" }[sev];
  const dir = join(__dir, "app/docs/signals", sig.slug);
  mkdirSync(dir, { recursive: true });

  const filePath = join(dir, "page.tsx");
  const banner = `// AUTO-GENERATED by generate-signals.mjs — do not edit manually.\n// To customize this page, delete this comment and edit freely.\n// Re-running generate-signals.mjs will skip this file once it exists.\n\n`;
  const content =
    banner +
    `import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: '${sig.name} signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="${sig.name}"
        severity="${sev}"
        summary="${sig.summary}"
        detail="${sig.detail}"
        causes={${JSON.stringify(sig.causes)}}
        fixes={${JSON.stringify(sig.fixes)}}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={\`${sig.code.replace(/`/g, "\\`")}\`} />
    </article>
  )
}
`;
  if (existsSync(filePath)) {
    console.log(`  Skipped (exists): ${filePath}`);
  } else {
    writeFileSync(filePath, content, "utf-8");
    console.log(`  Created: ${filePath}`);
  }
}

console.log("Done.");
