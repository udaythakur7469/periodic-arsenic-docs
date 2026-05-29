import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "high_memory signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="high_memory"
        severity="warning"
        summary="Query or request caused high memory usage"
        detail="Elevated memory consumption — potentially large result sets, inefficient data structures, loading entire documents when only a few fields are needed."
        causes={[
          "Fetching entire documents when few fields are needed",
          "Large result sets without streaming",
          "In-memory joins of large datasets",
          "Missing projections",
        ]}
        fixes={[
          "Use field projections (SELECT field1, field2)",
          "Implement streaming for large datasets",
          "Add pagination for large result sets",
          "Use .lean() in Mongoose for read-only results",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — loads entire documents including large blobs
const users = await User.find({ active: true });

// GOOD — project only needed fields
const users = await User.find({ active: true }).select('name email createdAt').lean();

// GOOD — stream large result sets
const cursor = User.find({ active: true }).cursor();
for await (const user of cursor) {
  await processUser(user);
}`}
      />
      <Callout type="warning" title=".lean() cuts Mongoose memory in half">
        Mongoose documents carry schema methods, virtuals, and change tracking.
        For read-only operations, <code>.lean()</code> returns plain JS objects
        — typically 3–5× less memory.
      </Callout>

      <h2>Prisma streaming large result sets</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — loads all records into memory at once
const allLogs = await prisma.log.findMany({ where: { level: 'error' } });

// GOOD — process in chunks
const PAGE_SIZE = 500;
let cursor: string | undefined;

while (true) {
  const batch = await prisma.log.findMany({
    where: { level: 'error' },
    take: PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'asc' },
  });
  if (batch.length === 0) break;
  await processBatch(batch);
  cursor = batch[batch.length - 1].id;
}`}
      />
    </article>
  );
}
