import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Placeholder terms of use for the LuxeStay LA website, pending official text.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms governing use of the LuxeStay LA website. Official terms to be supplied."
      sections={[
        {
          heading: "Use of this website",
          body: <p>[Placeholder] Describe acceptable use of the website and its content.</p>,
        },
        {
          heading: "Listings, pricing and availability",
          body: (
            <p>
              [Placeholder] Clarify that residence information, rates and availability are subject to change and are
              confirmed only through the official leasing process and a signed lease.
            </p>
          ),
        },
        {
          heading: "Third-party services",
          body: (
            <p>
              [Placeholder] Address links to third-party services, such as the official leasing portal, which are
              governed by their own terms.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: <p>[Placeholder] Describe ownership of website content, branding and imagery.</p>,
        },
        {
          heading: "Disclaimers and limitation of liability",
          body: <p>[Placeholder] To be drafted by counsel.</p>,
        },
        {
          heading: "Changes to these terms",
          body: <p>[Placeholder] Describe how and when these terms may be updated.</p>,
        },
      ]}
    />
  );
}
