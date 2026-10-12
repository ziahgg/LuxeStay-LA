/**
 * Site-wide configuration.
 *
 * Contact details are intentionally NOT hard-coded: they are read from public
 * environment variables and render as clearly marked placeholders until the
 * client supplies verified information.
 */

export const site = {
  name: "LuxeStay LA",
  shortName: "LuxeStay",
  description:
    "Thoughtfully furnished apartments for temporary living in Los Angeles — for professionals, relocations and extended stays.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
    hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || null,
  },
  /** Official RentCafe / leasing portal, when the client provides one. */
  leasingPortalUrl: process.env.NEXT_PUBLIC_LEASING_PORTAL_URL || null,
} as const;

export const mainNav = [
  { href: "/residences", label: "Residences" },
  { href: "/experience", label: "The Experience" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/accessibility", label: "Accessibility" },
] as const;
