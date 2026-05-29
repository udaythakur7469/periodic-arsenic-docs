import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "write_contention signal" };

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="write_contention"
        severity="critical"
        summary="High-frequency writes to the same record detected"
        detail="High-frequency writes to the same record may cause lock contention, serialization issues, and performance degradation. Common with counters, metrics, and leaderboards updated on every request."
        causes={[
          "Counters or metrics updated on every request",
          "Session data written to the same record",
          "Rate limiting state stored in a single document",
          "Leaderboard or ranking updates at high frequency",
        ]}
        fixes={[
          "Batch updates using $inc or equivalent atomic operations",
          "Use Redis for high-frequency counters",
          "Implement write buffering / debounce",
          "Consider event sourcing for counters",
        ]}
      />

      <Callout type="warning" title="Race conditions under load">
        Write contention often goes undetected in testing. It surfaces under
        concurrent load when multiple requests hit the same record
        simultaneously.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — write contention on counter
await Counter.updateOne({ type: 'pageviews' }, { $inc: { count: 1 } });
// Every request hits the same document

// GOOD — buffer in Redis, flush periodically
await redis.incr('counter:pageviews');

// Flush to DB every 60s
setInterval(async () => {
  const count = await redis.getdel('counter:pageviews');
  if (count) await Counter.updateOne(
    { type: 'pageviews' },
    { $inc: { count: parseInt(count) } },
    { upsert: true }
  );
}, 60000);`}
      />
      <h2>Atomic operations</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — read-modify-write race condition
const counter = await Counter.findOne({ name: 'pageviews' });
counter.value += 1;
await counter.save(); // another request may have done the same between find and save

// GOOD — atomic increment
await Counter.findOneAndUpdate(
  { name: 'pageviews' },
  { $inc: { value: 1 } },
  { upsert: true }
);

// GOOD — Prisma atomic update
await prisma.counter.upsert({
  where: { name: 'pageviews' },
  update: { value: { increment: 1 } },
  create: { name: 'pageviews', value: 1 },
});`}
      />
    </article>
  );
}
