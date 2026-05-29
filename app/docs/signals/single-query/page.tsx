import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "single_query signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="single_query"
        severity="info"
        summary="No N+1 patterns detected on this request"
        detail="Query executed as intended without N+1 patterns. Good relational data access pattern."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// single_query fires when a request results in exactly one DB query
// with no N+1 pattern detected. It's the healthy counterpart to n_plus_one.

// This pattern triggers single_query — one query, all data in one round trip
const user = await prisma.user.findUnique({
  where: { id },
  include: { profile: true, posts: { take: 10 } }, // joined, not looped
});

// Use in your exporter to confirm key routes stay efficient
const monitor = createMonitor({
  emitPositiveSignals: true,
  exporter: (event) => {
    if (event.signals.includes('single_query') && event.requestContext?.path === '/api/dashboard') {
      metrics.increment('db.single_query.dashboard');
    }
  },
});`}
        />
      </div>
    </article>
  );
}
