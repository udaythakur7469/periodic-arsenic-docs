import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_scan signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_scan"
        severity="warning"
        summary="Cursor-based scan is O(N) across the full dataset when iterated to completion"
        detail="SCAN (and its variants SSCAN, HSCAN, ZSCAN) iterate over the keyspace or a collection incrementally using a cursor. Individual calls are non-blocking and return a small batch — this is intentional, and it is the correct alternative to KEYS. However, iterating SCAN to completion still performs O(N) total work across all batches. Running SCAN to completion on a hot path under load contributes measurable cumulative overhead."
        causes={[
          'Iterating SCAN to completion on every request in a hot path',
          'Cache invalidation that scans the entire keyspace per request',
          'Background jobs that scan without COUNT hints, generating excessive round trips',
          'Application code that conflates "non-blocking per call" with "cheap to complete"',
        ]}
        fixes={[
          'Move full SCAN iterations to background jobs or low-frequency tasks',
          'Use COUNT hints to reduce round trips — COUNT 500–1000 is reasonable for bulk operations',
          'Maintain explicit secondary indexes (Redis Sets) to avoid scanning for key discovery',
          'For SSCAN/HSCAN/ZSCAN: consider whether the full collection is actually needed or if SISMEMBER/HMGET/ZSCORE suffice',
        ]}
      />

      <Callout type="info" title="SCAN is the right alternative to KEYS">
        SCAN is correct to use — it is the non-blocking replacement for KEYS. The signal
        here is about using it to completion on hot paths. In background workers or infrequent
        admin tasks, iterating SCAN fully is fine.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// ACCEPTABLE — background job, runs infrequently
async function cleanExpiredSessions(redis: Redis) {
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', 'session:*', 'COUNT', 500);
    cursor = next;
    // process batch...
    const pipeline = redis.pipeline();
    for (const key of keys) {
      pipeline.ttl(key);
    }
    const ttls = await pipeline.exec();
    const expired = keys.filter((_, i) => ttls![i][1] === -1);
    if (expired.length > 0) await redis.unlink(...expired);
  } while (cursor !== '0');
}

// BAD — scanning to completion on every API request
app.get('/api/cache-stats', async (req, res) => {
  const keys: string[] = [];
  let cursor = '0';
  do {
    const [next, batch] = await redis.scan(cursor, 'MATCH', 'cache:*');
    cursor = next;
    keys.push(...batch);
  } while (cursor !== '0'); // runs to completion on every request
  res.json({ count: keys.length });
});

// GOOD — maintain a counter Set instead
// At write time:
await redis.incr('cache:key-count');
// At read time:
const count = await redis.get('cache:key-count');

// GOOD — use COUNT hints to reduce round trips in background jobs
const [next, keys] = await redis.scan(cursor, 'MATCH', 'cache:*', 'COUNT', 1000);`}
      />
    </article>
  )
}
