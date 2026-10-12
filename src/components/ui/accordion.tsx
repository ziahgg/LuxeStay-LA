"use client";

import { useId, useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

/**
 * Accessible accordion (WAI-ARIA disclosure pattern): each header is a real
 * <button> inside a heading, with aria-expanded / aria-controls, and panels are
 * labelled regions. Multiple panels may be open at once.
 */
export function Accordion({ items, headingLevel = 3 }: { items: AccordionItem[]; headingLevel?: 2 | 3 }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const baseId = useId();
  const Heading = `h${headingLevel}` as const;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-line">
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left font-serif text-[1.375rem] leading-snug text-charcoal transition-colors hover:text-olive-ink sm:text-2xl"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="relative mt-2 h-3.5 w-3.5 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-current after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-aria-expanded:after:scale-y-0"
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-7 pr-10"
            >
              <div className="prose-editorial text-base">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
