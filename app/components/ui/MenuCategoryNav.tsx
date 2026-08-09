"use client";

import { useEffect, useState } from "react";
import Container from "./Container";

export type MenuCategoryNavItem = {
  id: string;
  title: string;
  count: number;
};

type MenuCategoryNavProps = {
  items: MenuCategoryNavItem[];
  label: string;
};

export default function MenuCategoryNav({
  items,
  label,
}: MenuCategoryNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    // The band sits just below the sticky header, so a section counts as
    // active while its top edge is in the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="sticky top-20 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur"
    >
      <Container>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-3 py-5">
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-baseline gap-2 border-b pb-1 text-sm uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {item.title}
                  <span className="text-[0.65rem] tabular-nums text-zinc-400">
                    {item.count}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
