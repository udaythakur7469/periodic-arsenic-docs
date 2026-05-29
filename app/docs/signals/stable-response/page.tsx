import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "stable_response signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="stable_response"
        severity="info"
        summary="Performance matches expected baselines"
        detail="Response characteristics match established performance benchmarks."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>Using stable response as a health check</h2>
        <CodeBlock
          language="typescript"
          code={`// stable_response fires when response characteristics match
// your established performance benchmarks — duration, payload size, query count.

const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('stable_response')) {
      metrics.increment('db.health.stable', { route: event.requestContext?.path });
    }
  },
});

// Track the ratio of stable_response to total requests as a health score
// A drop in this ratio is an early warning of degradation`}
        />
      </div>
    </article>
  );
}
