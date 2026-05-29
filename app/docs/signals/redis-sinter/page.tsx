import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "redis_sinter signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="redis_sinter"
        severity="warning"
        summary="Set intersection — O(N*M) in the worst case, expensive with large input sets"
        detail="SINTER computes the intersection of multiple sets and returns only members present in all sets. Redis optimises by iterating the smallest set and checking membership in the others, but it is still O(N*M) worst case where N is the size of the smallest set and M is the number of input sets. On large, frequently overlapping sets called at request frequency this causes significant CPU and memory overhead."
        causes={[
          "Mutual friend or connection lookups computed live per request",
          "Permission intersection checks across multiple roles or groups",
          "Content filtering by intersecting multiple tag or category sets",
          "Recommendation filtering across multiple user preference sets",
        ]}
        fixes={[
          "Cache the intersection result with SINTERSTORE and a TTL",
          "Move SINTER to a background job that refreshes the result periodically",
          "Compute intersections in application memory when input sets are small enough to fetch cheaply",
          "Restructure data to pre-compute intersections at write time",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — mutual friends computed on every profile visit
app.get('/api/users/:id/mutual', async (req, res) => {
  const mutual = await redis.sinter(
    \`friends:\${req.user.id}\`,
    \`friends:\${req.params.id}\`
  );
  res.json({ count: mutual.length, sample: mutual.slice(0, 5) });
});

// GOOD — cache the intersection
async function getMutualFriends(redis: Redis, userA: string, userB: string) {
  const cacheKey = \`mutual:\${[userA, userB].sort().join(':')}\`;
  const cached = await redis.smembers(cacheKey);
  if (cached.length > 0) return cached;

  const mutual = await redis.sinterstore(cacheKey, \`friends:\${userA}\`, \`friends:\${userB}\`);
  await redis.expire(cacheKey, 300); // 5 minute TTL
  return redis.smembers(cacheKey);
}

// GOOD — application-level intersection on small bounded sets
const [setA, setB] = await Promise.all([
  redis.smembers(\`tags:\${itemA}\`),
  redis.smembers(\`tags:\${itemB}\`),
]);
const commonTags = setA.filter(tag => setB.includes(tag));`}
      />

      <Callout type="tip" title="Sort keys consistently for cache hits">
        When caching an intersection of two sets, sort the key identifiers
        before joining them: <code>{`[userA, userB].sort().join(':')`}</code>.
        This ensures <code>mutual:alice:bob</code> and{" "}
        <code>mutual:bob:alice</code> hit the same cache key.
      </Callout>
    </article>
  );
}
