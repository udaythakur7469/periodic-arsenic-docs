import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "large_payload signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="large_payload"
        severity="warning"
        summary="Query returned an excessively large dataset"
        detail="The result set size is unusually large, suggesting overfetching, missing pagination, or inefficient data retrieval. Large payloads increase memory usage, serialization time, and network transfer costs."
        causes={[
          "Missing pagination on list endpoints",
          "No field projection",
          "Eager loading too many relations",
          "No size limits on result sets",
        ]}
        fixes={[
          "Add pagination — cursor-based preferred",
          "Use field projection to select only needed fields",
          "Implement lazy loading",
          "Add result size limits",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — loads all orders including line items
const orders = await prisma.order.findMany({
  include: { items: true, customer: true, payments: true }
});

// GOOD — paginate and select fields
const orders = await prisma.order.findMany({
  take: 20,
  cursor: { id: lastId },
  select: { id: true, total: true, status: true, createdAt: true },
});`}
      />
      <Callout
        type="warning"
        title="Serialisation cost is invisible in query time"
      >
        A query that takes 5ms can still cause a 500ms response if it returns
        50,000 rows. Arsenic measures payload size separately from query
        duration.
      </Callout>

      <h2>Cursor-based pagination</h2>
      <CodeBlock
        language="typescript"
        code={`// Offset pagination breaks on large datasets (OFFSET 10000 scans 10000 rows)
// Use cursor-based instead

// Mongoose
const PAGE_SIZE = 20;
async function getPage(lastId?: string) {
  return User.find(lastId ? { _id: { $gt: lastId } } : {})
    .limit(PAGE_SIZE)
    .sort({ _id: 1 })
    .lean();
}

// Prisma
async function getPage(cursor?: string) {
  return prisma.user.findMany({
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'asc' },
  });
}`}
      />
    </article>
  );
}
