import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "n_plus_one signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="n_plus_one"
        severity="critical"
        summary="Multiple queries detected where a single query should suffice"
        detail="Data is fetched in a loop instead of a single batch query. This is the classic N+1 problem — 1 query to fetch N items, then N queries to fetch related data for each. Performance degrades linearly with dataset size."
        causes={[
          "Iterating a result set and querying related data per item",
          "Missing ORM populate/include (.populate in Mongoose, include in Prisma)",
          "No DataLoader pattern for nested resolvers",
          "Lazy loading without eager loading configured",
        ]}
        fixes={[
          "Use batch queries or joins",
          "Use Mongoose .populate() or Prisma include",
          "Implement DataLoader pattern",
          "Cache frequently accessed related data",
        ]}
      />

      <Callout type="danger" title="Scales with your data">
        With 100 users this fires 101 queries. With 10,000 users it fires
        10,001. N+1 patterns are invisible in development and catastrophic in
        production.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — N+1: 1 query for users, then N queries for posts
const users = await User.find();
for (const user of users) {
  user.posts = await Post.find({ userId: user._id }); // fires once per user
}

// GOOD — Mongoose: single query with populate
const users = await User.find().populate('posts');

// GOOD — Prisma: single query with include
const users = await prisma.user.findMany({
  include: { posts: true },
});`}
      />

      <h2>GraphQL resolvers</h2>
      <p>
        N+1 is especially common in GraphQL. Use DataLoader to batch and cache
        per-request.
      </p>
      <CodeBlock
        language="typescript"
        code={`import DataLoader from 'dataloader';

const postLoader = new DataLoader(async (userIds: readonly string[]) => {
  const posts = await Post.find({ userId: { $in: userIds } });
  return userIds.map(id => posts.filter(p => p.userId.toString() === id));
});

// In your resolver — batched automatically
const resolver = {
  User: {
    posts: (user) => postLoader.load(user._id.toString()),
  },
};`}
      />
    </article>
  );
}
