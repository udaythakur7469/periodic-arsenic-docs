import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "low_cpu signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="low_cpu"
        severity="info"
        summary="CPU-efficient query execution"
        detail="CPU-efficient operation detected, indicating well-optimized database operations."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// low_cpu fires when CPU overhead during query execution is minimal.
// Common in simple indexed lookups and single-row fetches.
//
// Use it to confirm your optimisations worked:

const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('high_cpu')) {
      optimise(event);
    }
    if (event.signals.includes('low_cpu')) {
      // Confirm the fix worked — this query is now CPU-efficient
      metrics.increment('db.cpu.low', { model: event.model });
    }
  },
});`}
        />
      </div>
    </article>
  );
}
