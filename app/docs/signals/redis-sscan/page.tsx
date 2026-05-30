import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_sscan signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_sscan"
        severity="warning"
        summary="Cursor-based set scan is O(N) across all members when iterated to completion"
        detail="SSCAN iterates over the members of a set incrementally using a cursor. Individual calls return a small batch and are non-blocking — this is intentional, and far safer than SMEMBERS on large sets. However, iterating SSCAN to completion still performs O(N) total work, visiting every member across all batches. Calling SSCAN to completion on a hot request path contributes measurable cumulative latency and serialisation overhead, especially when the set grows over time."
        causes={[
          'Iterating SSCAN to completion on every request to check membership across a full set',
          'Cache invalidation that scans entire sets per request rather than tracking membership directly',
          'Application code that uses SSCAN to build a local copy of the set instead of querying specific members',
          'Background jobs that scan without COUNT hints, generating excessive round trips',
        ]}
        fixes={[
          'Move full SSCAN iterations to background jobs or low-frequency scheduled tasks',
          'Use SISMEMBER for single-member lookups — O(1) and avoids scanning entirely',
          'Use COUNT hints to reduce round trips — COUNT 200–500 is reasonable for bulk operations',
          'Maintain a Redis counter or secondary index to avoid scanning for aggregate information',
        ]}
      />

      <Callout type="info" title="SSCAN is the right alternative to SMEMBERS on large sets">
        SSCAN is correct to use — it is the safe, incremental replacement for SMEMBERS.
        The signal here is about iterating it to completion on hot paths. In background
        workers or infrequent admin tasks, completing an SSCAN iteration is fine.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// ACCEPTABLE — background worker, runs infrequently
async function auditExpiredTokens(redis: Redis, userId: string) {
  let cursor = '0';
  const expired: string[] = [];
  do {
    const [next, members] = await redis.sscan(
      \`tokens:\${userId}\`,
      cursor,
      'COUNT', 200
    );
    cursor = next;
    for (const token of members) {
      if (isExpired(token)) expired.push(token);
    }
  } while (cursor !== '0');
  if (expired.length > 0) await redis.srem(\`tokens:\${userId}\`, ...expired);
}

// BAD — scanning the full set on every API request
app.get('/api/check-access', async (req, res) => {
  const allowed: string[] = [];
  let cursor = '0';
  do {
    const [next, members] = await redis.sscan('allowed-users', cursor);
    cursor = next;
    allowed.push(...members);
  } while (cursor !== '0'); // full scan on every request
  res.json({ access: allowed.includes(req.user.id) });
});

// GOOD — use SISMEMBER for membership checks — O(1)
app.get('/api/check-access', async (req, res) => {
  const access = await redis.sismember('allowed-users', req.user.id);
  res.json({ access: access === 1 });
});`}
      />
    </article>
  )
}
