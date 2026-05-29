import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zinterstore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zinterstore"
        severity="warning"
        summary="Sorted set intersection with aggregated scores — expensive with large input sets"
        detail="ZINTERSTORE computes the intersection of multiple sorted sets and stores the result with aggregated scores (SUM, MIN, or MAX). It is O(N*K) where N is the size of the smallest input sorted set and K is the number of input keys. On large sorted sets called at request frequency it causes significant CPU overhead and memory pressure as Redis builds the intersection in memory."
        causes={[
          'Relevance ranking by intersecting user preference scores with item scores per request',
          'Multi-faceted filtering combining multiple sorted attribute indexes',
          'Tag-based search intersecting per-tag sorted sets without caching',
          'Recommendation scoring computed live by intersecting multiple signal sets',
        ]}
        fixes={[
          'Cache the intersection result with EXPIRE — run ZINTERSTORE in background workers',
          'Limit input set sizes using ZRANGEBYSCORE or ZRANGE before intersecting',
          'Use ZINTERCARD (Redis 7.0+) when you only need the intersection count',
          'Restructure as a write-time materialisation — compute scores when items are written',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — intersection computed live per search request
app.get('/api/search', async (req, res) => {
  const dest = 'search:result:temp';
  await redis.zinterstore(dest, 3, 'tag:nodejs', 'tag:typescript', 'tag:redis');
  const results = await redis.zrevrange(dest, 0, 19, 'WITHSCORES');
  res.json(results);
});

// GOOD — cache the intersection result
async function getSearchResults(redis: Redis, tags: string[]) {
  const cacheKey = \`search:cache:\${tags.sort().join(':')}\`;
  const ttl = await redis.ttl(cacheKey);

  if (ttl < 0) {
    // Compute and cache in background, return stale or empty for now
    queueJob('refresh-search-cache', { tags });
    return redis.zrevrange(cacheKey, 0, 19, 'WITHSCORES'); // may be empty
  }

  return redis.zrevrange(cacheKey, 0, 19, 'WITHSCORES');
}

// Background worker
async function refreshSearchCache(redis: Redis, tags: string[]) {
  const dest = \`search:cache:\${tags.sort().join(':')}\`;
  await redis.zinterstore(dest, tags.length, ...tags);
  await redis.expire(dest, 300);
}

// GOOD — Redis 7.0+ count-only intersection
const matchCount = await redis.zintercard(3, 'tag:nodejs', 'tag:typescript', 'tag:redis');`}
      />

      <Callout type="tip" title="ZINTERCARD for count-only intersections">
        Redis 7.0 added ZINTERCARD which returns only the cardinality of the intersection
        without building the full result set. Use it when you only need to know how many
        items match multiple criteria.
      </Callout>
    </article>
  )
}
