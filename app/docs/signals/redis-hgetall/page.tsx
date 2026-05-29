import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_hgetall signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_hgetall"
        severity="warning"
        summary="Returns every field in a hash — O(N) with hash size, unbounded on large hashes"
        detail="HGETALL fetches all fields and values from a Redis hash in a single round trip. While convenient, it is O(N) where N is the number of fields. On small hashes this is negligible. On hashes with hundreds or thousands of fields — common for session stores, user profiles, or config objects — it transfers and deserialises far more data than most callers actually need."
        causes={[
          'Fetching a full hash when only 2–3 specific fields are needed',
          'Session store implementations that store many attributes per key',
          'User profile or config caches without field projection',
          'Analytics accumulators using hash fields per metric',
        ]}
        fixes={[
          'Use HMGET with explicit field names to fetch only what is needed',
          'Use HSCAN for incremental iteration on large hashes',
          'Split large hashes into smaller, purpose-specific keys',
          'Add field projections at the application layer before caching',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — fetches all 200 fields when only 2 are needed
const session = await redis.hgetall(\`session:\${sessionId}\`);
const role = session.role;
const userId = session.userId;

// GOOD — fetch only required fields
const [role, userId] = await redis.hmget(\`session:\${sessionId}\`, 'role', 'userId');

// GOOD — HSCAN for iterating large hashes without blocking
async function iterateHash(redis: Redis, key: string, handler: (field: string, value: string) => Promise<void>) {
  let cursor = '0';
  do {
    const [next, entries] = await redis.hscan(key, cursor, 'COUNT', 100);
    cursor = next;
    for (let i = 0; i < entries.length; i += 2) {
      await handler(entries[i], entries[i + 1]);
    }
  } while (cursor !== '0');
}

// GOOD — split large hashes into targeted keys
// Instead of: hset('user:123', 'name', ..., 'email', ..., 'analytics_lifetime_value', ...)
// Use:
// hset('user:123:profile', 'name', ..., 'email', ...)  — frequently read
// hset('user:123:analytics', 'lifetime_value', ...)     — rarely read`}
      />

      <Callout type="tip" title="HMGET is almost always the right call">
        If you know which fields you need — and in most application code you do — use HMGET.
        It fetches only what you specify and has the same O(N-requested) complexity as HGETALL
        but on a much smaller N.
      </Callout>
    </article>
  )
}
