import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zrevrange signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zrevrange"
        severity="warning"
        summary="Sorted set reverse range by rank — linear in the number of elements returned"
        detail="ZREVRANGE returns elements from a sorted set in descending score order between two rank positions. It is the reverse-order counterpart to ZRANGE and carries the same O(log N + M) cost. Without explicit rank bounds it returns entire collections. As of Redis 6.2, ZREVRANGE is superseded by ZRANGE with the REV flag."
        causes={[
          'Leaderboard queries that return all players in descending order',
          'Timeline feeds retrieved in reverse chronological order without pagination',
          'Top-N queries that use ZREVRANGE 0 -1 and slice in application code',
          'Feed assemblies that fetch all historical entries to display the latest few',
        ]}
        fixes={[
          'Use explicit start and stop rank bounds — ZREVRANGE 0 9 for the top 10',
          'Migrate to ZRANGE with REV flag for Redis 6.2+ (consistent API, same performance)',
          'Use ZREVRANK and ZSCORE for point lookups instead of fetching ranges',
          'Page results with offset-based rank windows for large collections',
        ]}
      />

      <Callout type="info" title="Deprecated in Redis 6.2">
        ZREVRANGE is superseded by <code>ZRANGE key start stop REV</code>. The unified ZRANGE
        command handles all direction and range-type combinations. Consider migrating for
        consistency in new code.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — entire sorted set in reverse order (all N members)
const allPlayers = await redis.zrevrange('leaderboard', 0, -1, 'WITHSCORES');

// GOOD — top 10 only, explicit bounds
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// GOOD — Redis 6.2+ equivalent
const top10Modern = await redis.zrange('leaderboard', 0, 9, 'REV', 'WITHSCORES');

// GOOD — paginated leaderboard
async function getLeaderboardPage(redis: Redis, page: number, pageSize = 25) {
  const start = page * pageSize;
  const stop = start + pageSize - 1;
  return redis.zrevrange('leaderboard', start, stop, 'WITHSCORES');
}

// GOOD — point lookups for a specific user
const userRank = await redis.zrevrank('leaderboard', userId);    // rank (0-indexed)
const userScore = await redis.zscore('leaderboard', userId);     // score value

// GOOD — user's surrounding context
async function getContextWindow(redis: Redis, userId: string, radius = 2) {
  const rank = await redis.zrevrank('leaderboard', userId);
  if (rank === null) return [];
  const start = Math.max(0, rank - radius);
  const stop = rank + radius;
  return redis.zrevrange('leaderboard', start, stop, 'WITHSCORES');
}`}
      />
    </article>
  )
}
