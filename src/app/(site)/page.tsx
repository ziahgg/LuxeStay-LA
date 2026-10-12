import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExperienceSection, FinalCta, HowItWorks, NeighborhoodsSection } from "@/components/home/sections";
import { DataUnavailable } from "@/components/residences/data-unavailable";
import { PropertyCard } from "@/components/residences/property-card";
import { StayFinder } from "@/components/residences/stay-finder";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/layout";
import { photos } from "@/lib/images";
import { getFeaturedProperties, getNeighborhoods } from "@/lib/properties/service";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, neighborhoodsResult] = await Promise.all([getFeaturedProperties(3), getNeighborhoods()]);
  const neighborhoods = neighborhoodsResult.ok ? neighborhoodsResult.data : [];

  return (
    <>
      {/* Hero — editorial layout: headline top-left, intro top-right, oversized wordmark along the base. */}
      <section aria-labelledby="hero-heading">
        <div className="focus-light relative flex h-svh min-h-[640px] flex-col overflow-hidden bg-charcoal text-ivory lg:max-h-[1080px]">
          <Image
            src={photos.archResidences.src}
            alt={photos.archResidences.alt}
            fill
            sizes="100vw"
            quality={80}
            preload
            className="object-cover saturate-[0.72]"
          />
          {/* Scrims: an overall tone to mute the photo, plus top (headline) and bottom (wordmark) gradients. */}
          <div aria-hidden="true" className="absolute inset-0 bg-charcoal/25" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,36,33,0.6)_0%,rgba(36,36,33,0.35)_32%,rgba(36,36,33,0.05)_58%,rgba(36,36,33,0.45)_82%,rgba(36,36,33,0.7)_100%)]"
          />

          <Container className="relative flex flex-1 flex-col pt-28 pb-[5vw] lg:pt-36">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h1
                id="hero-heading"
                className="animate-fade-up font-sans text-[clamp(2.125rem,1.4rem+3vw,4rem)] leading-[1.08] font-light tracking-[-0.02em] lg:col-span-7"
              >
                A Better Way to Stay in Los&nbsp;Angeles.
              </h1>
              <div className="max-w-sm animate-fade-up [text-shadow:0_1px_14px_rgba(36,36,33,0.55)] [animation-delay:150ms] lg:col-span-4 lg:col-start-9 lg:pt-2">
                <p className="text-[0.9375rem] leading-relaxed text-ivory/90">
                  Thoughtfully furnished apartments for temporary living — close to the city&rsquo;s best
                  neighborhoods, made for comfort and everyday convenience.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
                  <Link
                    href="/residences"
                    className="border-b border-ivory/70 pb-1 transition-colors hover:border-ivory hover:text-stone"
                  >
                    Explore Residences
                  </Link>
                  <Link
                    href="#find-your-stay"
                    className="border-b border-ivory/40 pb-1 text-ivory/90 transition-colors hover:border-ivory hover:text-ivory"
                  >
                    Find Your Stay
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative wordmark from the official logo; the brand name is already announced by the header link. */}
            <Image
              src="/brand/luxestay-wordmark-light.svg"
              alt=""
              width={2962}
              height={768}
              unoptimized
              className="mt-auto h-auto w-full animate-fade-up select-none [animation-delay:300ms] sm:w-[82%] lg:w-[72%]"
            />
          </Container>
        </div>

        <Container className="relative z-10 pt-10 lg:pt-14">
          <div id="find-your-stay" className="scroll-mt-28">
            <h2 className="sr-only">Find your stay</h2>
            <StayFinder neighborhoods={neighborhoods} />
          </div>
        </Container>
      </section>

      {/* Brand statement */}
      <section aria-label="Introduction" className="pt-24 pb-8 lg:pt-36">
        <Container>
          <p className="reveal mx-auto max-w-5xl text-center font-serif text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.2] text-charcoal">
            Residences chosen for their light, their neighborhoods and the way they feel to come home to —
            furnished with care, and ready <em className="text-olive-ink">for however long you need</em>.
          </p>
        </Container>
      </section>

      {/* Featured residences */}
      <section aria-labelledby="featured-heading" className="py-24 lg:py-32">
        <Container>
          <div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured residences"
              title={<span id="featured-heading">Curated homes across the city.</span>}
            />
            <ButtonLink href="/residences" variant="secondary" arrow className="shrink-0 self-start sm:self-auto">
              View All Residences
            </ButtonLink>
          </div>
          {featured.ok ? (
            featured.data.length > 0 ? (
              <ul className="grid gap-x-8 gap-y-16 md:grid-cols-3">
                {featured.data.map((p, i) => (
                  <li key={p.id} className={`reveal ${i === 1 ? "md:mt-16" : ""}`}>
                    <PropertyCard property={p} sizes="(min-width: 768px) 30vw, 100vw" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">New residences are coming soon.</p>
            )
          ) : (
            <DataUnavailable message={featured.message} compact />
          )}
        </Container>
      </section>

      <ExperienceSection />

      <NeighborhoodsSection neighborhoods={neighborhoods} />

      <HowItWorks />

      {/* Brand story */}
      <section aria-labelledby="story-heading" className="py-24 lg:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="grid grid-cols-5 gap-4 lg:col-span-6">
              <div className="relative col-span-3 aspect-[3/4] overflow-hidden">
                <Image
                  src={photos.bedroomGarden.src}
                  alt={photos.bedroomGarden.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
              <div className="relative col-span-2 mt-20 aspect-[3/4] overflow-hidden">
                <Image
                  src={photos.detailShelf.src}
                  alt={photos.detailShelf.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <SectionHeading
                eyebrow="Our philosophy"
                title={<span id="story-heading">Temporary should never mean compromise.</span>}
              />
              <div className="prose-editorial mt-8">
                <p>
                  LuxeStay LA began with a simple observation: people in transition deserve the same comfort as people
                  who are settled. A new job, a relocation or a long project shouldn&rsquo;t mean months in a hotel room
                  or an apartment that never feels like yours.
                </p>
                <p>
                  So we focus on the fundamentals — good light, good beds, real kitchens, quiet places to work — in
                  neighborhoods you&rsquo;ll actually enjoy living in.
                </p>
              </div>
              <ButtonLink href="/about" variant="text" arrow className="mt-10">
                Read our story
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
