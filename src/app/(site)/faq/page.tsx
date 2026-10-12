import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container, PlaceholderNote } from "@/components/ui/layout";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about furnished temporary stays with LuxeStay LA: stay length, availability, pricing, what's included, leasing, deposits, extensions and resident support.",
  alternates: { canonical: "/faq" },
};

/** Marks an answer whose substance depends on official LuxeStay LA policy. */
function PolicyPlaceholder({ children }: { children: ReactNode }) {
  return (
    <>
      <p className="mb-3 inline-block border border-taupe-ink/40 px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.16em] text-taupe-ink uppercase">
        Placeholder — pending official policy
      </p>
      {children}
    </>
  );
}

const groups: { title: string; items: AccordionItem[] }[] = [
  {
    title: "Furnished living",
    items: [
      {
        id: "what-is",
        question: "What is a LuxeStay LA residence?",
        answer: (
          <p>
            A fully furnished apartment, loft or townhome in Los Angeles, prepared for temporary living. Residences are
            set up so you can arrive with a suitcase and settle in straight away.
          </p>
        ),
      },
      {
        id: "included",
        question: "What furniture and amenities are included?",
        answer: (
          <p>
            Each residence includes furniture, a fully equipped kitchen, linens and towels. Most include in-unit laundry
            and high-speed Wi-Fi, and many have a dedicated workspace. The exact furnishings and amenities are listed on
            each residence&rsquo;s page.
          </p>
        ),
      },
      {
        id: "who",
        question: "Who stays with LuxeStay LA?",
        answer: (
          <p>
            Professionals on assignment, corporate travelers, people relocating to Los Angeles, couples between homes,
            and anyone who wants the comfort of a real home for a temporary stay.
          </p>
        ),
      },
    ],
  },
  {
    title: "Stays, availability and pricing",
    items: [
      {
        id: "duration",
        question: "How long can I stay?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Stays are typically measured in months. Minimum stay lengths vary by residence and are shown on each
              listing where provided. Official minimum and maximum stay terms will be confirmed by LuxeStay LA.
            </p>
          </PolicyPlaceholder>
        ),
      },
      {
        id: "availability",
        question: "How do I check availability?",
        answer: (
          <p>
            Use the filters on the Residences page to search by move-in date, or open a residence to see its current
            availability. If you don&rsquo;t see what you need, send us an inquiry with your dates and we&rsquo;ll let
            you know what&rsquo;s coming up.
          </p>
        ),
      },
      {
        id: "pricing",
        question: "How is pricing determined?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Rates depend on the residence, the length of stay and the season. Where pricing is shown it is a starting
              monthly rate; your final rate is confirmed during leasing.
            </p>
          </PolicyPlaceholder>
        ),
      },
    ],
  },
  {
    title: "Leasing and payments",
    items: [
      {
        id: "process",
        question: "What does the leasing process involve?",
        answer: (
          <PolicyPlaceholder>
            <p>
              After you choose a residence, you&rsquo;ll complete an application through our official leasing process.
              This typically includes identity verification and screening. Detailed requirements will be published
              once confirmed.
            </p>
          </PolicyPlaceholder>
        ),
      },
      {
        id: "deposit",
        question: "Is a security deposit required? How do payments work?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Deposit amounts, accepted payment methods and payment schedules have not yet been published. They will be
              set out clearly in your lease before you commit.
            </p>
          </PolicyPlaceholder>
        ),
      },
      {
        id: "cancel",
        question: "What is the cancellation policy?",
        answer: (
          <PolicyPlaceholder>
            <p>Cancellation terms will be provided by LuxeStay LA and included in your lease agreement.</p>
          </PolicyPlaceholder>
        ),
      },
      {
        id: "extend",
        question: "Can I extend my stay?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Extensions are subject to availability. Contact our team as early as possible if your plans change, and
              we&rsquo;ll confirm what&rsquo;s possible.
            </p>
          </PolicyPlaceholder>
        ),
      },
    ],
  },
  {
    title: "During your stay",
    items: [
      {
        id: "maintenance",
        question: "What happens if something needs repair?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Residents can request maintenance through the resident support channel provided at move-in. Response
              times and emergency procedures will be confirmed in official resident guidance.
            </p>
          </PolicyPlaceholder>
        ),
      },
      {
        id: "support",
        question: "How do I reach resident support?",
        answer: (
          <PolicyPlaceholder>
            <p>
              Current residents can reach the team using the contact details provided at move-in, or through the
              contact form by choosing &ldquo;Current resident support&rdquo;.
            </p>
          </PolicyPlaceholder>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageIntro eyebrow="FAQ" title="Questions, answered.">
        <p>Everything you need to know about temporary living with LuxeStay LA.</p>
      </PageIntro>
      <Container className="pb-28 lg:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <PlaceholderNote className="lg:sticky lg:top-28">
              Answers marked &ldquo;Placeholder&rdquo; describe policies that have not yet been confirmed. They are
              general guidance only; your lease agreement governs.
            </PlaceholderNote>
          </div>
          <div className="space-y-16 lg:col-span-8 lg:col-start-5">
            {groups.map((g) => (
              <section key={g.title} aria-labelledby={`faq-${g.items[0].id}`}>
                <h2 id={`faq-${g.items[0].id}`} className="eyebrow mb-4 text-olive-ink">
                  {g.title}
                </h2>
                <Accordion items={g.items} />
              </section>
            ))}
            <div className="border border-line bg-paper p-8 sm:p-10">
              <h2 className="font-serif text-title">Still have a question?</h2>
              <p className="mt-3 leading-relaxed text-muted">Our team is happy to help with anything not covered here.</p>
              <ButtonLink href="/contact?type=general" arrow className="mt-6">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
