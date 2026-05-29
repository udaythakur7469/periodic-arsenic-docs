import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "high_cpu signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="high_cpu"
        severity="warning"
        summary="Query or request caused high CPU consumption"
        detail="Elevated CPU usage during query execution — often complex aggregations, sorts on large datasets, regex patterns, or missing indexes causing full scans."
        causes={[
          "Complex aggregation pipelines",
          "Regex queries without indexes",
          "In-memory sorting of large result sets",
          "Missing indexes causing full collection scans",
        ]}
        fixes={[
          "Optimize complex calculations",
          "Push computation to database aggregation pipelines",
          "Add indexes for sorting/filtering",
          "Avoid regex queries; use text indexes",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — regex query causes full scan
const users = await User.find({ name: /^john/i });

// GOOD — text index for search
await User.collection.createIndex({ name: 'text' });
const users = await User.find({ $text: { $search: 'john' } });`}
      />
      <Callout type="warning" title="Aggregation pipelines run on the database">
        Move heavy computation into MongoDB aggregation or PostgreSQL
        expressions rather than fetching raw data and processing it in Node.js.
      </Callout>

      <h2>Aggregation instead of in-memory processing</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — fetch all, calculate in Node.js
const orders = await Order.find({ userId });
const total = orders.reduce((sum, o) => sum + o.amount, 0); // CPU in Node

// GOOD — compute on the database
const [result] = await Order.aggregate([
  { $match: { userId } },
  { $group: { _id: null, total: { $sum: '$amount' } } },
]);
const total = result?.total ?? 0;`}
      />
    </article>
  );
}
