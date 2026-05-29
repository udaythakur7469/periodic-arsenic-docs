import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";

export const metadata: Metadata = { title: "overfetching signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="overfetching"
        severity="warning"
        summary="Query selects more fields than necessary"
        detail="Query retrieves more data than needed — common with SELECT * or missing projections. Increases memory usage, serialization cost, and network transfer."
        causes={[
          "SELECT * without projection",
          "Missing .select() in Mongoose",
          "No Prisma select field list",
          "GraphQL resolvers not using field selection",
        ]}
        fixes={[
          "Use SELECT field1, field2 instead of SELECT *",
          "Add Mongoose .select() calls",
          "Use Prisma select object",
          "Implement GraphQL field selection",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — fetches all user fields including password hash, large bio, etc.
const user = await User.findById(id);

// GOOD — only fetch what you need
const user = await User.findById(id).select('name email avatar createdAt');

// Prisma equivalent
const user = await prisma.user.findUnique({
  where: { id },
  select: { name: true, email: true, avatar: true, createdAt: true },
});`}
      />
    </article>
  );
}
