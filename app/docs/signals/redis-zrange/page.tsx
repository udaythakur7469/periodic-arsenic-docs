import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zrange signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zrange"
        severity="warning"
        summary="Sorted set range by rank — linear in the number of elements returned"
        detail="ZRANGE returns elements from a sorted set between two rank positions (or score range in Redis 6.2+). It is O(log N + M) where N is the sorted set size and M is the number of elements returned. Without a LIMIT clause, ZRANGE 0 -1 returns all members — equivalent to fetching an entire collection. On large sorted sets this transfers and serialises potentially thousands of elements per call."
        causes={[
          'Fetching the entire sorted set with ZRANGE 0 -1 for application-side filtering',
          'Leaderboards that return all players instead of a paginated window',
          'Timeline or feed retrieval without offset and count bounds',
          'Unbounded score range queries on large sorted sets',
        ]}
        fixes={[
          'Always pass explicit rank bounds — use ZRANGE start stop for a fixed window',
          'Paginate using ZRANGE with LIMIT offset count (Redis 6.2+) or ZRANGEBYSCORE LIMIT',
          'Use ZCARD to get the count without fetching members',
          'Use ZSCORE or ZRANK for point lookups — never fetch the full set to find one score',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — retrieves entire sorted set (potentially thousands of members)
const allScores = await redis.zrange('leaderboard:global', 0, -1, 'WITHSCORES');

// GOOD — paginated top-N window
const PAGE_SIZE = 20;
const topPlayers = await redis.zrange('leaderboard:global', 0, PAGE_SIZE - 1, 'WITHSCORES', 'REV');

// GOOD — paginated with offset (Redis 6.2+ ZRANGE LIMIT)
const page2 = await redis.zrange(
  'leaderboard:global',
  '+inf', '-inf',
  'BYSCORE', 'REV',
  'LIMIT', PAGE_SIZE, PAGE_SIZE // offset, count
);

// GOOD — user's surrounding context (players around rank N)
const userRank = await redis.zrevrank('leaderboard:global', userId);
const start = Math.max(0, userRank - 2);
const around = await redis.zrange('leaderboard:global', start, start + 4, 'REV', 'WITHSCORES');

// GOOD — point lookups avoid fetching ranges entirely
const score = await redis.zscore('leaderboard:global', userId);
const rank = await redis.zrevrank('leaderboard:global', userId);`}
      />

      <Callout type="tip" title="ZRANGE 0 -1 is the sorted-set equivalent of SMEMBERS">
        Both return the entire collection. If you find yourself filtering or slicing the
        result in application code, add bounds to the Redis query instead.
      </Callout>
    </article>
  )
}
