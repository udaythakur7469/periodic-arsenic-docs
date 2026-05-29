import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "stable_latency signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="stable_latency"
        severity="info"
        summary="Consistent performance across executions"
        detail="Low-variance execution time indicates well-optimized query execution and stable system conditions."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>Using stable latency as a baseline</h2>
        <CodeBlock
          language="typescript"
          code={`// stable_latency fires when variance is low across recent executions.
// Use it to establish performance baselines and detect regressions.

const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('stable_latency')) {
      // Record the p50 as your baseline
      metrics.gauge('db.query.baseline_ms', event.durationMs, {
        model: event.model,
        operation: event.operation,
      });
    }
    if (event.signals.includes('high_variance_latency')) {
      // Alert when the same query stops being stable
      alertOncall('Latency regression detected', {
        model: event.model,
        durationMs: event.durationMs,
      });
    }
  },
});`}
        />
      </div>
    </article>
  );
}
