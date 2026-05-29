import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "index_hit signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="index_hit"
        severity="info"
        summary="Confirmed efficient index usage"
        detail="Verified index usage detected, enabling efficient data access."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>Verifying index usage</h2>
        <CodeBlock
          language="typescript"
          code={`// MongoDB — confirm with explain()
const result = await User.findOne({ email: 'user@example.com' })
  .explain('executionStats');

console.log(result.executionStats.executionStages.stage);
// IXSCAN = index used ✓
// COLLSCAN = no index — add one

// PostgreSQL — confirm with EXPLAIN
// EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
// Index Scan using idx_users_email ✓
// Seq Scan = no index — add one

// Create indexes
await User.collection.createIndex({ email: 1 }, { unique: true });
// CREATE INDEX CONCURRENTLY idx_users_email ON users(email);`}
        />
      </div>
    </article>
  );
}
