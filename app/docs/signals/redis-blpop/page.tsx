import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "redis_blpop signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="redis_blpop"
        severity="critical"
        summary="Blocking left-pop — holds the connection open until data is available or timeout expires"
        detail="BLPOP removes and returns the first element from one or more lists. If the list is empty it blocks the calling client until an element is pushed or the timeout expires. Blocking commands hold a connection open for their entire duration. Without a timeout this is indefinite — exhausting your connection pool when queues are idle."
        causes={[
          "Task queue workers without a timeout configured",
          "Long-poll patterns using Redis lists without connection pool isolation",
          "Shared connection pool used for both blocking and non-blocking operations",
          "Queue consumer loops that do not account for idle periods",
        ]}
        fixes={[
          "Always specify a timeout — BLPOP key [key ...] timeout; use 0 only with dedicated connections",
          "Use a separate connection pool for blocking consumers, isolated from request-serving connections",
          "Consider BullMQ or a purpose-built queue library that manages connection lifecycle",
          "Use non-blocking LPOP with an application-level retry loop if connection pooling is constrained",
        ]}
      />

      <Callout type="warning" title="Always set a timeout">
        <code>BLPOP key 0</code> blocks indefinitely. If your queue goes idle,
        every consumer connection is held open doing nothing — stealing
        connections from the rest of your application. Use a finite timeout and
        loop at the application level.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — indefinite block, consumes a connection from the shared pool
const result = await redis.blpop('jobs:queue', 0);

// GOOD — bounded timeout, application-level loop
const POLL_TIMEOUT_SECONDS = 5;

async function workerLoop(redis: Redis) {
  while (true) {
    const result = await redis.blpop('jobs:queue', POLL_TIMEOUT_SECONDS);
    if (!result) continue; // timeout — loop and try again

    const [_list, payload] = result;
    await processJob(JSON.parse(payload));
  }
}

// GOOD — dedicated connection for blocking operations
const workerRedis = new Redis({ // separate from main app connection
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null, // required for blocking consumers
});

workerLoop(workerRedis);`}
      />

      <h2>Using BullMQ (recommended for task queues)</h2>
      <CodeBlock
        language="typescript"
        code={`import { Queue, Worker } from 'bullmq';

// BullMQ handles connection lifecycle, retries, and concurrency
const queue = new Queue('jobs', { connection: { host: process.env.REDIS_HOST } });
const worker = new Worker('jobs', async (job) => {
  await processJob(job.data);
}, { connection: { host: process.env.REDIS_HOST }, concurrency: 5 });

// Enqueue
await queue.add('send-email', { userId: '123', template: 'welcome' });`}
      />
    </article>
  );
}
