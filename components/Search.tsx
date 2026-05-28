"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";
import { searchIndex, type SearchRecord } from "@/lib/search-index";
import { cn } from "@/lib/utils";

// Fuse instance — created once, outside component to avoid re-init on every render
const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.2 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
});

const SEV_COLORS: Record<string, string> = {
  critical: "text-red-500",
  warning: "text-amber-400",
  info: "text-blue-400",
};

function isSigRecord(r: SearchRecord) {
  return (
    r.section === "Signals" &&
    r.href.includes("/signals/") &&
    !r.href.endsWith("/signals")
  );
}

function getSev(r: SearchRecord): string | null {
  const tag = r.tags?.find((t) => ["critical", "warning", "info"].includes(t));
  return tag ?? null;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut — Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setCursor(0);
    }
  }, [open]);

  const handleQuery = useCallback((q: string) => {
    setQuery(q);
    setCursor(0);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const hits = fuse
      .search(q)
      .slice(0, 8)
      .map((r) => r.item);
    setResults(hits);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === "Enter" && results[cursor]) navigate(results[cursor].href);
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border text-sm transition-colors hover:bg-accent"
        style={{
          borderColor: "var(--border)",
          color: "var(--muted-foreground)",
          background: "var(--muted)",
        }}
        aria-label="Search documentation"
      >
        <SearchIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
          Search…
        </span>
        <kbd
          className="ml-2 text-[10px] px-1.5 py-0.5 rounded border font-mono"
          style={{
            borderColor: "var(--border)",
            background: "var(--background)",
            color: "var(--muted-foreground)",
          }}
        >
          ⌘K
        </kbd>
      </button>
    );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "oklch(0 0 0 / 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] mx-4 rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search"
        aria-modal="true"
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <SearchIcon
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search docs, signals, adapters…"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-base outline-none"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
            aria-label="Search query"
            aria-autocomplete="list"
            role="combobox"
            aria-expanded={results.length > 0}
          />
          {query && (
            <button onClick={() => handleQuery("")} aria-label="Clear search">
              <X
                className="h-4 w-4"
                style={{ color: "var(--muted-foreground)" }}
              />
            </button>
          )}
          <kbd
            className="text-[11px] px-1.5 py-0.5 rounded border font-mono hidden sm:inline"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-[360px] overflow-y-auto" role="listbox">
            {results.map((r, i) => {
              const sev = isSigRecord(r) ? getSev(r) : null;
              return (
                <li
                  key={r.href}
                  role="option"
                  aria-selected={cursor === i}
                  onClick={() => navigate(r.href)}
                  onMouseEnter={() => setCursor(i)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                    cursor === i ? "bg-accent" : "",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wide shrink-0"
                        style={{
                          color: "var(--muted-foreground)",
                          opacity: 0.6,
                        }}
                      >
                        {r.section}
                      </span>
                      {sev && (
                        <span
                          className={cn(
                            "text-[10px] font-bold",
                            SEV_COLORS[sev],
                          )}
                        >
                          ● {sev}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm font-semibold truncate"
                      style={{
                        color: "var(--foreground)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {r.title}
                    </p>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {r.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 opacity-30"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {query.length >= 2 && results.length === 0 && (
          <div
            className="py-10 text-center"
            style={{ color: "var(--muted-foreground)" }}
          >
            <p className="text-sm">
              No results for <strong>"{query}"</strong>
            </p>
            <p className="text-xs mt-1 opacity-60">
              Try a signal name, adapter, or concept.
            </p>
          </div>
        )}

        {/* Footer hint */}
        {results.length > 0 && (
          <div
            className="px-4 py-2.5 border-t flex items-center gap-4 text-[11px]"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            <span>
              <kbd className="font-mono">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="font-mono">↵</kbd> open
            </span>
            <span>
              <kbd className="font-mono">esc</kbd> close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
