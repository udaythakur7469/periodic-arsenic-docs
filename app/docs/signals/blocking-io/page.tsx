import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'blocking_io signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="blocking_io"
        severity="critical"
        summary="Blocking operations detected on event loop"
        detail="Synchronous I/O operations are blocking the Node.js event loop, degrading overall application responsiveness. While blocked, no other requests can be processed."
        causes={["Synchronous file operations (fs.readFileSync, fs.writeFileSync)","CPU-intensive operations on the main thread","Synchronous JSON.parse on large payloads","Missing async/await on I/O operations"]}
        fixes={["Use async/await for all I/O operations","Use fs.promises instead of synchronous fs methods","Use worker threads for CPU-intensive tasks","Profile event loop lag with clinic.js"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — blocking read on main thread
const config = fs.readFileSync('./config.json', 'utf8');

// GOOD — async file read
const config = await fs.promises.readFile('./config.json', 'utf8');

// GOOD — worker thread for CPU work
const { Worker } = require('worker_threads');
const result = await new Promise((resolve) => {
  const worker = new Worker('./heavy-compute.js');
  worker.on('message', resolve);
});`} />
    </article>
  )
}
