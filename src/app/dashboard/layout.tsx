import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Resident Dashboard", template: "%s | Resident Dashboard | LuxeStay LA" },
  // Private area: never indexed.
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: LayoutProps<"/dashboard">) {
  return children;
}
