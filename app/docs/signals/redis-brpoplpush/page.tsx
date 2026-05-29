import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_brpoplpush signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_brpoplpush"
        severity="critical"
        summary="Blocking atomic pop-and-push between lists — deprecated in Redis 6.2"
        detail="BRPOPLPUSH atomically removes the last element from a source list and pushes it to a destination list, blocking if the source is empty. It was commonly used for reliable queue patterns (the 'processing' list pattern). As of Redis 6.2, it is deprecated in favour of BLMOVE, which is more flexible and explicit about direction."
        causes={[
          'Reliable queue implementations written before Redis 6.2',
          'Legacy worker code not updated after the Redis 6.2 deprecation',
          'Copy-pasted queue patterns from older tutorials and blog posts',
          'Dependencies that internally use BRPOPLPUSH',
        ]}
        fixes={[
          'Migrate to BLMOVE, which provides the same semantics with explicit direction arguments',
          'Always pass a finite timeout — never use 0 in production',
          'Use BullMQ or a dedicated queue library that handles these patterns correctly',
          'Audit dependencies for internal BRPOPLPUSH usage if upgrading Redis server',
        ]}
      />

      <Callout type="warning" title="Deprecated since Redis 6.2">
        BRPOPLPUSH is still functional but no longer receives updates. New features and
        optimisations target BLMOVE. Migrate now to avoid compatibility issues on future
        Redis server versions.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — deprecated command
const job = await redis.brpoplpush('queue:pending', 'queue:processing', 0);

// GOOD — migrate to BLMOVE (Redis 6.2+)
// BLMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout
const job = await redis.blmove('queue:pending', 'queue:processing', 'RIGHT', 'LEFT', 5);

// The reliable queue pattern with BLMOVE
async function reliableWorker(redis: Redis) {
  const PROCESSING_LIST = 'queue:processing';
  const PENDING_LIST = 'queue:pending';

  // On startup, recover any jobs left in processing from a previous crash
  let stuck: string | null;
  while ((stuck = await redis.rpoplpush(PROCESSING_LIST, PENDING_LIST)));

  while (true) {
    // Move from pending → processing atomically
    const raw = await redis.blmove(PENDING_LIST, PROCESSING_LIST, 'RIGHT', 'LEFT', 5);
    if (!raw) continue;

    const job = JSON.parse(raw);
    try {
      await processJob(job);
      await redis.lrem(PROCESSING_LIST, 1, raw); // remove on success
    } catch (err) {
      await redis.lrem(PROCESSING_LIST, 1, raw);
      await redis.lpush('queue:failed', raw); // move to DLQ
    }
  }
}`}
      />
    </article>
  )
}
