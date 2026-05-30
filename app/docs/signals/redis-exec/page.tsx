import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_exec signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_exec"
        severity="info"
        summary="Transaction executed — EXEC duration reflects the cumulative cost of every queued command"
        detail="EXEC atomically executes all commands queued since the preceding MULTI. The total duration reported by Arsenic for an EXEC event covers the full round trip from EXEC being sent to all results being received. Because EXEC inherits the cost of every queued command, a consistently slow EXEC is a signal that the transaction contains expensive operations — not that EXEC itself is slow. EXEC also returns null if a WATCH-monitored key was modified since WATCH was called, which must be handled explicitly."
        causes={[
          'Transaction queuing slow commands (HGETALL, SMEMBERS, ZRANGE 0 -1) that execute atomically under EXEC',
          'Large numbers of commands queued in a single MULTI block, making each EXEC a bulk operation',
          'High-frequency EXEC calls on the hot path when the atomicity guarantee is not actually needed',
          'WATCH contention causing repeated EXEC null returns and retry loops',
        ]}
        fixes={[
          'Audit what commands are queued in the MULTI block — slow EXEC usually means slow queued commands',
          'Keep transaction scope minimal: only queue commands that genuinely require atomic execution together',
          'Always check the EXEC return value for null — a null result means WATCH detected a conflict and nothing was executed',
          'If EXEC is consistently slow and atomicity is not required, switch to a pipeline for lower overhead',
        ]}
      />

      <Callout type="danger" title="Always handle the null return from EXEC">
        When using WATCH, EXEC returns null if any watched key was modified between WATCH
        and EXEC. This means none of the queued commands ran. Failing to check for null
        silently discards writes — a common source of data loss bugs in optimistic
        locking implementations.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`import Redis from 'ioredis';

const redis = new Redis();

// CORRECT — always check EXEC result when using WATCH
async function atomicDecrement(
  redis: Redis,
  key: string,
  amount: number
): Promise<boolean> {
  await redis.watch(key);
  const current = parseInt(await redis.get(key) ?? '0', 10);

  if (current < amount) {
    await redis.unwatch();
    return false;
  }

  const result = await redis
    .multi()
    .decrby(key, amount)
    .exec();

  // result is null if a concurrent write modified \`key\` after WATCH
  return result !== null;
}

// PATTERN — measuring EXEC cost tells you what's expensive inside the block
// Arsenic reports the total EXEC duration. If it's high, inspect the queued commands:
const pipeline = redis.multi();
pipeline.hgetall('user:123');       // O(N) — this is likely the culprit
pipeline.incr('user:123:requests');
pipeline.expire('user:123:requests', 3600);
const result = await pipeline.exec(); // EXEC duration = hgetall cost + incr + expire

// BETTER — hgetall outside the transaction if atomicity with the incr isn't needed
const userData = await redis.hgetall('user:123'); // run separately
const tx = redis.multi();
tx.incr('user:123:requests');
tx.expire('user:123:requests', 3600);
await tx.exec(); // now EXEC only covers the two cheap commands

// DISCARD — cancels the queued commands without executing them
const tx2 = redis.multi();
tx2.set('key1', 'value1');
tx2.set('key2', 'value2');
// something went wrong — abandon the transaction
await tx2.discard(); // queued commands are dropped`}
      />

      <Callout type="tip" title="EXEC duration is a window into your transaction">
        If Arsenic flags a slow EXEC, the fix is almost never to avoid EXEC — it is to
        simplify what the transaction does. Identify expensive queued commands and either
        run them outside the transaction or replace them with more targeted alternatives.
      </Callout>
    </article>
  )
}
