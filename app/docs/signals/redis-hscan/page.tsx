import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_hscan signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_hscan"
        severity="warning"
        summary="Cursor-based hash scan is O(N) across all fields when iterated to completion"
        detail="HSCAN iterates over the fields and values of a hash incrementally using a cursor. Each call returns a small batch and is non-blocking — this makes it the correct alternative to HGETALL on large hashes. However, iterating HSCAN to completion still visits every field across all batches, incurring O(N) total work. On large hashes with hundreds of fields, completing an HSCAN on a hot path adds serialisation overhead proportional to the full hash size."
        causes={[
          'Iterating HSCAN to completion to read all fields of a large hash on every request',
          'Using HSCAN to find a specific field instead of HGET — scanning when a direct lookup suffices',
          'Audit or validation logic that reads every hash field synchronously in request handlers',
          'Hash size growing unboundedly as new fields are appended over time without pruning',
        ]}
        fixes={[
          'Use HGET or HMGET with explicit field names — O(1) and O(N fields) respectively, no scanning',
          'For large hashes, move HSCAN iterations to background jobs or infrequent admin tasks',
          'Use COUNT hints to reduce round trips — COUNT 100–300 is reasonable for large hashes',
          'Consider restructuring: if you access most fields most of the time, HGETALL may be more efficient than partial HSCAN iteration',
        ]}
      />

      <Callout type="info" title="HSCAN is the right alternative to HGETALL on large hashes">
        HSCAN is correct to use — it is the incremental, safe replacement for HGETALL.
        The signal here is specifically about iterating to completion on request paths.
        In background workers, HSCAN is the preferred approach for processing large hashes.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// ACCEPTABLE — background analytics job
async function exportUserMetadata(redis: Redis, userId: string) {
  let cursor = '0';
  const fields: Record<string, string> = {};
  do {
    const [next, entries] = await redis.hscan(
      \`user-meta:\${userId}\`,
      cursor,
      'COUNT', 100
    );
    cursor = next;
    // entries is [field, value, field, value, ...]
    for (let i = 0; i < entries.length; i += 2) {
      fields[entries[i]] = entries[i + 1];
    }
  } while (cursor !== '0');
  return fields;
}

// BAD — scanning all hash fields to read one on every request
app.get('/api/user-name', async (req, res) => {
  let cursor = '0';
  let name: string | null = null;
  do {
    const [next, entries] = await redis.hscan(\`user:\${req.user.id}\`, cursor);
    cursor = next;
    const idx = entries.indexOf('name');
    if (idx !== -1) { name = entries[idx + 1]; break; }
  } while (cursor !== '0');
  res.json({ name });
});

// GOOD — use HGET for direct field access — O(1)
app.get('/api/user-name', async (req, res) => {
  const name = await redis.hget(\`user:\${req.user.id}\`, 'name');
  res.json({ name });
});

// GOOD — use HMGET when you need several specific fields
const [name, email, role] = await redis.hmget(
  \`user:\${userId}\`,
  'name', 'email', 'role'
);`}
      />
    </article>
  )
}
