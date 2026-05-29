import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "redis_blmove signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="redis_blmove"
        severity="critical"
        summary="Blocking atomic move between lists — connection held until source has data or timeout fires"
        detail="BLMOVE atomically pops an element from one list and pushes it to another, blocking if the source list is empty. It is the modern replacement for BRPOPLPUSH and supports explicit LEFT|RIGHT direction arguments for both ends of the operation. The blocking behaviour is the same: without a timeout, connections are held open indefinitely."
        causes={[
          "Reliable queue consumers without a timeout configured",
          "Blocking consumers sharing a connection pool with the main application",
          "Worker processes that do not isolate blocking connections",
          "Long idle periods where queues are empty but workers hold connections open",
        ]}
        fixes={[
          "Always specify a finite timeout — prefer 2–10 seconds and loop at the application level",
          "Use a dedicated Redis connection for BLMOVE consumers, separate from the main pool",
          "Set maxRetriesPerRequest: null on the consumer connection for ioredis",
          "Use BullMQ for production queue patterns — it manages all of this correctly",
        ]}
      />

      <Callout type="info" title="BLMOVE replaced BRPOPLPUSH in Redis 6.2">
        If you are migrating from BRPOPLPUSH, use{" "}
        <code>BLMOVE source dest RIGHT LEFT timeout</code> as the direct
        equivalent. BLMOVE is more explicit and supports all four direction
        combinations.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// Signature: BLMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout
// Pop from RIGHT of source, push to LEFT of destination (equivalent to old BRPOPLPUSH)

// BAD — no timeout, connection held indefinitely when queue is empty
const raw = await redis.blmove('jobs:pending', 'jobs:processing', 'RIGHT', 'LEFT', 0);

// GOOD — finite timeout, dedicated connection, application-level loop
const workerRedis = new Redis({
  host: process.env.REDIS_HOST,
  maxRetriesPerRequest: null, // required for blocking commands in ioredis
});

async function reliableWorker() {
  while (true) {
    const raw = await workerRedis.blmove(
      'jobs:pending',
      'jobs:processing',
      'RIGHT',
      'LEFT',
      5 // seconds — application loops after timeout
    );

    if (!raw) continue; // timeout, no jobs yet

    const job = JSON.parse(raw);
    try {
      await processJob(job);
      await workerRedis.lrem('jobs:processing', 1, raw);
    } catch (err) {
      await workerRedis.lrem('jobs:processing', 1, raw);
      await workerRedis.lpush('jobs:dead', raw);
    }
  }
}

// Direction combinations:
// RIGHT + LEFT  — standard FIFO queue (source tail → dest head)
// LEFT  + RIGHT — reverse
// LEFT  + LEFT  — both left-side
// RIGHT + RIGHT — both right-side`}
      />
    </article>
  );
}
