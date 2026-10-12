import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/layout";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  // Rendered under the root layout (outside the (site) group), so it brings its own chrome.
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="pt-36 pb-28 lg:pt-48 lg:pb-36">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Eyebrow>404 · Page not found</Eyebrow>
              <h1 className="mt-6 font-serif text-display font-normal">This door doesn&rsquo;t lead anywhere.</h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                The page you&rsquo;re looking for may have moved, or the residence may no longer be listed.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/residences" arrow>
                  Explore Residences
                </ButtonLink>
                <ButtonLink href="/" variant="secondary">
                  Return Home
                </ButtonLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:col-start-8">
              <Image
                src={photos.laPalmStreet.src}
                alt={photos.laPalmStreet.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={70}
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
