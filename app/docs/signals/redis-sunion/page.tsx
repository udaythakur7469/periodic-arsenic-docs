import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_sunion signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sunion"
        severity="warning"
        summary="Set union — O(N) across all input sets, returns combined result"
        detail="SUNION computes the union of multiple sets and returns all unique members. It is O(N) where N is the total number of members across all input sets. For small sets used occasionally this is negligible. On large sets called at request frequency it generates significant serialisation overhead and memory pressure as Redis builds the result in memory before returning it."
        causes={[
          'Computing combined permission sets or role memberships per request',
          'Merging tag or category indexes without caching the result',
          'Real-time feed assembly by unioning multiple user lists',
          'Dynamic ACL computation by combining multiple permission sets',
        ]}
        fixes={[
          'Cache the union result with a TTL using SUNIONSTORE, then read from the stored key',
          'Move SUNION calls to background workers that refresh the result periodically',
          'If input sets are small and stable, compute the union in application memory',
          'Structure data to avoid needing unions — denormalise into a single set at write time',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — computing union on every request
app.get('/api/feed', async (req, res) => {
  const feed = await redis.sunion(
    \`following:\${userId}\`,
    \`trending:global\`,
    \`recommended:\${userId}\`
  );
  res.json(feed);
});

// GOOD — cache the union result with SUNIONSTORE
async function refreshUserFeed(redis: Redis, userId: string) {
  const feedKey = \`feed:\${userId}\`;
  await redis.sunionstore(
    feedKey,
    \`following:\${userId}\`,
    \`trending:global\`,
    \`recommended:\${userId}\`
  );
  await redis.expire(feedKey, 60); // refresh every minute
}

// Schedule the refresh in background
setInterval(() => refreshUserFeed(redis, userId), 55_000);

// Read is now a cheap O(1) lookup or LRANGE on the stored key
const feed = await redis.smembers('feed:userId'); // from cached union

// GOOD — denormalise at write time if sets are stable
// When a user follows someone:
await redis.sadd(\`feed:\${followerId}\`, ...newPostIds); // write-time merge`}
      />

      <Callout type="tip" title="SUNIONSTORE as a cache strategy">
        SUNIONSTORE writes the union result to a destination key. Combine it with EXPIRE
        and run it in a background job. Your hot path then reads a pre-computed key
        rather than computing the union live on each request.
      </Callout>
    </article>
  )
}
