"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navigation } from "@/lib/navigation";

// Build a flat label map from the nav config so we never hardcode strings twice
const labelMap: Record<string, string> = {};
for (const section of navigation) {
  for (const item of section.items) {
    labelMap[item.href] = item.label;
  }
}

// Hardcode the top-level segment labels that aren't in the nav tree
const SEGMENT_LABELS: Record<string, string> = {
  docs: "Docs",
  adapters: "Adapters",
  frameworks: "Frameworks",
  signals: "Signals",
  exporters: "Exporters",
  ...labelMap,
};

function buildCrumbs(pathname: string) {
  const crumbs: { label: string; href: string }[] = [];
  const segments = pathname.split("/").filter(Boolean);

  let running = "";
  for (const seg of segments) {
    running += `/${seg}`;
    const label =
      SEGMENT_LABELS[running] ??
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: running });
  }

  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  // Don't render on the docs index itself — only one crumb would show
  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm mb-6 flex-wrap"
      style={{
        color: "var(--muted-foreground)",
        fontFamily: "var(--font-body)",
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
            )}
            {isLast ? (
              <span
                className="font-medium"
                style={{ color: "var(--foreground)" }}
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--muted-foreground)" }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
