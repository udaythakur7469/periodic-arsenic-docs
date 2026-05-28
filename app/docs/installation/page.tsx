import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Installation' }

export default function InstallationPage() {
  return (
    <article className="prose-doc">
      <h1>Installation</h1>
      <p>Install the core package. Everything else is optional — install only what your stack needs.</p>

      <h2>Core package</h2>
      <CodeBlock code="npm install @periodic/arsenic" language="bash" />
      <CodeBlock code="yarn add @periodic/arsenic" language="bash" />

      <h2>Peer dependencies</h2>
      <p>Arsenic has <strong>zero required dependencies</strong>. Install only the peer deps that match your stack:</p>

      <h3>Database adapters</h3>
      <CodeBlock language="bash" code={`# MongoDB via Mongoose
npm install mongoose

# SQL via Prisma
npm install @prisma/client

# PostgreSQL raw driver
npm install pg

# Redis (either client works)
npm install redis
npm install ioredis`} />

      <h3>Framework support</h3>
      <CodeBlock language="bash" code={`npm install express   # For Express
npm install fastify   # For Fastify`} />

      <h3>Exporters</h3>
      <CodeBlock language="bash" code="npm install @opentelemetry/api  # For OpenTelemetry" />

      <h2>Peer dependency table</h2>
      <table>
        <thead><tr><th>Package</th><th>Used for</th><th>Required?</th></tr></thead>
        <tbody>
          {[
            ['mongoose',           'MongoDB via Mongoose adapter',       'No — only with Mongoose'],
            ['@prisma/client',     'SQL databases via Prisma adapter',   'No — only with Prisma'],
            ['pg',                 'PostgreSQL via raw pg adapter',      'No — only with pg'],
            ['ioredis / redis',    'Redis adapter',                      'No — only with Redis'],
            ['express',            'Express request context',            'No — only with Express'],
            ['fastify',            'Fastify request context',            'No — only with Fastify'],
            ['@opentelemetry/api', 'OpenTelemetry exporter',             'No — only if using OTEL'],
          ].map(([pkg, use, req]) => (
            <tr key={pkg}><td><code>{pkg}</code></td><td>{use}</td><td>{req}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js</strong> ≥ 16.0.0 (AsyncLocalStorage support)</li>
        <li><strong>TypeScript</strong> ≥ 4.5.0 (if using TypeScript)</li>
        <li><strong>npm</strong> ≥ 7.0.0</li>
      </ul>

      <Callout type="tip" title="TypeScript support included">
        Full TypeScript types are bundled. No <code>@types/</code> package needed. Strict mode compatible.
      </Callout>
    </article>
  )
}
