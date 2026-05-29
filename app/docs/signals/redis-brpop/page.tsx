import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "redis_brpop signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="redis_brpop"
        severity="critical"
        summary="Blocking right-pop — holds the connection open until data is available or timeout expires"
        detail="BRPOP is the right-side variant of BLPOP. It removes and returns the last element from one or more lists, blocking if the list is empty. The blocking behaviour is identical to BLPOP — connections are held open until data arrives or the timeout fires. The choice between BLPOP and BRPOP is about queue ordering (FIFO vs LIFO), not performance; both carry the same connection-exhaustion risk."
        causes={[
          "LIFO task queues without a timeout configured",
          "Shared connection pool used for blocking consumers",
          "Consumers that block indefinitely during low-traffic periods",
          "Stack-based processing patterns without connection isolation",
        ]}
        fixes={[
          "Always specify a finite timeout in the BRPOP call",
          "Use a dedicated Redis connection for each blocking consumer",
          "Prefer BullMQ or similar for production task queues",
          "Consider RPOP with a polling loop if connection isolation is not feasible",
        ]}
      />

      <Callout type="warning" title="Same risk profile as BLPOP">
        BRPOP has identical connection-blocking behaviour to BLPOP. All the same
        rules apply: always use a timeout, always use a dedicated connection
        pool for workers.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — blocks indefinitely, holds a pooled connection
const result = await redis.brpop('priority:queue', 0);

// GOOD — bounded timeout on a dedicated connection
const consumerRedis = new Redis({
  host: process.env.REDIS_HOST,
  maxRetriesPerRequest: null,
});

async function priorityWorker() {
  while (true) {
    // BRPOP processes newest-first (LIFO) — useful for priority stacks
    const result = await consumerRedis.brpop('priority:queue', 5);
    if (!result) continue;

    const [_list, raw] = result;
    const job = JSON.parse(raw);
    await processJob(job);
  }
}

// LIFO vs FIFO — when to use which
// BLPOP (left pop) — FIFO, tasks processed in arrival order
// BRPOP (right pop) — LIFO, most recent task processed first
// LPUSH + BLPOP = classic FIFO queue
// LPUSH + BRPOP = stack (newest first)`}
      />

      <h2>Graceful shutdown</h2>
      <CodeBlock
        language="typescript"
        code={`let running = true;

async function workerLoop(redis: Redis) {
  while (running) {
    const result = await redis.brpop('jobs', 2); // short timeout enables clean exit
    if (!result) continue;
    await processJob(JSON.parse(result[1]));
  }
  await redis.quit();
}

process.on('SIGTERM', () => { running = false; });`}
      />
    </article>
  );
}
