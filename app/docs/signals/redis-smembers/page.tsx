import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_smembers signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_smembers"
        severity="warning"
        summary="Returns all members of a set — unbounded on large sets"
        detail="SMEMBERS returns every member of a Redis set in a single response. It is O(N) where N is the set cardinality. Sets that grow unboundedly — user IDs, tags, permission lists, follower sets — will cause SMEMBERS to transfer increasing amounts of data over time. A set with 100,000 members returns all of them in one call."
        causes={[
          'Membership stores that grow as users interact with the application',
          'Tag or category indexes without size bounds',
          'Permission or role sets that accumulate over time',
          'Social graph edges (followers, friends) stored as sets',
        ]}
        fixes={[
          'Use SSCAN with a cursor for incremental iteration on large sets',
          'Use SRANDMEMBER with a count for sampling without full retrieval',
          'Use SISMEMBER or SMISMEMBER to check specific membership without fetching all',
          'Cap set size at write time — SADD + SCARD check or use a sorted set with ZREMRANGEBYRANK',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — returns all 50,000 follower IDs
const followers = await redis.smembers(\`followers:\${userId}\`);

// GOOD — check membership without fetching the whole set
const isFollowing = await redis.sismember(\`followers:\${userId}\`, targetId);

// GOOD — check multiple memberships at once
const [followsA, followsB] = await redis.smismember(\`followers:\${userId}\`, userA, userB);

// GOOD — cursor-based iteration when you need to process all members
async function processFollowers(redis: Redis, userId: string) {
  let cursor = '0';
  do {
    const [next, members] = await redis.sscan(\`followers:\${userId}\`, cursor, 'COUNT', 200);
    cursor = next;
    await processPage(members);
  } while (cursor !== '0');
}

// GOOD — random sample for feeds without full retrieval
const sampleFollowers = await redis.srandmember(\`followers:\${userId}\`, 50);

// GOOD — bounded sets using sorted set + cleanup
await redis.zadd(\`recent:viewers:\${postId}\`, Date.now(), userId);
await redis.zremrangebyrank(\`recent:viewers:\${postId}\`, 0, -1001); // keep latest 1000`}
      />

      <Callout type="tip" title="Use SISMEMBER for membership checks">
        If you only need to know whether a specific value is in the set, SISMEMBER is O(1)
        and returns immediately. Never call SMEMBERS just to check if one value is present.
      </Callout>
    </article>
  )
}
