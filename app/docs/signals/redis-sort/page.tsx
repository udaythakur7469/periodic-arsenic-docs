import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_sort signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sort"
        severity="warning"
        summary="Sorts a list, set, or sorted set — memory and CPU intensive on large collections"
        detail="The SORT command sorts the elements of a list, set, or sorted set. It is O(N+M*log(M)) where N is the number of elements and M is the number of elements returned. SORT allocates a temporary copy of the collection in memory to sort, which can spike memory usage significantly. On large collections it can block Redis for measurable time and cause noticeable latency spikes."
        causes={[
          'Sorting large lists or sets at read time rather than pre-sorting at write time',
          'Dynamic sort orders that cannot be pre-computed',
          'Using SORT for ranked leaderboards instead of sorted sets',
          'SORT with BY or GET options fetching external keys — multiplies Redis operations',
        ]}
        fixes={[
          'Pre-sort at write time using sorted sets (ZADD) — ZRANGE retrieves in O(log N + M) with no sorting cost at read time',
          'If sort order is dynamic, sort in application memory on a bounded result set',
          'Use SORT with LIMIT to cap the result size',
          'Move expensive SORT operations to background workers',
        ]}
      />

      <Callout type="warning" title="Prefer sorted sets over SORT">
        In almost every use case where you reach for SORT, a sorted set (ZADD/ZRANGE) is the
        right data structure. The sort happens at write time, ZRANGE reads are cheap, and the
        score encodes any numeric ordering you need.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — sort a large list at read time on every request
const sorted = await redis.sort('user:scores', 'DESC', 'LIMIT', 0, 10);

// GOOD — use a sorted set: score is stored, retrieval is pre-sorted
// At write time:
await redis.zadd('leaderboard', score, userId);

// At read time — O(log N + M), no server-side sorting
const topTen = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// GOOD — if SORT is unavoidable, always use LIMIT
const limited = await redis.sort('items', 'ASC', 'LIMIT', 0, 50); // cap at 50

// GOOD — sort in application memory on a pre-bounded set
const members = await redis.lrange('recent:items', 0, 99); // bounded LRANGE
const sorted = members.map(Number).sort((a, b) => b - a).slice(0, 10);`}
      />

      <h2>Sorted set pattern for leaderboards</h2>
      <CodeBlock
        language="typescript"
        code={`// Leaderboard using sorted set — scales to millions of entries
const LEADERBOARD = 'game:leaderboard';

// Update score
await redis.zadd(LEADERBOARD, score, userId);

// Top 10
const top10 = await redis.zrevrange(LEADERBOARD, 0, 9, 'WITHSCORES');

// Player rank (0-indexed)
const rank = await redis.zrevrank(LEADERBOARD, userId);

// Score
const playerScore = await redis.zscore(LEADERBOARD, userId);

// Players within a score range
const highScorers = await redis.zrangebyscore(LEADERBOARD, 5000, '+inf', 'LIMIT', 0, 20);`}
      />
    </article>
  )
}
