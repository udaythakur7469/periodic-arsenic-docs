import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_sunionstore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sunionstore"
        severity="warning"
        summary="Set union with write — same cost as SUNION plus an additional write operation"
        detail="SUNIONSTORE computes the union of multiple sets and writes the result to a destination key. The cost is identical to SUNION (O(N) across all input sets) plus a write of the result. When called on a hot path rather than as a background cache-refresh operation, it adds both the computation overhead and a write amplification cost to every request."
        causes={[
          'Using SUNIONSTORE as an inline cache-aside on hot endpoints',
          'Refreshing the stored union on every read rather than on a schedule',
          'Background jobs that refresh too frequently — e.g. every second on a stable set',
        ]}
        fixes={[
          'Run SUNIONSTORE in a background worker on a schedule, not per request',
          'Set a TTL on the destination key and only refresh when the TTL nears expiry',
          'Combine with a distributed lock to prevent thundering herd on expiry',
          'Read from the destination key on hot paths — the key is the cache',
        ]}
      />

      <Callout type="info" title="SUNIONSTORE is the right caching pattern for SUNION">
        The signal is not that SUNIONSTORE is wrong — it is the correct tool for pre-computing
        expensive set unions. The signal is when it appears on hot paths rather than in
        background refresh workers.
      </Callout>

      <h2>Correct usage pattern</h2>
      <CodeBlock
        language="typescript"
        code={`// Background worker — refreshes the cached union periodically
async function refreshFeedCache(redis: Redis, userId: string) {
  const dest = \`feed:cache:\${userId}\`;
  await redis.sunionstore(dest, \`following:\${userId}\`, \`trending\`, \`recommended:\${userId}\`);
  await redis.expire(dest, 120); // 2 minute TTL
}

// Schedule refresh
setInterval(() => refreshFeedCache(redis, userId), 90_000);

// Hot path reads from the pre-computed key — O(1) or bounded SMEMBERS/SSCAN
app.get('/api/feed', async (req, res) => {
  const feed = await redis.smembers(\`feed:cache:\${req.user.id}\`);
  res.json(feed.slice(0, 20));
});

// With distributed lock to prevent thundering herd on expiry
async function getOrRefreshFeed(redis: Redis, userId: string) {
  const dest = \`feed:cache:\${userId}\`;
  const ttl = await redis.ttl(dest);

  if (ttl < 10) { // near expiry
    const lockKey = \`lock:feed:\${userId}\`;
    const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 10);
    if (acquired) {
      await refreshFeedCache(redis, userId);
      await redis.del(lockKey);
    }
  }

  return redis.smembers(dest);
}`}
      />
    </article>
  )
}
