import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Quick Start' }

export default function QuickStartPage() {
  return (
    <article className="prose-doc">
      <h1>Quick Start</h1>
      <p>Up and running in under 5 minutes. This guide uses Express + MongoDB. Swap adapters freely — the monitor code is identical for Fastify, Prisma, or PostgreSQL.</p>

      <h2>1. Install</h2>
      <CodeBlock code="npm install @periodic/arsenic mongoose express" language="bash" />

      <h2>2. Create a monitor</h2>
      <p>Create once, export, and reuse everywhere.</p>
      <CodeBlock filename="src/monitor.ts" language="typescript" code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

export const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  includeDocs: true,
  emitPositiveSignals: false,

  exporter: (event) => {
    if (event.severity === SignalSeverity.CRITICAL) {
      sendToPagerDuty(event);
    } else if (event.severity === SignalSeverity.WARNING) {
      sendToSlack(event);
    } else {
      logger.info(event);
    }
  },
});`} showLineNumbers />

      <h2>3. Attach Express middleware</h2>
      <p>Must be added <strong>before</strong> your routes.</p>
      <CodeBlock filename="src/app.ts" language="typescript" code={`import express from 'express';
import { expressContext } from '@periodic/arsenic';
import { monitor } from './monitor';

const app = express();

// Add BEFORE routes
app.use(expressContext(monitor, {
  attachUser: (req) => req.user?.id, // optional
}));`} />

      <h2>4. Instrument Mongoose</h2>
      <CodeBlock language="typescript" code={`import mongoose from 'mongoose';
import { mongooseAdapter } from '@periodic/arsenic';
import { monitor } from './monitor';

await mongoose.connect(process.env.MONGODB_URI);
mongooseAdapter(monitor, mongoose);`} />

      <h2>5. Write your routes normally</h2>
      <CodeBlock language="typescript" code={`app.get('/api/users/:id', async (req, res) => {
  // Arsenic automatically monitors this query
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
});

app.listen(3000);`} />

      <h2>Example event output</h2>
      <CodeBlock language="json" code={`{
  "type": "db.query",
  "db": "mongodb",
  "adapter": "mongoose",
  "model": "User",
  "operation": "findOne",
  "durationMs": 312,
  "slow": true,
  "signals": ["hot_path", "unbounded_query"],
  "severity": "critical",
  "request": {
    "id": "req_8f29",
    "method": "GET",
    "route": "/api/users/:id"
  },
  "callsite": {
    "file": "src/routes/users.ts",
    "line": 14
  },
  "timestamp": "2025-02-11T15:30:45.123Z"
}`} />

      <Callout type="tip" title="Swap adapters freely">
        The monitor code is identical for Express or Fastify, Mongoose or Prisma.
        Only the context middleware and adapter call changes.
      </Callout>
    </article>
  )
}
