import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zunionstore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zunionstore"
        severity="warning"
        summary="Sorted set union with aggregated scores — O(N) across all input sets plus a write"
        detail="ZUNIONSTORE computes the union of multiple sorted sets and stores the result with aggregated scores. It is O(N) where N is the total number of elements across all input sorted sets, plus the cost of writing the result. Commonly used for combining ranked feeds, score aggregation, and multi-source ranking. When called synchronously on hot request paths rather than in background workers, it adds full union computation overhead to request latency."
        causes={[
          'Per-request ranked feed assembly combining multiple source sorted sets',
          'Multi-source score aggregation (SUM/MAX) computed live for ranking',
          'Inline ZUNIONSTORE in handlers that could use a cached pre-computed key',
          'Frequent refresh of large union results without TTL-based scheduling',
        ]}
        fixes={[
          'Pre-compute in a background worker using ZUNIONSTORE + EXPIRE on the destination key',
          'Read from the destination key on hot paths — never compute inline',
          'Use WEIGHTS option to tune score aggregation at pre-compute time rather than per-request',
          'Invalidate and recompute only when source sets change, not on every read',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — union recomputed per feed request
app.get('/api/feed', async (req, res) => {
  const dest = \`feed:\${req.user.id}:ranked\`;
  await redis.zunionstore(
    dest, 3,
    \`engagement:\${req.user.id}\`,
    'trending:global',
    \`personal:\${req.user.id}\`,
    'WEIGHTS', 2, 1, 1.5 // engagement boosted
  );
  const feed = await redis.zrevrange(dest, 0, 19, 'WITHSCORES');
  res.json(feed);
});

// GOOD — pre-computed ranked feed with background refresh
async function refreshRankedFeed(redis: Redis, userId: string) {
  const dest = \`feed:\${userId}:ranked\`;
  await redis.zunionstore(
    dest, 3,
    \`engagement:\${userId}\`,
    'trending:global',
    \`personal:\${userId}\`,
    'WEIGHTS', 2, 1, 1.5
  );
  await redis.expire(dest, 180); // 3 minute TTL
}

// Trigger on events that affect ranking
async function onNewPost(redis: Redis, authorId: string) {
  await redis.zadd('trending:global', engagementScore, postId);
  // Schedule feed refreshes for author's followers
  const followers = await redis.smembers(\`followers:\${authorId}\`);
  for (const followerId of followers) {
    queueJob('refresh-feed', { userId: followerId });
  }
}

// Hot path is now O(log N + M) — reading from a pre-scored sorted set
app.get('/api/feed', async (req, res) => {
  const feed = await redis.zrevrange(\`feed:\${req.user.id}:ranked\`, 0, 19, 'WITHSCORES');
  res.json(feed);
});`}
      />

      <Callout type="tip" title="WEIGHTS for personalised ranking">
        ZUNIONSTORE's WEIGHTS option lets you multiply each input set's scores before
        aggregation. Use this to implement personalised ranking at pre-compute time
        rather than post-processing in application code.
      </Callout>
    </article>
  )
}
