import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { Container, PlaceholderNote } from "@/components/ui/layout";
import { PageIntro } from "@/components/ui/page-intro";
import { INQUIRY_TYPES } from "@/lib/contact";
import { searchProperties } from "@/lib/properties/service";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the LuxeStay LA team about furnished residences, availability, corporate stays or resident support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage(props: PageProps<"/contact">) {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Let's plan your stay.">
        <p>
          Tell us about your dates and what you&rsquo;re looking for. Our team will reply with residences that fit, or
          answer any questions about leasing.
        </p>
      </PageIntro>

      <Container className="pb-28 lg:pb-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="h-[40rem] animate-pulse bg-stone-soft" aria-hidden="true" />}>
              <PrefilledForm searchParams={props.searchParams} />
            </Suspense>
          </div>

          <aside aria-labelledby="contact-details" className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10 lg:sticky lg:top-28">
              <div>
                <h2 id="contact-details" className="font-serif text-title">
                  Contact details
                </h2>
                <dl className="mt-6 space-y-5 text-[0.9375rem]">
                  <Detail label="Email">
                    {site.contact.email ? (
                      <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
                        {site.contact.email}
                      </a>
                    ) : (
                      <Pending>Email address to be provided</Pending>
                    )}
                  </Detail>
                  <Detail label="Phone">
                    {site.contact.phone ? (
                      <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="underline underline-offset-4">
                        {site.contact.phone}
                      </a>
                    ) : (
                      <Pending>Phone number to be provided</Pending>
                    )}
                  </Detail>
                  <Detail label="Hours">
                    {site.contact.hours ?? <Pending>Business hours to be provided</Pending>}
                  </Detail>
                </dl>
                {(!site.contact.email || !site.contact.phone) && (
                  <PlaceholderNote className="mt-6">
                    Contact details are placeholders and will be added once confirmed by LuxeStay LA.
                  </PlaceholderNote>
                )}
              </div>

              {site.leasingPortalUrl && (
                <div className="border-t border-line pt-8">
                  <h2 className="eyebrow text-olive-ink">Ready to apply?</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    Applications are handled through our{" "}
                    <a
                      href={site.leasingPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal underline underline-offset-4"
                    >
                      official leasing portal<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    .
                  </p>
                </div>
              )}

              <div className="border-t border-line pt-8">
                <h2 className="eyebrow text-olive-ink">Your privacy</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  We only use the information you share to respond to your inquiry. Please don&rsquo;t include
                  payment details or identification documents in this form.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

async function PrefilledForm({ searchParams }: Pick<PageProps<"/contact">, "searchParams">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const type = first(sp.type);
  const residence = first(sp.residence);
  const moveIn = first(sp.moveIn);

  const all = await searchProperties({ pageSize: 200 });
  const residences = all.ok
    ? all.data.items
        .map((p) => ({ slug: p.slug, name: p.name, neighborhood: p.neighborhood.name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <ContactForm
      residences={residences}
      defaults={{
        inquiryType: INQUIRY_TYPES.some((t) => t.value === type) ? type : undefined,
        residence: residences.some((r) => r.slug === residence) ? residence : undefined,
        moveIn: moveIn && /^\d{4}-\d{2}-\d{2}$/.test(moveIn) ? moveIn : undefined,
      }}
    />
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-5">
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

function Pending({ children }: { children: React.ReactNode }) {
  return <span className="text-muted italic">{children}</span>;
}
