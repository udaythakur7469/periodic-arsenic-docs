import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "slow_query signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="slow_query"
        severity="warning"
        summary="Query exceeded configured slowQueryThresholdMs"
        detail="This query took longer than expected based on your configured threshold and may impact request latency. Review query execution plan and consider adding indexes."
        causes={[
          "Missing indexes",
          "Large result set without pagination",
          "Complex aggregation without optimization",
          "Network latency to database",
        ]}
        fixes={[
          "Analyze with EXPLAIN/explain()",
          "Add appropriate indexes",
          "Optimize query structure",
          "Implement caching for stable data",
        ]}
      />

      <Callout type="warning" title="Threshold is configurable">
        The default <code>slowQueryThresholdMs</code> is 100ms. Tune it per
        environment — stricter in production, relaxed in development.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// Diagnose with explain — Mongoose
const result = await User.findOne({ email }).explain('executionStats');
// Look for: COLLSCAN (bad) vs IXSCAN (good)
// Look for: totalDocsExamined >> nReturned (bad)
console.log(result.executionStats);

// Fix — add the missing index
await User.collection.createIndex({ email: 1 }, { unique: true });`}
      />

      <h2>PostgreSQL</h2>
      <CodeBlock
        language="sql"
        code={`-- Find the slow query plan
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- If you see Seq Scan, add the index
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);`}
      />
    </article>
  );
}
