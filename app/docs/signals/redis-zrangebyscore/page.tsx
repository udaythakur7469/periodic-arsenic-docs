import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zrangebyscore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zrangebyscore"
        severity="warning"
        summary="Sorted set range by score — linear in the number of elements in the score range"
        detail="ZRANGEBYSCORE returns elements with scores between min and max. It is O(log N + M) where M is the number of elements in the range. Without LIMIT, a wide score range (e.g. -inf to +inf or a timestamp range spanning months) can return an unbounded number of elements. As of Redis 6.2, ZRANGEBYSCORE is superseded by ZRANGE with BYSCORE — both carry the same complexity."
        causes={[
          'Time-series queries with unbounded score ranges (e.g. all events in the last year)',
          'Score-based filtering without a LIMIT clause',
          'Using -inf to +inf to retrieve all members with scores',
          'Job queue expiry scans that span a large timestamp window',
        ]}
        fixes={[
          'Always include LIMIT offset count to bound the result size',
          'Narrow the score range to the minimum window needed',
          'Use ZCOUNT to get a count without fetching members',
          'Migrate to ZRANGE with BYSCORE for Redis 6.2+ codebases',
        ]}
      />

      <Callout type="info" title="Deprecated in Redis 6.2">
        ZRANGEBYSCORE is superseded by <code>ZRANGE key min max BYSCORE [LIMIT offset count]</code>.
        The new form is more consistent — consider migrating for new code.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — no LIMIT, could return thousands of events
const events = await redis.zrangebyscore('events:stream', '-inf', '+inf');

// BAD — a year's worth of events without a page limit
const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
const yearEvents = await redis.zrangebyscore('events:stream', oneYearAgo, Date.now());

// GOOD — bounded window with LIMIT
const recentEvents = await redis.zrangebyscore(
  'events:stream',
  Date.now() - 3600_000, // last hour
  Date.now(),
  'LIMIT', 0, 50 // offset, count
);

// GOOD — count without fetching
const eventCount = await redis.zcount('events:stream', oneYearAgo, Date.now());

// GOOD — Redis 6.2+ equivalent
const recent = await redis.zrange(
  'events:stream',
  Date.now() - 3600_000,
  Date.now(),
  'BYSCORE',
  'LIMIT', 0, 50
);

// GOOD — paginated job queue expiry
async function getExpiredJobs(redis: Redis, page = 0, pageSize = 100) {
  const now = Date.now();
  return redis.zrangebyscore('jobs:scheduled', '-inf', now, 'LIMIT', page * pageSize, pageSize);
}`}
      />
    </article>
  )
}
