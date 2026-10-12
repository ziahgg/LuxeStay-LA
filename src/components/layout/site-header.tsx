"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const overlayRoute = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const transparent = overlayRoute && !scrolled;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ease-out-soft ${
        transparent
          ? "focus-light bg-transparent text-ivory"
          : "bg-ivory/95 text-charcoal shadow-[0_1px_0_var(--color-line)] backdrop-blur supports-[backdrop-filter]:bg-ivory/85"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-22 lg:px-12">
        <Link href="/" aria-label="LuxeStay LA — home" className="shrink-0">
          {/* Ivory logo over the home hero, charcoal everywhere else. */}
          <Logo tone="light" decorative priority className={`h-10 lg:h-12 ${transparent ? "" : "hidden"}`} />
          <Logo tone="dark" decorative priority className={`h-10 lg:h-12 ${transparent ? "hidden" : ""}`} />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative py-2 text-[0.8125rem] font-medium tracking-[0.06em] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Link
              href="/residences"
              className={buttonClasses(transparent ? "outline-light" : "primary", "md", "min-h-11! px-5!")}
            >
              Find Your Stay
            </Link>
          </div>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            <svg aria-hidden="true" width="24" height="14" viewBox="0 0 24 14" fill="none">
              <path d="M0 1h24M0 7h24M8 13h16" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-ivory p-0 text-charcoal backdrop:bg-charcoal/40 backdrop:backdrop-blur-sm open:animate-[drawer-in_0.45s_var(--ease-out-soft)]"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex h-full flex-col px-6 pb-8">
          <div className="flex h-18 items-center justify-between">
            <Logo tone="dark" className="h-9" />
            <button
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
              aria-label="Close menu"
              onClick={() => dialogRef.current?.close()}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1l14 14M15 1 1 15" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {[{ href: "/", label: "Home" }, ...mainNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                    onClick={() => dialogRef.current?.close()}
                    className="block border-b border-line py-4 font-serif text-[2rem] leading-tight aria-[current=page]:text-olive-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/residences"
            onClick={() => dialogRef.current?.close()}
            className={buttonClasses("primary", "lg", "w-full")}
          >
            Find Your Stay
          </Link>
        </div>
      </dialog>
    </header>
  );
}
