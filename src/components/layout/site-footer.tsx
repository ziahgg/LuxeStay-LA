import Link from "next/link";
import { legalNav, mainNav, site } from "@/lib/site";
import { Container } from "@/components/ui/layout";
import { Logo } from "./logo";
import { getDataSource } from "@/lib/properties/service";

export function SiteFooter() {
  const usingSample = getDataSource() === "sample";
  return (
    <footer className="focus-light bg-charcoal text-stone">
      <Container className="pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="LuxeStay LA — home" className="inline-block">
              <Logo tone="light" decorative className="h-14" />
            </Link>
            <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ivory">
              Furnished residences for temporary living in Los Angeles.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="eyebrow text-taupe">Explore</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-ivory hover:underline underline-offset-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-taupe">Legal</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-ivory hover:underline underline-offset-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="eyebrow text-taupe">Contact</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {site.contact.email ? (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="hover:text-ivory hover:underline underline-offset-4">
                      {site.contact.email}
                    </a>
                  </li>
                ) : null}
                {site.contact.phone ? (
                  <li>
                    <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-ivory hover:underline underline-offset-4">
                      {site.contact.phone}
                    </a>
                  </li>
                ) : null}
                <li>
                  <Link href="/contact" className="hover:text-ivory hover:underline underline-offset-4">
                    Send an inquiry
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-ivory hover:underline underline-offset-4">
                    Resident login
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs leading-relaxed text-taupe sm:flex-row sm:items-start sm:justify-between">
          <p>&copy; {site.name}. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            {usingSample
              ? "Development preview: residences, rates and availability shown are sample data, not live listings. "
              : ""}
            Photography is placeholder imagery from Unsplash and does not depict LuxeStay LA residences.
          </p>
        </div>
      </Container>
    </footer>
  );
}
