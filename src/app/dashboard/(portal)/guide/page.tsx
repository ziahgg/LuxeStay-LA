import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardHeader, Loading, PanelSkeleton } from "@/components/dashboard/ui";
import { Accordion } from "@/components/ui/accordion";
import { PlaceholderNote } from "@/components/ui/layout";
import { residentFaq, residentGuide } from "@/content/resident-guide";
import { requireResident } from "@/lib/auth/dal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Resident Guide" };

export default function GuidePage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Resident Guide"
        title="Living at LuxeStay."
        description="Practical information for your stay, from move-in to local favorites."
      />
      <Suspense
        fallback={
          <Loading label="Loading resident guide">
            <PanelSkeleton lines={6} />
          </Loading>
        }
      >
        <Guide />
      </Suspense>
    </>
  );
}

async function Guide() {
  // The guide may include building-specific information, so it is private.
  await requireResident("/dashboard/guide");

  return (
    <div className="grid gap-12 lg:grid-cols-[13rem_1fr]">
      <nav aria-label="Guide sections" className="hidden lg:block">
        <ol className="sticky top-14 space-y-2 text-sm">
          {[...residentGuide, { id: "faq", title: "FAQ" }, { id: "contact", title: "Contact" }].map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-muted underline-offset-4 hover:text-charcoal hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 space-y-14">
        {residentGuide.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24">
            <h2 id={`${section.id}-h`} className="font-serif text-title">
              {section.title}
            </h2>
            {section.intro && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{section.intro}</p>}
            {section.pending && (
              <PlaceholderNote className="mt-5 max-w-2xl">
                Awaiting official information from property management.
              </PlaceholderNote>
            )}
            {section.items && (
              <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.title} className="bg-paper p-6">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section id="faq" aria-labelledby="faq-h" className="scroll-mt-24">
          <h2 id="faq-h" className="mb-4 font-serif text-title">
            Frequently asked questions
          </h2>
          <Accordion items={residentFaq.map((f) => ({ id: f.id, question: f.question, answer: <p>{f.answer}</p> }))} />
        </section>

        <section id="contact" aria-labelledby="contact-h" className="scroll-mt-24">
          <h2 id="contact-h" className="font-serif text-title">
            Property management contact
          </h2>
          <dl className="mt-6 max-w-xl border-t border-line">
            {[
              ["Email", site.contact.email],
              ["Phone", site.contact.phone],
              ["Hours", site.contact.hours],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6rem_1fr] border-b border-line py-4">
                <dt className="text-sm text-muted">{label}</dt>
                <dd>{value ?? <span className="text-muted italic">To be provided</span>}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">
            Prefer to write?{" "}
            <Link href="/dashboard/support" className="text-charcoal underline underline-offset-4">
              Send a message from Help &amp; Support
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
