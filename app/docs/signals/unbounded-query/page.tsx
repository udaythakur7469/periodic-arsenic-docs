import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'unbounded_query signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="unbounded_query"
        severity="critical"
        summary="Query missing LIMIT — potential unbounded data fetch"
        detail="This query does not include a LIMIT clause and may return an unexpectedly large dataset, causing memory spikes and performance degradation. On large collections, this can return millions of records."
        causes={[
          "Missing LIMIT clause on find/select queries",
          "No default limit set at ORM level",
          "Pagination not implemented",
        ]}
        fixes={[
          "Always add LIMIT clauses to find queries",
          "Implement cursor-based pagination",
          "Add default limits at ORM level",
          "Use .lean() in Mongoose for read-only queries",
        ]}
      />

      <Callout type="danger" title="Silent in development, fatal in production">
        Your dev database has 50 rows. Production has 2 million. An unbounded
        query works fine locally and takes down prod.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — unbounded query
const users = await User.find({ status: 'active' });

// GOOD — always limit
const users = await User.find({ status: 'active' }).limit(100);

// GOOD — cursor-based pagination
const users = await User.find({
  status: 'active',
  _id: { $gt: lastSeenId }
}).limit(20);`}
      />
      <h2>Enforcing limits globally</h2>
      <CodeBlock language="typescript" code={`// Mongoose — global query middleware to enforce a max
mongoose.plugin((schema) => {
  schema.pre('find', function () {
    if (!this.getOptions().limit) {
      this.limit(100); // safe default
    }
  });
});

// Prisma — wrapper utility
async function safeFindMany<T>(
  model: { findMany: (args: any) => Promise<T[]> },
  args: any = {}
): Promise<T[]> {
  return model.findMany({ take: 100, ...args }); // args.take overrides
}`} />
    </article>
  );
}
