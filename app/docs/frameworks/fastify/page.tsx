import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Fastify Integration' }

export default function FastifyPage() {
  return (
    <article className="prose-doc">
      <h1>Fastify Integration</h1>
      <p>The <code>fastifyContext</code> plugin registers as a Fastify plugin, hooking into the request lifecycle to propagate context to all downstream queries.</p>

      <h2>Setup</h2>
      <CodeBlock language="typescript" code={`import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createMonitor, fastifyContext, prismaAdapter } from '@periodic/arsenic';

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
  },
});

// Register BEFORE routes
await app.register(fastifyContext(monitor, {
  attachUser: (req) => req.user?.id,
}));

prismaAdapter(monitor, prisma);

app.get('/api/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });
  return user;
});

await app.listen({ port: 3000, host: '0.0.0.0' });`} />

      <Callout type="warning" title="Register before routes">
        Use <code>await app.register()</code> to ensure the plugin is fully initialized before routes are registered.
      </Callout>

      <h2>With TypeScript typed request</h2>
      <CodeBlock language="typescript" code={`import { FastifyRequest } from 'fastify';

interface JWTUser { id: string; email: string; role: string; }

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTUser;
  }
}

await app.register(fastifyContext(monitor, {
  attachUser: (req: FastifyRequest) => req.user?.id,
}));`} />

      <h2>With multiple databases</h2>
      <CodeBlock language="typescript" code={`import Redis from 'ioredis';

const pgMonitor = createMonitor({ slowQueryThresholdMs: 100, exporter: pgExporter });
const redisMonitor = createMonitor({ slowQueryThresholdMs: 50, exporter: redisExporter });

// One fastifyContext is enough — it covers all DB adapters
await app.register(fastifyContext(pgMonitor));

// Attach adapters with their own monitors
prismaAdapter(pgMonitor, prisma);
redisAdapter(redisMonitor, redis);`} />
    </article>
  )
}
