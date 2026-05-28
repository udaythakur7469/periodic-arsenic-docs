import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Mongoose Adapter' }

export default function MongooseAdapterPage() {
  return (
    <article className="prose-doc">
      <h1>Mongoose Adapter</h1>
      <p>The Mongoose adapter instruments MongoDB operations via Mongoose ODM. Supports all query types including find, findOne, aggregate, save, update, and delete operations.</p>

      <h2>Setup</h2>
      <CodeBlock language="typescript" code={`import mongoose from 'mongoose';
import { createMonitor, expressContext, mongooseAdapter } from '@periodic/arsenic';

const app = express();

const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
    else if (event.severity === 'warning') sendToSlack(event);
  },
});

// 1. Attach Express context BEFORE routes
app.use(expressContext(monitor));

// 2. Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// 3. Attach Mongoose adapter
mongooseAdapter(monitor, mongoose);

// Now all Mongoose queries are monitored automatically`} />

      <Callout type="warning" title="Order matters">
        Call <code>mongooseAdapter()</code> AFTER <code>mongoose.connect()</code>. The adapter instruments the connection that is established, not future connections.
      </Callout>

      <h2>Supported operations</h2>
      <table>
        <thead><tr><th>Operation</th><th>Mongoose method</th><th>Signals detected</th></tr></thead>
        <tbody>
          {[
            ['find',       'Model.find()',         'hot_path, n_plus_one, unbounded_query, slow_query'],
            ['findOne',    'Model.findOne()',       'hot_path, unbounded_query, slow_query'],
            ['findById',   'Model.findById()',      'fast_query, indexed_lookup'],
            ['save',       'doc.save()',            'write_contention, slow_query'],
            ['updateOne',  'Model.updateOne()',     'write_contention, retry_loop'],
            ['aggregate',  'Model.aggregate()',     'slow_query, high_cpu, large_payload'],
            ['count',      'Model.countDocuments()', 'slow_query'],
          ].map(([op, method, signals]) => (
            <tr key={op}><td><code>{op}</code></td><td><code>{method}</code></td><td style={{ fontSize: '0.8125rem' }}>{signals}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Event output</h2>
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
  "request": { "method": "GET", "route": "/api/users/:id" },
  "callsite": { "file": "src/routes/users.ts", "line": 14 },
  "metadata": { "limit": null },
  "timestamp": "2025-02-11T15:30:45.123Z"
}`} />

      <h2>N+1 detection with Mongoose</h2>
      <CodeBlock language="typescript" code={`// BAD — triggers n_plus_one signal
const posts = await Post.find({ published: true });
for (const post of posts) {
  const author = await User.findById(post.authorId); // N queries!
}

// GOOD — single query with populate
const posts = await Post.find({ published: true }).populate('author');`} />

      <Callout type="tip" title="Use .lean() for read-only queries">
        Adding <code>.lean()</code> to read-only queries returns plain JavaScript objects instead of Mongoose Documents, reducing memory usage significantly. Arsenic detects this as a positive signal.
      </Callout>
    </article>
  )
}
