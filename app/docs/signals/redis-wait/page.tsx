import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_wait signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_wait"
        severity="warning"
        summary="Blocks until replicas acknowledge writes — latency determined by replication lag"
        detail="WAIT blocks the client until a specified number of replicas acknowledge pending write operations, or the timeout expires. It provides a stronger durability guarantee than fire-and-forget writes by confirming replication before returning. The latency cost is the round-trip time from master to replica plus network jitter — typically 1–10ms on a healthy cluster but unbounded if replication lag is high."
        causes={[
          'Strong consistency requirements where data loss is unacceptable on failover',
          'Financial, audit, or compliance data written to Redis before the primary database',
          'Leader-election patterns that require confirmed propagation before proceeding',
          'Multi-region deployments with high replication lag calling WAIT synchronously',
        ]}
        fixes={[
          'Set a finite timeout — never call WAIT with timeout 0 on a hot path',
          'Check the return value: WAIT returns the actual number of replicas that acknowledged; handle partial acknowledgement',
          'Move WAIT to background confirmation jobs for non-latency-critical durability checks',
          'For critical data, use your primary database (PostgreSQL etc.) for durability instead of Redis',
        ]}
      />

      <Callout type="warning" title="WAIT adds replication latency to your request">
        WAIT latency is determined by your replication setup, not your Redis instance.
        High replication lag — caused by network issues, a slow replica, or heavy write traffic
        — directly adds to request latency. Always set a timeout and handle the case where
        fewer replicas acknowledged than requested.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — infinite wait, replication lag becomes request latency
await redis.set('account:123:balance', newBalance);
await redis.wait(1, 0); // blocks until 1 replica acks, no timeout

// GOOD — bounded timeout with acknowledgement check
async function writeWithReplicationCheck(
  redis: Redis,
  key: string,
  value: string,
  requiredReplicas = 1
) {
  await redis.set(key, value);
  const ackedReplicas = await redis.wait(requiredReplicas, 100); // 100ms timeout

  if (ackedReplicas < requiredReplicas) {
    // Log the partial acknowledgement but do not fail the request
    logger.warn('redis.replication.partial', {
      key,
      required: requiredReplicas,
      acked: ackedReplicas,
    });
  }
}

// GOOD — durability-critical writes backed by primary DB
// For financial data, write to PostgreSQL first (durable), then Redis (cache)
await db.transaction(async (tx) => {
  await tx.accounts.update({ where: { id }, data: { balance: newBalance } });
});
await redis.set('account:123:balance', newBalance, 'EX', 300); // cache, not source of truth
// No WAIT needed — PostgreSQL is the durable store

// GOOD — background replication confirmation for audit
async function backgroundReplicationAudit(redis: Redis) {
  const ackedCount = await redis.wait(2, 5000); // 2 replicas, 5 second window
  if (ackedCount < 2) {
    alertOps('Redis replication behind', { ackedCount });
  }
}`}
      />
    </article>
  )
}
