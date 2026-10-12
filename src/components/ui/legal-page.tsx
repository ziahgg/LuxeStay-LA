import Link from "next/link";
import type { ReactNode } from "react";
import { Container, PlaceholderNote } from "./layout";
import { PageIntro } from "./page-intro";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

/**
 * Shared layout for legal pages. Content is explicitly a placeholder outline —
 * it is not legal advice or official policy and must be replaced with text
 * approved by the client's counsel before launch.
 */
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageIntro eyebrow="Legal" title={title}>
        <p>{intro}</p>
      </PageIntro>
      <Container className="pb-28 lg:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 space-y-3 text-sm text-muted">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#section-${i + 1}`} className="hover:text-charcoal hover:underline underline-offset-4">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="lg:col-span-8 lg:col-start-5">
            <PlaceholderNote>
              <strong className="font-semibold text-charcoal">Placeholder document.</strong> This page is a structural
              outline prepared during website development. It is not legal advice and does not represent the official
              policy of LuxeStay LA. Final wording must be provided or approved by LuxeStay LA&rsquo;s legal counsel
              before launch.
            </PlaceholderNote>
            <div className="mt-12 space-y-12">
              {sections.map((s, i) => (
                <section key={s.heading} id={`section-${i + 1}`} className="scroll-mt-28">
                  <h2 className="font-serif text-title">{s.heading}</h2>
                  <div className="prose-editorial mt-4 max-w-none">{s.body}</div>
                </section>
              ))}
            </div>
            <p className="mt-16 border-t border-line pt-6 text-sm text-muted">
              Questions about this page? <Link href="/contact?type=general" className="underline underline-offset-4">Contact us</Link>.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
