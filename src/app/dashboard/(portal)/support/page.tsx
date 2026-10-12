import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { DashboardHeader, Loading, Panel, PanelSkeleton } from "@/components/dashboard/ui";
import { Accordion } from "@/components/ui/accordion";
import { PlaceholderNote } from "@/components/ui/layout";
import { residentFaq } from "@/content/resident-guide";
import { requireResident } from "@/lib/auth/dal";
import { residentPortalUrl } from "@/lib/resident/config";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Help & Support" };

export default function SupportPage() {
  const contactMissing = !site.contact.email || !site.contact.phone;
  return (
    <>
      <DashboardHeader
        eyebrow="Help & Support"
        title="How can we help?"
        description="Send the team a message, or find quick answers below."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Send a message" className="lg:col-span-2">
          <Suspense
            fallback={
              <Loading label="Loading form">
                <PanelSkeleton lines={6} className="border-0 p-0!" />
              </Loading>
            }
          >
            <SupportForm />
          </Suspense>
        </Panel>

        <div className="space-y-6">
          <Panel title="Contact">
            <dl className="space-y-4 text-[0.9375rem]">
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="mt-1">
                  {site.contact.email ? (
                    <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
                      {site.contact.email}
                    </a>
                  ) : (
                    <span className="text-muted italic">To be provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd className="mt-1">
                  {site.contact.phone ? (
                    <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="underline underline-offset-4">
                      {site.contact.phone}
                    </a>
                  ) : (
                    <span className="text-muted italic">To be provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Hours</dt>
                <dd className="mt-1">{site.contact.hours ?? <span className="text-muted italic">To be provided</span>}</dd>
              </div>
            </dl>
            {contactMissing && (
              <PlaceholderNote className="mt-6">
                Property management contact details will be added once confirmed by LuxeStay LA.
              </PlaceholderNote>
            )}
          </Panel>

          <Panel title="Resident portal">
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              Payments, maintenance and lease documents are also available in the official RentCafe portal.
            </p>
            {residentPortalUrl ? (
              <a
                href={residentPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Open resident portal<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <p className="mt-4 text-sm text-muted italic">Portal link to be provided.</p>
            )}
          </Panel>
        </div>
      </div>

      <section aria-labelledby="support-faq" className="mt-14 max-w-3xl">
        <h2 id="support-faq" className="mb-4 font-serif text-title">
          Common questions
        </h2>
        <Accordion items={residentFaq.map((f) => ({ id: f.id, question: f.question, answer: <p>{f.answer}</p> }))} />
      </section>
    </>
  );
}

async function SupportForm() {
  const resident = await requireResident("/dashboard/support");
  return (
    <ContactForm
      residences={[]}
      defaults={{
        inquiryType: "resident",
        name: `${resident.firstName} ${resident.lastName}`,
        email: resident.email,
      }}
    />
  );
}
