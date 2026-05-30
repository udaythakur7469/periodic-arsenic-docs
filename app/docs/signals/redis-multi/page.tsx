import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_multi signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_multi"
        severity="info"
        summary="Transaction block opened — MULTI queues commands until EXEC or DISCARD"
        detail="MULTI opens a Redis transaction block. All commands issued after MULTI are queued on the server rather than executed immediately, and run atomically when EXEC is called. MULTI itself is O(1) with negligible overhead. However, Arsenic tracks it so you can observe transaction boundaries in your event stream and detect patterns such as very long transaction blocks, transactions that never reach EXEC, or high-frequency MULTI/EXEC cycles on a single connection."
        causes={[
          'A MULTI block that queues a large number of commands, deferring significant work to EXEC',
          'MULTI called without a corresponding EXEC — for example, on connection error paths that call DISCARD',
          'High-frequency MULTI/EXEC patterns on the hot path when a pipeline would suffice',
          'WATCH + MULTI retry loops causing repeated transaction restarts under contention',
        ]}
        fixes={[
          'Use pipelines (redis.pipeline()) for batching reads and writes without atomicity requirements — lower overhead than MULTI/EXEC',
          'Keep transaction blocks short: queue only the commands that genuinely require atomic execution',
          'Always pair MULTI with error handling that calls DISCARD if the connection is dropped before EXEC',
          'For WATCH-based optimistic locking, implement bounded retry limits to prevent infinite restart loops',
        ]}
      />

      <Callout type="info" title="MULTI does not provide rollback">
        Redis transactions are not like SQL transactions. If a queued command fails at
        execution time (wrong type, wrong arity), the other commands in the block still
        execute. MULTI/EXEC provides atomicity and isolation, not rollback. DISCARD
        discards the queue before EXEC — it cannot undo commands already executed.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`import Redis from 'ioredis';

const redis = new Redis();

// GOOD — MULTI/EXEC for atomic counter increment + expiry set
async function recordVisit(redis: Redis, pageId: string): Promise<void> {
  const pipeline = redis.multi();
  pipeline.incr(\`views:\${pageId}\`);
  pipeline.expire(\`views:\${pageId}\`, 86400); // reset TTL on each visit
  await pipeline.exec();
}

// GOOD — WATCH + MULTI for optimistic locking (bounded retries)
async function transferCredits(
  redis: Redis,
  fromUser: string,
  toUser: string,
  amount: number,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await redis.watch(\`credits:\${fromUser}\`);
    const balance = parseInt(await redis.get(\`credits:\${fromUser}\`) ?? '0', 10);
    if (balance < amount) {
      await redis.unwatch();
      return false; // insufficient funds
    }
    const result = await redis
      .multi()
      .decrby(\`credits:\${fromUser}\`, amount)
      .incrby(\`credits:\${toUser}\`, amount)
      .exec();
    if (result !== null) return true; // committed
    // result is null — a WATCH-ed key was modified; retry
  }
  return false; // max retries exceeded
}

// PATTERN TO AVOID — MULTI for non-atomic batching (use pipeline instead)
// BAD: unnecessary overhead from transaction semantics
const tx = redis.multi();
tx.get('key1');
tx.get('key2');
tx.get('key3');
const results = await tx.exec();

// GOOD: pipeline for reads/writes that don't need atomicity
const pipeline = redis.pipeline();
pipeline.get('key1');
pipeline.get('key2');
pipeline.get('key3');
const results2 = await pipeline.exec();`}
      />

      <Callout type="tip" title="MULTI vs pipeline — know the difference">
        Both batch commands and reduce round trips, but they behave differently.
        A pipeline sends commands in bulk without blocking other clients between them.
        MULTI/EXEC guarantees that no other client can interleave commands between
        MULTI and EXEC — use it only when you actually need that isolation.
      </Callout>
    </article>
  )
}
