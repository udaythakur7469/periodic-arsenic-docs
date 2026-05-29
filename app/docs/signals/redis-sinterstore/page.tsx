import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'

export const metadata: Metadata = { title: 'redis_sinterstore signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sinterstore"
        severity="warning"
        summary="Set intersection with write — same cost as SINTER plus a write of the result"
        detail="SINTERSTORE computes the intersection of multiple sets and stores the result in a destination key. It carries the same computational cost as SINTER (O(N*M)) plus the overhead of writing the result. When used correctly, this is a powerful caching primitive. When called on a request path rather than in a background worker, it adds the full intersection cost to every request plus write amplification."
        causes={[
          'Per-request mutual connection lookups that store and immediately read the result',
          'Inline SINTERSTORE in API handlers that could pre-compute the value',
          'Cache refresh logic triggered on every read rather than on TTL expiry',
        ]}
        fixes={[
          'Run SINTERSTORE in a background job and set a TTL on the destination key',
          'Use the stored key as the read target — never recompute synchronously on hot paths',
          'Invalidate and recompute the stored key when the source sets change significantly',
          'Consider write-time materialisation if intersection membership changes frequently',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — intersection computed and stored on every request
app.get('/api/users/:id/mutual', async (req, res) => {
  const dest = \`mutual:\${req.user.id}:\${req.params.id}\`;
  await redis.sinterstore(dest, \`friends:\${req.user.id}\`, \`friends:\${req.params.id}\`);
  const mutual = await redis.smembers(dest);
  res.json({ count: mutual.length });
});

// GOOD — pre-compute on friend graph changes, read cached key on requests
async function updateMutualCache(redis: Redis, userA: string, userB: string) {
  const sortedKey = [userA, userB].sort().join(':');
  const dest = \`mutual:\${sortedKey}\`;
  await redis.sinterstore(dest, \`friends:\${userA}\`, \`friends:\${userB}\`);
  await redis.expire(dest, 600); // 10 minute cache
}

// Trigger on friend add/remove
async function addFriend(redis: Redis, userId: string, friendId: string) {
  await redis.sadd(\`friends:\${userId}\`, friendId);
  await redis.sadd(\`friends:\${friendId}\`, userId);
  // Invalidate related mutual caches in background
  queueJob('refresh-mutual-cache', { userId, friendId });
}

// Read is now O(1) — smembers on a small pre-computed set
app.get('/api/users/:id/mutual', async (req, res) => {
  const sortedKey = [req.user.id, req.params.id].sort().join(':');
  const mutual = await redis.smembers(\`mutual:\${sortedKey}\`);
  res.json({ count: mutual.length });
});`}
      />
    </article>
  )
}
