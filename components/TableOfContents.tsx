"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to let the page render fully
    const timer = setTimeout(() => {
      const article = document.querySelector("article.prose-doc");
      if (!article) return;

      const els = article.querySelectorAll("h2, h3");
      const items: Heading[] = [];

      els.forEach((el) => {
        // Auto-generate id from text if not present
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") ?? "";
        }
        if (el.id) {
          items.push({
            id: el.id,
            text: el.textContent ?? "",
            level: el.tagName === "H2" ? 2 : 3,
          });
        }
      });

      setHeadings(items);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return headings;
}

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-64px 0% -70% 0%", threshold: 0 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return active;
}

export function TableOfContents() {
  const headings = useHeadings();
  const active = useActiveHeading(headings);

  if (headings.length < 2) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-24">
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-3"
          style={{
            color: "var(--muted-foreground)",
            opacity: 0.5,
            fontFamily: "var(--font-body)",
          }}
        >
          On this page
        </p>
        <nav aria-label="Table of contents">
          <ul className="space-y-1">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="block py-1 text-[0.8125rem] leading-snug transition-all"
                  style={{
                    paddingLeft: h.level === 3 ? "0.875rem" : "0.5rem",
                    color:
                      active === h.id
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                    fontWeight: active === h.id ? "500" : "400",
                    borderLeft:
                      active === h.id
                        ? "2px solid var(--primary)"
                        : "2px solid transparent",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(h.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
