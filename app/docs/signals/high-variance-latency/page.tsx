import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "high_variance_latency signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="high_variance_latency"
        severity="warning"
        summary="Query latency is inconsistent across executions"
        detail="High variance in execution time suggests unpredictable performance — often caused by cache misses, resource contention, or cold starts."
        causes={[
          "Inconsistent cache hit rates",
          "Resource contention at peak load",
          "GC pressure affecting query timing",
          "Index selectivity issues",
        ]}
        fixes={[
          "Check for cache misses and warm caches",
          "Investigate index selectivity",
          "Analyze data distribution",
          "Look for resource contention",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// Monitor latency distribution
const times = [];
const monitor = createMonitor({
  exporter: (event) => {
    if (event.model === 'User' && event.operation === 'findOne') {
      times.push(event.durationMs);
      const variance = calculateVariance(times);
      if (variance > 1000) sendAlert('high_variance', { variance, times });
    }
  }
});`}
      />
      <Callout type="warning" title="P99 matters more than average">
        High variance means your average latency looks fine but some users
        experience 10× slower responses. Always track p95 and p99, not just
        mean.
      </Callout>

      <h2>Common causes by pattern</h2>
      <CodeBlock
        language="typescript"
        code={`// Variance from cold cache — warm on startup
async function warmCache() {
  const hotUsers = await User.find({ active: true })
    .sort({ lastLogin: -1 })
    .limit(1000)
    .lean();
  await Promise.all(
    hotUsers.map(u => redis.setex(\`user:\${u._id}\`, 3600, JSON.stringify(u)))
  );
}

// Variance from lock contention — use optimistic concurrency
const session = await Session.findById(id);
const result = await Session.findOneAndUpdate(
  { _id: id, version: session.version }, // guard against concurrent update
  { $set: { data }, $inc: { version: 1 } },
  { new: true }
);
if (!result) throw new Error('Concurrent update detected — retry');`}
      />
    </article>
  );
}
