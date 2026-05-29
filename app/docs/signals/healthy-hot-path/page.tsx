import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "healthy_hot_path signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="healthy_hot_path"
        severity="info"
        summary="High-frequency query is fast and stable"
        detail="This query runs frequently and performs well. Continue monitoring for regressions."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// healthy_hot_path fires when a high-frequency query is also fast and stable.
// It's the resolved state of hot_path — your optimisation worked.

const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('hot_path')) {
      // Still needs work
      logger.warn('hot_path detected', { model: event.model, durationMs: event.durationMs });
    }
    if (event.signals.includes('healthy_hot_path')) {
      // High-frequency and fast — this is the goal state
      metrics.increment('db.hot_path.healthy', { model: event.model });
    }
  },
});`}
        />
      </div>
    </article>
  );
}
