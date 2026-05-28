import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Prisma Adapter' }

export default function PrismaAdapterPage() {
  return (
    <article className="prose-doc">
      <h1>Prisma Adapter</h1>
      <p>The Prisma adapter instruments any database supported by Prisma — PostgreSQL, MySQL, SQLite, and CockroachDB. It uses Prisma's middleware API to observe all queries.</p>

      <h2>Setup</h2>
      <CodeBlock language="typescript" code={`import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import { createMonitor, fastifyContext, prismaAdapter } from '@periodic/arsenic';

const app = Fastify();
const prisma = new PrismaClient();

const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
  },
});

// 1. Register Fastify context plugin
app.register(fastifyContext(monitor, {
  attachUser: (req) => req.user?.id,
}));

// 2. Attach Prisma adapter
prismaAdapter(monitor, prisma);

await app.listen({ port: 3000 });`} />

      <h2>Supported databases</h2>
      <table>
        <thead><tr><th>Database</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          {[
            ['PostgreSQL',  '✅ Full support', 'All query types monitored'],
            ['MySQL',       '✅ Full support', 'All query types monitored'],
            ['SQLite',      '✅ Full support', 'All query types monitored'],
            ['CockroachDB', '✅ Full support', 'Compatible via pg wire protocol'],
            ['MongoDB',     '⚠️ Partial',      'Use mongooseAdapter instead'],
          ].map(([db, status, notes]) => (
            <tr key={db}><td>{db}</td><td>{status}</td><td>{notes}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Overfetching detection</h2>
      <CodeBlock language="typescript" code={`// BAD — triggers overfetching signal
const users = await prisma.user.findMany();
// Returns all fields including password hash, large blobs, etc.

// GOOD — select only what you need
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, createdAt: true },
});`} />

      <h2>N+1 detection with Prisma</h2>
      <CodeBlock language="typescript" code={`// BAD — N+1 query
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// GOOD — include in single query
const posts = await prisma.post.findMany({
  include: { author: true },
});`} />

      <Callout type="tip" title="Use select everywhere">
        Prisma makes it easy to select exactly the fields you need. Make it a habit — Arsenic will reward you with <code>low_memory</code> and <code>fast_query</code> signals.
      </Callout>
    </article>
  )
}
