import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_keys signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_keys"
        severity="critical"
        summary="Full keyspace scan — blocks all Redis operations while running"
        detail="The KEYS command performs a full scan of the entire Redis keyspace. It is a single-threaded O(N) operation — while it runs, every other Redis command waits. On a database with millions of keys this can stall Redis for seconds, causing cascading timeouts across all clients sharing the instance."
        causes={[
          'Debugging sessions left in production code',
          'Admin scripts using KEYS to enumerate or clean up keys',
          'Pattern-matching deletions using KEYS + DEL in a loop',
          'Cache invalidation logic that scans for prefix-matched keys',
        ]}
        fixes={[
          'Replace KEYS with SCAN and a cursor — it iterates in small batches without blocking',
          'Maintain a secondary index (e.g. a Redis Set) to track related keys by prefix',
          'Use Redis key namespacing and maintain explicit lists of keys per namespace',
          'Restrict KEYS via Redis ACLs so it cannot fire in production at all',
        ]}
      />

      <Callout type="danger" title="Never use KEYS in production">
        <code>KEYS</code> is documented by Redis itself as not suitable for production use.
        There is no safe "small dataset" exception — even a brief KEYS call on a shared instance
        will block every other client for its entire duration.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — blocks the entire Redis instance
const keys = await redis.keys('session:*');
for (const key of keys) {
  await redis.del(key);
}

// GOOD — cursor-based scan, non-blocking
let cursor = '0';
do {
  const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'session:*', 'COUNT', 100);
  cursor = nextCursor;
  if (keys.length > 0) {
    await redis.del(...keys);
  }
} while (cursor !== '0');

// GOOD — maintain an explicit Set of keys
// When you write: redis.set(\`session:\${id}\`, data)
// Also track: redis.sadd('sessions:index', \`session:\${id}\`)
// To enumerate: redis.smembers('sessions:index')`}
      />

      <h2>Why SCAN is safe and KEYS is not</h2>
      <p>
        SCAN uses a cursor to return a small batch of keys per call. It shares processing time
        with other commands — each call releases the server after its batch. The full scan may
        take many round trips, but no single call monopolises the instance.
      </p>
      <CodeBlock
        language="typescript"
        code={`// Helper: collect all matching keys without blocking
async function scanKeys(redis: Redis, pattern: string): Promise<string[]> {
  const result: string[] = [];
  let cursor = '0';

  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
    cursor = next;
    result.push(...keys);
  } while (cursor !== '0');

  return result;
}

const sessionKeys = await scanKeys(redis, 'session:*');`}
      />

      <h2>Restricting via ACLs</h2>
      <CodeBlock
        language="bash"
        code={`# In redis.conf — deny KEYS to the application user
ACL SETUSER appuser ~* +@all -keys -flushall -flushdb

# Verify
redis-cli ACL WHOAMI
redis-cli ACL LIST`}
      />
    </article>
  )
}
