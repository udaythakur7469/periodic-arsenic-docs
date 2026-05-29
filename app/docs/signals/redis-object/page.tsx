import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_object signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_object"
        severity="warning"
        summary="Inspects internal Redis metadata — adds overhead when called in hot paths"
        detail="The OBJECT command inspects internal representation details of a Redis key: encoding type (ENCODING), reference count (REFCOUNT), idle time since last access (IDLETIME), and access frequency for LFU eviction (FREQ). These subcommands are diagnostic tools — they have measurable overhead compared to data commands and serve no purpose in application hot paths."
        causes={[
          'Debugging code left in production that checks key encoding or refcount',
          'Memory optimisation checks added to hot paths during a performance audit',
          'Monitoring code that calls OBJECT IDLETIME on every request to detect stale keys',
          'Application code that inspects ENCODING to decide serialisation format at runtime',
        ]}
        fixes={[
          'Move OBJECT calls to offline scripts, monitoring sidecars, or admin-only endpoints',
          'Use DEBUG SLEEP or INFO for server-wide diagnostics rather than per-key OBJECT calls',
          'Design serialisation format decisions at deploy time, not at runtime per request',
          'Use Redis keyspace notifications for idle key detection instead of polling IDLETIME',
        ]}
      />

      <Callout type="info" title="Diagnostic tool, not a data command">
        OBJECT is useful for understanding Redis internals, memory optimisation, and debugging.
        It should never appear in application request paths — only in offline diagnostics,
        monitoring jobs, or admin scripts.
      </Callout>

      <h2>Correct usage</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — calling OBJECT in a request handler
app.get('/api/items/:id', async (req, res) => {
  const encoding = await redis.object('ENCODING', \`item:\${req.params.id}\`);
  const value = encoding === 'embstr'
    ? await redis.get(\`item:\${req.params.id}\`)
    : await redis.get(\`item:\${req.params.id}\`); // same either way
  res.json(value);
});

// GOOD — diagnostic script, run offline
async function auditKeyEncodings(redis: Redis, pattern: string) {
  const encodingCounts: Record<string, number> = {};
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = next;
    for (const key of keys) {
      const enc = await redis.object('ENCODING', key);
      encodingCounts[enc as string] = (encodingCounts[enc as string] ?? 0) + 1;
    }
  } while (cursor !== '0');
  return encodingCounts;
}

// GOOD — OBJECT IDLETIME in a background eviction helper
async function evictIdleKeys(redis: Redis, pattern: string, idleSeconds: number) {
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 50);
    cursor = next;
    for (const key of keys) {
      const idle = await redis.object('IDLETIME', key);
      if ((idle as number) > idleSeconds) {
        await redis.unlink(key);
      }
    }
  } while (cursor !== '0');
}`}
      />
    </article>
  )
}
