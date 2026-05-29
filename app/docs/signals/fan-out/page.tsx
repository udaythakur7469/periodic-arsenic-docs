import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "fan_out signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="fan_out"
        severity="warning"
        summary="Single request triggered too many database queries"
        detail="Request fans out into many DB queries, indicating architectural issues or missing data aggregation. High query fan-out increases latency and puts pressure on connection pools."
        causes={[
          "Missing aggregation — data fetched piecemeal",
          "No DataLoader for nested resolvers",
          "Redundant queries for the same data",
          "Missing joins or batch operations",
        ]}
        fixes={[
          "Use batch queries or DataLoader",
          "Implement response caching",
          "Aggregate data on the backend",
          "Redesign data model for fewer round-trips",
        ]}
      />

      <Callout type="warning" title="Multiplied by request volume">
        10 queries per request at 100 req/s is 1,000 DB queries per second.
        Fan-out makes your database load proportional to your traffic spikes.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — fan-out: one query per post author
const posts = await Post.find({ published: true });
const postsWithAuthors = await Promise.all(
  posts.map(post => User.findById(post.authorId))
);

// GOOD — single joined query
const posts = await Post.find({ published: true }).populate('author');`}
      />
      <h2>Prisma field selection</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — selects all columns including large text fields
const users = await prisma.user.findMany();

// GOOD — only what the caller needs
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});

// GOOD — Mongoose projection
const users = await User.find().select('name email -_id');`}
      />
      <Callout type="warning" title="Multiplied by request volume">
        10 queries per request at 100 req/s is 1,000 DB queries per second.
        Fan-out makes your database load proportional to traffic spikes.
      </Callout>

      <h2>Parallel fan-out with Promise.all</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — sequential fan-out (slow + many queries)
for (const id of userIds) {
  const profile = await Profile.findOne({ userId: id });
}

// BETTER — parallel but still N queries
const profiles = await Promise.all(
  userIds.map(id => Profile.findOne({ userId: id }))
);

// BEST — single IN query
const profiles = await Profile.find({ userId: { $in: userIds } });
// Then map back to userIds order if needed
const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));`}
      />
    </article>
  );
}
