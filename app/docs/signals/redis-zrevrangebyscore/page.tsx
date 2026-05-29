import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zrevrangebyscore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zrevrangebyscore"
        severity="warning"
        summary="Sorted set reverse score range — same cost as ZRANGEBYSCORE, descending order"
        detail="ZREVRANGEBYSCORE returns members with scores between max and min in descending order. It is O(log N + M) — identical complexity to ZRANGEBYSCORE in ascending order. The same risks apply: without a LIMIT clause, a wide score range returns an unbounded number of elements. As of Redis 6.2 this command is deprecated in favour of ZRANGE with BYSCORE and REV."
        causes={[
          'Reverse-chronological feeds using timestamps as scores without LIMIT',
          'Most-recent event queries with an unbounded time window',
          'Descending score leaderboards fetched without pagination',
          'Priority queue inspections that retrieve all pending items',
        ]}
        fixes={[
          'Always include LIMIT offset count to bound the result',
          'Narrow the score range — prefer a recent time window over +inf to -inf',
          'Use ZCOUNT for counts without fetching elements',
          'Migrate to ZRANGE with BYSCORE REV for Redis 6.2+ codebases',
        ]}
      />

      <Callout type="info" title="Deprecated in Redis 6.2">
        Use <code>ZRANGE key max min BYSCORE REV LIMIT offset count</code> for new code.
        Note that BYSCORE REV reverses the argument order — max comes before min.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — all events from now to the beginning of time, no limit
const allEvents = await redis.zrevrangebyscore('events', Date.now(), '-inf');

// GOOD — last 24 hours, bounded result
const dayAgo = Date.now() - 86400_000;
const recentEvents = await redis.zrevrangebyscore(
  'events',
  Date.now(),
  dayAgo,
  'LIMIT', 0, 100 // offset, count
);

// GOOD — Redis 6.2+ equivalent (note: max before min with BYSCORE REV)
const recentModern = await redis.zrange(
  'events',
  Date.now(), dayAgo,
  'BYSCORE', 'REV',
  'LIMIT', 0, 100
);

// GOOD — paginated reverse-chronological feed
async function getFeedPage(redis: Redis, userId: string, page: number, pageSize = 20) {
  const cutoff = Date.now();
  return redis.zrevrangebyscore(
    \`feed:\${userId}\`,
    cutoff,
    '-inf',
    'LIMIT', page * pageSize, pageSize
  );
}

// GOOD — count without fetching
const eventCount = await redis.zcount('events', dayAgo, Date.now());`}
      />
    </article>
  )
}
