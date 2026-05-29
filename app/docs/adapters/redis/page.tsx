import type { Metadata } from 'next'
import Link from "next/link";
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Redis Adapter' }

export default function RedisAdapterPage() {
  return (
    <article className="prose-doc">
      <h1>Redis Adapter</h1>
      <p>
        The Redis adapter monitors every command via ioredis or node-redis,
        automatically classifying each into one of four categories:{" "}
        <strong>dangerous</strong>, <strong>blocking</strong>,{" "}
        <strong>slow</strong>, or <strong>normal</strong>. 29 commands are
        explicitly documented.
      </p>

      <h2>Setup</h2>
      <CodeBlock
        language="typescript"
        code={`import Redis from 'ioredis';
import { createMonitor, redisAdapter, getRedisCommandInfo, SLOW_REDIS_COMMANDS } from '@periodic/arsenic';

const redis = new Redis({ host: process.env.REDIS_HOST, port: 6379 });

const monitor = createMonitor({
  slowQueryThresholdMs: 50, // Stricter for Redis
  exporter: (event) => {
    const category = event.metadata?.commandCategory;

    if (category === 'dangerous') {
      // KEYS/FLUSHALL/FLUSHDB should never fire in production
      sendToPagerDuty(event);
    } else if (category === 'blocking' && event.slow) {
      sendToSlack(event);
    } else if (category === 'slow' && event.slow) {
      logger.warn('redis.slow', event);
    }
  },
});

redisAdapter(monitor, redis);`}
      />

      <h2>Command utilities</h2>
      <CodeBlock
        language="typescript"
        code={`import { getRedisCommandInfo, REDIS_COMMAND_INFO, SLOW_REDIS_COMMANDS } from '@periodic/arsenic';

// Get info for a specific command
const info = getRedisCommandInfo('KEYS');
// { command: 'KEYS', category: 'dangerous', docs: 'https://arsenicdev.online/redis/keys' }

const info2 = getRedisCommandInfo('GET');
// { command: 'GET', category: 'normal', docs: 'https://arsenicdev.online/redis/get' }

// Array of all slow command names
console.log(SLOW_REDIS_COMMANDS); // ['HGETALL', 'SMEMBERS', ...]`}
      />

      <h2>🔴 Dangerous Commands (3)</h2>
      <p>
        These should <strong>never run in production</strong>. Arsenic always
        flags these regardless of duration.
      </p>

      <div className="not-prose space-y-3 my-5">
        {[
          {
            cmd: "KEYS",
            issue:
              "Full keyspace scan — blocks ALL Redis operations while running. Stalls for seconds on large datasets.",
            fix: "Use SCAN with a cursor for non-blocking key enumeration.",
          },
          {
            cmd: "FLUSHALL",
            issue:
              "Deletes every key in every database on the Redis instance. No confirmation, no undo.",
            fix: "Restrict via Redis ACLs. Use targeted DEL or UNLINK.",
          },
          {
            cmd: "FLUSHDB",
            issue:
              "Deletes all keys in the currently selected database. Equally destructive within its scope.",
            fix: "Restrict via ACLs. Use selective key deletion instead.",
          },
        ].map((c) => (
          <div
            key={c.cmd}
            className="border border-border border-l-4 border-l-red-500 rounded-r-xl p-5 shadow-sm"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/docs/signals/redis-${c.cmd.toLowerCase()}`}>
                <code
                  className="font-bold text-sm bg-muted px-2 py-0.5 rounded border hover:underline"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--foreground)",
                  }}
                >
                  {c.cmd}
                </code>
              </Link>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50">
                dangerous
              </span>
            </div>
            <p
              className="text-sm mb-2 leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {c.issue}
            </p>
            <p className="text-sm">
              <span
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Fix:{" "}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>{c.fix}</span>
            </p>
          </div>
        ))}
      </div>

      <h2>⚠️ Blocking Commands (4)</h2>
      <p>
        Commands that block the calling client until data is available or a
        timeout expires. Valid for task queues, but require careful
        configuration.
      </p>

      <div className="not-prose space-y-3 my-5">
        {[
          {
            cmd: "BLPOP",
            issue:
              "Blocks until an element is available in one of the specified lists.",
            caution:
              "Always set a timeout. Unbounded blocking exhausts your connection pool.",
          },
          {
            cmd: "BRPOP",
            issue: "Blocking right-side pop from a list.",
            caution: "Use with timeout and dedicated connection pool.",
          },
          {
            cmd: "BRPOPLPUSH",
            issue:
              "Atomically pops from one list and pushes to another — blocks until source has data.",
            caution: "Deprecated in Redis 6.2. Use BLMOVE instead.",
          },
          {
            cmd: "BLMOVE",
            issue: "Blocking atomic move between lists. Replaces BRPOPLPUSH.",
            caution: "Always specify a timeout to prevent indefinite blocking.",
          },
        ].map((c) => (
          <div
            key={c.cmd}
            className="border border-border border-l-4 border-l-amber-500 rounded-r-xl p-5 shadow-sm"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/docs/signals/redis-${c.cmd.toLowerCase()}`}>
                <code
                  className="font-bold text-sm bg-muted px-2 py-0.5 rounded border hover:underline"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--foreground)",
                  }}
                >
                  {c.cmd}
                </code>
              </Link>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50">
                blocking
              </span>
            </div>
            <p
              className="text-sm mb-1 leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {c.issue}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ {c.caution}
            </p>
          </div>
        ))}
      </div>

      <h2>⏱️ Slow Commands (22)</h2>
      <p>
        O(N) or worse complexity. Safe in small datasets but can degrade under
        load.
      </p>

      <div className="not-prose space-y-3 my-5">
        {[
          {
            cmd: "HGETALL",
            slug: "redis-hgetall",
            issue: "Returns every field in a hash — O(N) with hash size.",
            fix: "Use HMGET with explicit fields, or HSCAN.",
          },
          {
            cmd: "SMEMBERS",
            slug: "redis-smembers",
            issue: "Returns all set members — unbounded on large sets.",
            fix: "Use SSCAN to iterate, or SRANDMEMBER for sampling.",
          },
          {
            cmd: "LRANGE",
            slug: "redis-lrange",
            issue: "Scans a range of list elements.",
            fix: "Use narrow ranges or cursor-based pagination.",
          },
          {
            cmd: "SORT",
            slug: "redis-sort",
            issue: "Sorts list/set/sorted set — memory and CPU intensive.",
            fix: "Pre-sort at write time using sorted sets.",
          },
          {
            cmd: "SCAN / SSCAN / HSCAN / ZSCAN",
            slug: "redis-scan",
            issue: "O(N) across full dataset when iterated to completion.",
            fix: "Use count hints, move full scans to background jobs.",
          },
          {
            cmd: "SUNION / SINTER / SDIFF",
            slug: "redis-sunion",
            issue: "Set operations — O(N) across all input sets.",
            fix: "Cache results for stable inputs.",
          },
          {
            cmd: "SUNIONSTORE / SINTERSTORE / SDIFFSTORE",
            slug: "redis-sunionstore",
            issue: "Same as above but also writes result.",
            fix: "Run as background job, cache with TTL.",
          },
          {
            cmd: "ZRANGE / ZRANGEBYSCORE / ZRANGEBYLEX",
            slug: "redis-zrange",
            issue: "Range queries on sorted set — linear in elements returned.",
            fix: "Paginate with LIMIT offset count.",
          },
          {
            cmd: "ZREVRANGE / ZREVRANGEBYSCORE",
            slug: "redis-zrevrange",
            issue: "Reverse range queries on sorted set.",
            fix: "Paginate with LIMIT.",
          },
          {
            cmd: "ZINTERSTORE / ZUNIONSTORE",
            slug: "redis-zinterstore",
            issue:
              "Sorted set intersection/union — expensive with large inputs.",
            fix: "Cache results, run in background workers.",
          },
          {
            cmd: "OBJECT",
            slug: "redis-object",
            issue:
              "Inspects internal Redis metadata — overhead in tight loops.",
            fix: "Use only for diagnostics, not in hot paths.",
          },
          {
            cmd: "WAIT",
            slug: "redis-wait",
            issue:
              "Blocks until replicas acknowledge writes — latency from replication lag.",
            fix: "Set reasonable timeout; use only for strong consistency.",
          },
        ].map((c) => (
          <div
            key={c.cmd}
            className="border border-border border-l-4 border-l-yellow-500 rounded-r-xl p-5 shadow-sm"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/docs/signals/${c.slug}`}>
                <code
                  className="font-bold text-sm bg-muted px-2 py-0.5 rounded border hover:underline"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--foreground)",
                  }}
                >
                  {c.cmd}
                </code>
              </Link>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/50">
                slow
              </span>
            </div>
            <p
              className="text-sm mb-2 leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {c.issue}
            </p>
            <p className="text-sm">
              <span
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Fix:{" "}
              </span>
              <span style={{ color: "var(--muted-foreground)" }}>{c.fix}</span>
            </p>
          </div>
        ))}
      </div>

      <Callout type="danger" title="Never use KEYS in production">
        <code>KEYS</code> performs a full keyspace scan and blocks ALL other
        Redis operations while running. On a database with millions of keys,
        this can stall Redis for seconds. Use <code>SCAN</code> with a cursor
        instead.
      </Callout>

      <h2>Category-based alerting</h2>
      <CodeBlock
        language="typescript"
        code={`import { SignalSeverity } from '@periodic/arsenic';

const monitor = createMonitor({
  exporter: (event) => {
    const category = event.metadata?.commandCategory;
    switch (category) {
      case 'dangerous':
        sendToPagerDuty(event);
        break;
      case 'blocking':
        if (event.slow) sendToSlack(event);
        break;
      case 'slow':
        logger.warn('redis.slow_command', {
          command: event.operation,
          durationMs: event.durationMs,
          docs: event.metadata?.commandDocs,
        });
        if (event.severity === SignalSeverity.CRITICAL) sendToSlack(event);
        break;
      default:
        logger.info('redis.query', event);
    }
  },
});`}
      />
    </article>
  );
}
