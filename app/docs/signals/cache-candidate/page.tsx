import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "cache_candidate signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="cache_candidate"
        severity="info"
        summary="Query pattern would benefit from caching"
        detail="This query executes the same data access pattern repeatedly. Adding a cache layer would reduce database load."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>Acting on this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// Arsenic detects the same query firing repeatedly without a cache hit
const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('cache_candidate')) {
      // Log which queries to prioritise for caching
      console.log('Cache candidate:', {
        model: event.model,
        operation: event.operation,
        filter: event.filter,
      });
    }
  },
});

// Then implement cache-aside for the identified query
async function getConfig(key: string) {
  const cached = await redis.get(\`config:\${key}\`);
  if (cached) return JSON.parse(cached);
  const config = await Config.findOne({ key }).lean();
  await redis.setex(\`config:\${key}\`, 600, JSON.stringify(config));
  return config;
}`}
        />
      </div>
    </article>
  );
}
