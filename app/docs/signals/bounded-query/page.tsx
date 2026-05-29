import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "bounded_query signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="bounded_query"
        severity="info"
        summary="Query includes proper LIMIT clause"
        detail="Proper LIMIT usage detected, preventing unbounded data access and ensuring predictable memory usage."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What triggers this signal</h2>
        <CodeBlock
          language="typescript"
          code={`// These all trigger bounded_query
await User.find().limit(20);
await prisma.user.findMany({ take: 20 });
await pool.query('SELECT * FROM users LIMIT 20');

// This does NOT — no limit present
await User.find(); // triggers unbounded_query instead`}
        />
      </div>
    </article>
  );
}
