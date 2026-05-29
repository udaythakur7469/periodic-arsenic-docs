import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'

export const metadata: Metadata = { title: 'redis_sdiffstore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sdiffstore"
        severity="warning"
        summary="Set difference with write — SDIFF cost plus a write of the stored result"
        detail="SDIFFSTORE computes the difference between sets and writes the result to a destination key. Like SUNIONSTORE and SINTERSTORE, its cost is the same as the corresponding non-store operation (O(N) across all input sets) plus a write. The correct pattern is to run this in a background worker and read the stored key on hot paths."
        causes={[
          '"Unseen items" or similar diff results recomputed per request',
          'Inline SDIFFSTORE in request handlers where a background refresh would suffice',
          'Cache invalidation patterns that store-then-read on every API call',
        ]}
        fixes={[
          'Pre-compute the diff in a background worker and cache the result key with a TTL',
          'Maintain the diff state incrementally at write time (SREM on seen, SADD on new items)',
          'Use the destination key directly on hot paths — never recompute inline',
          'Pair with SCARD to count without fetching all members when only the count is needed',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — diffstore called inline on every recommendation request
app.get('/api/recommendations', async (req, res) => {
  const dest = \`unseen:\${req.user.id}\`;
  await redis.sdiffstore(dest, \`recommendations:\${req.user.id}\`, \`seen:\${req.user.id}\`);
  const unseen = await redis.srandmember(dest, 10);
  res.json(unseen);
});

// GOOD — maintain incrementally at write time
async function markSeen(redis: Redis, userId: string, itemId: string) {
  await redis.srem(\`recommendations:\${userId}\`, itemId);
  await redis.sadd(\`seen:\${userId}\`, itemId);
  // recommendations set is now always the live diff — no SDIFF needed
}

// Read directly — O(1) to count, O(log N) to sample
const count = await redis.scard(\`recommendations:\${userId}\`);
const sample = await redis.srandmember(\`recommendations:\${userId}\`, 10);

// GOOD — background pre-compute when write-time tracking is not feasible
async function refreshUnseenCache(redis: Redis, userId: string) {
  const dest = \`unseen:cache:\${userId}\`;
  await redis.sdiffstore(dest, \`recommendations:\${userId}\`, \`seen:\${userId}\`);
  await redis.expire(dest, 180);
}

// Schedule refresh every 2 minutes per active user
// Hot path reads from the cached key, never calls SDIFFSTORE`}
      />
    </article>
  )
}
