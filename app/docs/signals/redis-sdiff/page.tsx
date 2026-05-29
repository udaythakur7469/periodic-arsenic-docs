import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'

export const metadata: Metadata = { title: 'redis_sdiff signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sdiff"
        severity="warning"
        summary="Set difference — O(N) across all input sets, linear in total membership"
        detail="SDIFF returns members present in the first set but not in any subsequent set. It is O(N) where N is the total number of elements across all sets. Common use cases include computing content a user has not yet seen, permissions that do not apply, or items not in a given category. When the first set is large, SDIFF transfers a large working set even if the final difference is small."
        causes={[
          '"Unseen" content or notification filters computed per request',
          'Permission exclusion lists applied at read time',
          'Recommendation deduplication — items seen minus items recommended',
          'A/B test exclusion sets computed live',
        ]}
        fixes={[
          'Cache the diff result with SDIFFSTORE and a TTL',
          'Maintain the difference set explicitly at write time (SREM when items are seen)',
          'Compute small diffs in application memory if sets are bounded',
          'Move SDIFF to background workers for pre-computation',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — computing unseen items per request
app.get('/api/recommendations', async (req, res) => {
  const unseen = await redis.sdiff(
    \`recommendations:\${userId}\`,
    \`seen:\${userId}\`,
    \`dismissed:\${userId}\`
  );
  res.json(unseen.slice(0, 10));
});

// GOOD — maintain seen/unseen state at write time
// When a user sees an item:
await redis.smove(\`recommendations:\${userId}\`, \`seen:\${userId}\`, itemId);
// Read unseen directly — no SDIFF needed
const unseen = await redis.sscan(\`recommendations:\${userId}\`, '0', 'COUNT', 10);

// GOOD — cache the diff result
async function getUnseenItems(redis: Redis, userId: string) {
  const cacheKey = \`unseen:\${userId}\`;
  let count = await redis.scard(cacheKey);

  if (count === 0) {
    await redis.sdiffstore(
      cacheKey,
      \`recommendations:\${userId}\`,
      \`seen:\${userId}\`
    );
    await redis.expire(cacheKey, 120);
    count = await redis.scard(cacheKey);
  }

  return redis.srandmember(cacheKey, 10);
}

// GOOD — application-level diff on small bounded sets
const [recs, seen] = await Promise.all([
  redis.smembers(\`recommendations:\${userId}\`),
  redis.smembers(\`seen:\${userId}\`),
]);
const seenSet = new Set(seen);
const unseen = recs.filter(id => !seenSet.has(id));`}
      />
    </article>
  )
}
