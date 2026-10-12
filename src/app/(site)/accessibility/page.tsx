import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Placeholder accessibility statement for the LuxeStay LA website, pending official text.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      intro="Our approach to making this website usable for everyone. Official statement to be supplied."
      sections={[
        {
          heading: "Our goal",
          body: (
            <p>
              This website has been designed and built with the aim of meeting the Web Content Accessibility Guidelines
              (WCAG) 2.2 at Level AA. [Placeholder] The official conformance statement should be confirmed after an
              independent accessibility review.
            </p>
          ),
        },
        {
          heading: "Measures taken during development",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Semantic page structure with a logical heading order and landmark regions.</li>
              <li>Keyboard access to navigation, filters, galleries, forms and accordions, with visible focus.</li>
              <li>Text and interface colors chosen to meet AA contrast ratios.</li>
              <li>Descriptive alternative text for meaningful images.</li>
              <li>Form fields with labels, clear error messages and an error summary.</li>
              <li>Animations reduced or removed when your device requests reduced motion.</li>
            </ul>
          ),
        },
        {
          heading: "Known limitations",
          body: (
            <p>
              [Placeholder] List any known issues, including third-party services such as the external leasing portal,
              which are outside the control of this website.
            </p>
          ),
        },
        {
          heading: "Feedback",
          body: (
            <p>
              If you have difficulty using any part of this website, please{" "}
              <Link href="/contact?type=general" className="text-charcoal underline underline-offset-4">
                contact us
              </Link>{" "}
              and we&rsquo;ll help. [Placeholder] Add a target response time once confirmed.
            </p>
          ),
        },
      ]}
    />
  );
}
