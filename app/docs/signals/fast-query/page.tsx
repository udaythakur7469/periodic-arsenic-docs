import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "fast_query signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="fast_query"
        severity="info"
        summary="Query executed well under configured threshold"
        detail="This query completed quickly and efficiently, indicating good performance. The database is responding as expected with no signs of degradation."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>Using in your exporter</h2>
        <CodeBlock
          language="typescript"
          code={`const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('fast_query')) {
      // Use as a baseline — alert if this query stops being fast
      metrics.histogram('db.query.duration', event.durationMs, {
        model: event.model,
        operation: event.operation,
        signal: 'fast_query',
      });
    }
  },
});`}
        />
      </div>
    </article>
  );
}
