import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "cached_query signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="cached_query"
        severity="info"
        summary="Query result was served from cache"
        detail="Cache hit detected, reducing database load. Result served without a database round-trip."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// Arsenic detects cache hits when your adapter reports a cached result
// Example — manual cache-aside with arsenic monitoring
const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('cached_query')) {
      metrics.increment('db.cache.hit', { model: event.model });
    }
  },
});

// Track your cache hit ratio over time
// High ratio = caching is working
// Sudden drop = cache was flushed or TTL is too short`}
        />
      </div>
    </article>
  );
}
