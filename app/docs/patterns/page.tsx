import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Common Patterns' }

export default function PatternsPage() {
  return (
    <article className="prose-doc">
      <h1>Common Patterns</h1>
      <p>Production-tested patterns for every major combination of framework, database, and exporter.</p>

      <h2>1. Express + MongoDB</h2>
      <CodeBlock language="typescript" code={`import express from 'express';
import mongoose from 'mongoose';
import { createMonitor, expressContext, mongooseAdapter } from '@periodic/arsenic';

const app = express();
const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
    else if (event.severity === 'warning') sendToSlack(event);
    else logger.info(event);
  },
});

app.use(expressContext(monitor));
mongooseAdapter(monitor, mongoose);
app.listen(3000);`} />

      <h2>2. Express + PostgreSQL</h2>
      <CodeBlock language="typescript" code={`import express from 'express';
import { Pool } from 'pg';
import { createMonitor, expressContext, pgAdapter } from '@periodic/arsenic';

const app = express();
const pool = new Pool({ host: process.env.POSTGRES_HOST });

const monitor = createMonitor({
  slowQueryThresholdMs: 150,
  exporter: (event) => { if (event.severity === 'critical') sendToSlack(event); },
});

app.use(expressContext(monitor));
pgAdapter(monitor, pool);
app.listen(3000);`} />

      <h2>3. Fastify + Prisma</h2>
      <CodeBlock language="typescript" code={`import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createMonitor, fastifyContext, prismaAdapter } from '@periodic/arsenic';

const app = Fastify();
const prisma = new PrismaClient();
const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => logger.info(event),
});

await app.register(fastifyContext(monitor, { attachUser: (req) => req.user?.id }));
prismaAdapter(monitor, prisma);
await app.listen({ port: 3000 });`} />

      <h2>4. OpenTelemetry exporter</h2>
      <CodeBlock language="typescript" code={`import { createMonitor, createOtelExporter } from '@periodic/arsenic';

const monitor = createMonitor({
  exporter: createOtelExporter({
    serviceName: process.env.SERVICE_NAME || 'my-service',
    exportAsSpans: true,
    exportAsMetrics: true,
  }),
});`} />

      <h2>5. Multiple databases, separate monitors</h2>
      <CodeBlock language="typescript" code={`const pgMonitor = createMonitor({
  slowQueryThresholdMs: 100,  // Stricter for SQL
  exporter: pgExporter,
});

const mongoMonitor = createMonitor({
  slowQueryThresholdMs: 300,  // Looser for MongoDB
  exporter: mongoExporter,
});

const redisMonitor = createMonitor({
  slowQueryThresholdMs: 50,   // Very strict for Redis
  exporter: redisExporter,
});

pgAdapter(pgMonitor, pool);
mongooseAdapter(mongoMonitor, mongoose);
redisAdapter(redisMonitor, redis);`} />

      <h2>6. Multiple exporters</h2>
      <CodeBlock language="typescript" code={`const monitor = createMonitor({
  exporter: async (event) => {
    await Promise.allSettled([
      console.log(event),
      sendToDatadog(event),
      saveToDB(event),
    ]);
  },
});`} />

      <h2>7. Production configuration</h2>
      <CodeBlock language="typescript" filename="src/config/monitor.ts" code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

const isDev = process.env.NODE_ENV === 'development';

export const monitor = createMonitor({
  slowQueryThresholdMs: isDev ? 500 : 200,
  emitPositiveSignals: isDev,
  includeDocs: isDev,

  exporter: async (event) => {
    logger.info(event, 'db.event');
    if (!isDev && event.severity === SignalSeverity.CRITICAL) {
      await sendToPagerDuty(event);
    }
    if (event.severity === SignalSeverity.WARNING) {
      await sendToSlack(event);
    }
  },
});

export default monitor;`} />

      <Callout type="tip" title="Rate limit your exporter">
        In high-traffic systems, add rate limiting to your exporter to avoid flooding PagerDuty or Slack. Use <code>Promise.allSettled</code> so a slow exporter never blocks your app.
      </Callout>
    </article>
  )
}
