import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_zscan signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_zscan"
        severity="warning"
        summary="Cursor-based sorted set scan is O(N) across all members when iterated to completion"
        detail="ZSCAN iterates over members and scores of a sorted set incrementally using a cursor. Individual calls are non-blocking and return a small batch — this makes it safer than fetching the entire set with ZRANGE 0 -1. However, iterating ZSCAN to completion still performs O(N) total work across all batches. On large sorted sets — such as global leaderboards or time-series indexes — completing a ZSCAN on a hot request path transfers and serialises every member-score pair, generating significant overhead."
        causes={[
          'Iterating ZSCAN to completion to find members matching a pattern in a large sorted set',
          'Using ZSCAN to read the entire sorted set instead of ZRANGE with explicit bounds',
          'Score-based filtering done in application code by scanning all members rather than using ZRANGEBYSCORE',
          'Sorted set size growing unboundedly — ZSCAN cost grows linearly with the set',
        ]}
        fixes={[
          'Use ZRANGE with rank bounds or ZRANGEBYSCORE with score bounds for bounded range queries — no scanning needed',
          'Use ZSCORE for point score lookups and ZRANK/ZREVRANK for rank lookups — both O(log N)',
          'Move full ZSCAN iterations to background jobs or infrequent reporting tasks',
          'Use COUNT hints to reduce round trips when ZSCAN is necessary — COUNT 100–500 is reasonable',
        ]}
      />

      <Callout type="info" title="ZSCAN vs ZRANGE — pick the right tool">
        If you know the score range or rank window you need, ZRANGE or ZRANGEBYSCORE is
        always faster than ZSCAN because it targets exactly the elements you want.
        ZSCAN is most useful when you need to process all members without knowing bounds
        in advance — and even then, it belongs in a background job.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// ACCEPTABLE — background cleanup of zero-score members
async function pruneZeroScoreMembers(redis: Redis, key: string) {
  let cursor = '0';
  const toRemove: string[] = [];
  do {
    const [next, entries] = await redis.zscan(key, cursor, 'COUNT', 200);
    cursor = next;
    // entries: [member, score, member, score, ...]
    for (let i = 0; i < entries.length; i += 2) {
      if (parseFloat(entries[i + 1]) === 0) toRemove.push(entries[i]);
    }
  } while (cursor !== '0');
  if (toRemove.length > 0) await redis.zrem(key, ...toRemove);
}

// BAD — scanning all members to find those in a score range
app.get('/api/leaderboard', async (req, res) => {
  const results: Array<{ member: string; score: number }> = [];
  let cursor = '0';
  do {
    const [next, entries] = await redis.zscan('leaderboard:global', cursor);
    cursor = next;
    for (let i = 0; i < entries.length; i += 2) {
      const score = parseFloat(entries[i + 1]);
      if (score > 1000) results.push({ member: entries[i], score });
    }
  } while (cursor !== '0');
  res.json(results);
});

// GOOD — ZRANGEBYSCORE targets only the score range you need
app.get('/api/leaderboard', async (req, res) => {
  const entries = await redis.zrangebyscore(
    'leaderboard:global',
    1001, '+inf',
    'WITHSCORES',
    'LIMIT', 0, 100
  );
  res.json(entries);
});

// GOOD — ZREVRANK / ZSCORE for point lookups — O(log N)
const rank = await redis.zrevrank('leaderboard:global', userId);
const score = await redis.zscore('leaderboard:global', userId);`}
      />
    </article>
  )
}
