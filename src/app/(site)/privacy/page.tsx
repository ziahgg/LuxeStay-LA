import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Placeholder privacy policy for the LuxeStay LA website, pending official text.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How the LuxeStay LA website handles personal information. Official policy text to be supplied."
      sections={[
        {
          heading: "Information we collect",
          body: (
            <p>
              [Placeholder] Describe the information collected through the website — for example, details submitted in
              the contact form (name, email, phone, inquiry details) and technical data such as device and usage
              information.
            </p>
          ),
        },
        {
          heading: "How we use information",
          body: <p>[Placeholder] Describe the purposes of processing, such as responding to inquiries and operating the website.</p>,
        },
        {
          heading: "Sharing and service providers",
          body: (
            <p>
              [Placeholder] Identify categories of service providers (e.g. hosting, property management and leasing
              systems, communications) and any other disclosures.
            </p>
          ),
        },
        {
          heading: "Cookies and analytics",
          body: <p>[Placeholder] Describe any cookies or analytics tools once confirmed with the client.</p>,
        },
        {
          heading: "Your choices and rights",
          body: (
            <p>
              [Placeholder] Describe applicable privacy rights (including any rights under California law) and how to
              exercise them.
            </p>
          ),
        },
        {
          heading: "Data retention and security",
          body: <p>[Placeholder] Describe retention periods and security practices.</p>,
        },
        {
          heading: "Contact",
          body: <p>[Placeholder] Provide the official privacy contact for LuxeStay LA.</p>,
        },
      ]}
    />
  );
}
