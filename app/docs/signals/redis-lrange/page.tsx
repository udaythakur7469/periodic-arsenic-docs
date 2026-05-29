import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_lrange signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_lrange"
        severity="warning"
        summary="Returns a range of list elements — linear in the number of elements returned"
        detail="LRANGE returns elements from a Redis list between two index positions. It is O(S+N) where S is the distance from the head or tail to the start of the range and N is the number of elements returned. Calling LRANGE 0 -1 returns the entire list — equivalent to SMEMBERS or HGETALL in terms of unbounded response size."
        causes={[
          'Activity feeds or timelines stored as lists without pagination',
          'Log or event stores fetched with LRANGE 0 -1',
          'Notification lists that grow indefinitely',
          'Queue inspection that retrieves the full list',
        ]}
        fixes={[
          'Always use explicit start and stop indices — avoid LRANGE 0 -1 in production',
          'Implement cursor-based pagination using index offsets',
          'Trim lists at write time with LTRIM to enforce a maximum length',
          'Use a sorted set if you need range queries by score rather than insertion order',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — fetches the entire list (could be thousands of items)
const allNotifications = await redis.lrange(\`notifications:\${userId}\`, 0, -1);

// GOOD — paginate with explicit window
const PAGE_SIZE = 20;
async function getNotificationPage(redis: Redis, userId: string, page: number) {
  const start = page * PAGE_SIZE;
  const stop = start + PAGE_SIZE - 1;
  return redis.lrange(\`notifications:\${userId}\`, start, stop);
}

// GOOD — cap list length at write time
async function pushNotification(redis: Redis, userId: string, notification: string) {
  const key = \`notifications:\${userId}\`;
  await redis.lpush(key, notification);
  await redis.ltrim(key, 0, 99); // keep only the 100 most recent
}

// GOOD — recent items only (safe bounded range)
const recent = await redis.lrange(\`activity:\${userId}\`, 0, 49); // last 50 only

// GOOD — use sorted set for score-based range queries
await redis.zadd('timeline:global', Date.now(), JSON.stringify(post));
const latest = await redis.zrevrangebyscore('timeline:global', '+inf', '-inf', 'LIMIT', 0, 20);`}
      />

      <Callout type="tip" title="Trim at write time">
        The safest pattern for activity feeds is LPUSH + LTRIM in a pipeline.
        The list never grows beyond your maximum, so LRANGE on any fixed window is always bounded.
      </Callout>
    </article>
  )
}
