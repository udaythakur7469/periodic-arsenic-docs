import type { Metadata } from "next";
import { SignalCard } from "@/components/SignalCard";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "optimized_join signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="optimized_join"
        severity="info"
        summary="Join operation completed efficiently"
        detail="Join operation used indexes efficiently, avoiding cross-product scans."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What makes a join optimized</h2>
        <CodeBlock
          language="typescript"
          code={`// An optimized join uses indexes on both sides of the join condition.
// Without indexes, the database does a nested loop full scan.

// PostgreSQL — ensure foreign key columns are indexed
// CREATE INDEX idx_posts_user_id ON posts(user_id);
// CREATE INDEX idx_comments_post_id ON comments(post_id);

// Prisma — index foreign keys in schema
// model Post {
//   userId String
//   user   User   @relation(fields: [userId], references: [id])
//   @@index([userId])
// }

// Mongoose — index reference fields
const PostSchema = new Schema({
  authorId: { type: ObjectId, ref: 'User', index: true }, // ← index here
});`}
        />
      </div>
    </article>
  );
}
