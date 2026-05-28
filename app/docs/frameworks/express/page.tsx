import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Express Integration' }

export default function ExpressPage() {
  return (
    <article className="prose-doc">
      <h1>Express Integration</h1>
      <p>The <code>expressContext</code> middleware attaches request context to all queries made within Express route handlers. Uses AsyncLocalStorage for zero-overhead propagation.</p>

      <h2>Setup</h2>
      <CodeBlock language="typescript" code={`import express from 'express';
import { createMonitor, expressContext } from '@periodic/arsenic';

const app = express();
const monitor = createMonitor({ /* config */ });

// MUST be before routes
app.use(expressContext(monitor, {
  attachUser: (req) => req.user?.id, // optional
}));

// All queries in handlers below will have request context
app.get('/api/users', async (req, res) => {
  const users = await User.find({ active: true });
  res.json(users);
});

app.listen(3000);`} />

      <Callout type="danger" title="Add middleware BEFORE routes">
        <code>expressContext</code> must be added before any route handlers. Adding it after routes means those routes' queries will have no request context.
      </Callout>

      <h2>With user attribution</h2>
      <CodeBlock language="typescript" code={`// If using JWT auth
app.use(expressContext(monitor, {
  attachUser: (req) => {
    // Return any string — user ID, email, etc.
    return req.user?.id || req.headers['x-user-id'] as string;
  },
}));

// Event output will include:
// { "request": { "userId": "user_abc123", ... } }`} />

      <h2>With multiple routers</h2>
      <CodeBlock language="typescript" code={`import express from 'express';
import { Router } from 'express';

const app = express();
const apiRouter = Router();

// Attach context to app — covers all routers
app.use(expressContext(monitor));
app.use(express.json());

// Mount routers normally
app.use('/api', apiRouter);

apiRouter.get('/users', async (req, res) => {
  // Request context is available here
  const users = await User.find();
  res.json(users);
});`} />

      <h2>Event context field</h2>
      <CodeBlock language="json" code={`{
  "request": {
    "id": "req_8f29a3b1c",
    "method": "GET",
    "route": "/api/users/:id",
    "userId": "user_abc123"
  }
}`} />

      <Callout type="info">
        Queries made outside of Express handlers (e.g. background jobs, startup scripts) will have no <code>request</code> field. This is expected behavior — Arsenic still monitors these queries and emits events, just without HTTP context.
      </Callout>
    </article>
  )
}
