import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "low_memory signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="low_memory"
        severity="info"
        summary="Memory-efficient query execution"
        detail="Query completed with minimal memory footprint, indicating efficient data handling."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// low_memory fires when heap allocation during query execution is minimal.
// Typically triggered by: projections, .lean(), paginated results, single-row lookups.

// These patterns consistently produce low_memory:
await User.findById(id).select('name email').lean();         // projection + lean
await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
await pool.query('SELECT name, email FROM users WHERE id = $1', [id]);`}
        />
      </div>
    </article>
  );
}
