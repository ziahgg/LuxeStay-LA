import Image from "next/image";
import Link from "next/link";
import type { Neighborhood } from "@/lib/properties/types";
import { photos } from "@/lib/images";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/layout";

export const benefits = [
  {
    title: "Thoughtfully furnished",
    body: "Considered interiors with quality beds, real kitchens and natural materials — everything you need from the first night.",
  },
  {
    title: "Convenient locations",
    body: "Residences in walkable Los Angeles neighborhoods, close to offices, studios, hospitals and the coast.",
  },
  {
    title: "Flexible temporary living",
    body: "Stays measured in weeks or months, with room to extend when plans change, subject to availability.",
  },
  {
    title: "Space to work and unwind",
    body: "Reliable Wi-Fi, dedicated desks in many residences, and living spaces made for slowing down in the evening.",
  },
  {
    title: "A streamlined leasing experience",
    body: "Clear information, responsive people and a straightforward path from inquiry to move-in.",
  },
];

export function ExperienceSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="experience-heading" className="py-24 lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                as={headingLevel}
                eyebrow="The LuxeStay Experience"
                title={<span id="experience-heading">Everything a home should be, ready when you arrive.</span>}
                intro="We look after the details of temporary living so the move feels less like a transition and more like settling in."
              />
              <div className="relative mt-12 hidden aspect-[4/5] overflow-hidden lg:block">
                <Image
                  src={photos.livingWarmLow.src}
                  alt={photos.livingWarmLow.alt}
                  fill
                  sizes="40vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {benefits.map((b, i) => (
              <li key={b.title} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-10 sm:grid-cols-[5rem_1fr]">
                <span aria-hidden="true" className="font-serif text-xl text-taupe-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-[1.875rem] leading-tight">{b.title}</h3>
                  <p className="mt-3 max-w-[48ch] leading-relaxed text-muted">{b.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export const steps = [
  {
    title: "Discover your residence",
    body: "Browse residences by neighborhood, size and timing, and compare the details that matter to you.",
  },
  {
    title: "Explore availability and leasing options",
    body: "Check dates and pricing, ask questions, and talk through the length of stay that suits your plans.",
  },
  {
    title: "Secure your stay and move in",
    body: "Complete the official leasing process, then arrive to a residence that's furnished and ready.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-stone-soft py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={<span id="how-heading">Three simple steps.</span>}
          align="center"
        />
        <ol className="mt-16 grid gap-px bg-line sm:grid-cols-3 lg:mt-20">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal bg-stone-soft px-2 py-10 sm:px-8 lg:px-12">
              <p aria-hidden="true" className="font-serif text-[4.5rem] leading-none text-taupe">
                {i + 1}
              </p>
              <h3 className="mt-6 font-serif text-[1.75rem] leading-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 text-center">
          <ButtonLink href="/residences" arrow>
            Explore Residences
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function NeighborhoodsSection({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  return (
    <section aria-labelledby="neighborhoods-heading" className="py-24 lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={photos.laPalmsSkyline.src}
                alt={photos.laPalmsSkyline.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={70}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 right-6 hidden w-[42%] border-8 border-ivory sm:block lg:-right-10">
              <div className="relative aspect-[3/4]">
                <Image
                  src={photos.laPalmsPink.src}
                  alt={photos.laPalmsPink.alt}
                  fill
                  sizes="20vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading
              eyebrow="Living in Los Angeles"
              title={<span id="neighborhoods-heading">Neighborhoods with a sense of place.</span>}
              intro="From the coast to the Eastside, our residences are chosen for walkability, character and easy access to the rest of the city."
            />
            {neighborhoods.length > 0 && (
              <ul className="mt-12 border-t border-line">
                {neighborhoods.slice(0, 6).map((n) => (
                  <li key={n.slug} className="border-b border-line">
                    <Link
                      href={`/residences?neighborhood=${n.slug}`}
                      className="group flex items-start justify-between gap-6 py-5"
                    >
                      <span>
                        <span className="block font-serif text-2xl transition-colors group-hover:text-olive-ink">
                          {n.name}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">{n.summary}</span>
                      </span>
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                        className="mt-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="focus-light relative overflow-hidden bg-charcoal text-ivory">
      <Image
        src={photos.laNight.src}
        alt=""
        fill
        sizes="100vw"
        quality={70}
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20" aria-hidden="true" />
      <Container className="relative py-28 text-center lg:py-40">
        <Eyebrow className="text-stone!">Begin your stay</Eyebrow>
        <h2 id="cta-heading" className="mx-auto mt-6 max-w-3xl font-serif text-headline">
          Your Los Angeles residence is waiting.
        </h2>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-stone">
          Explore available residences, or tell us about your plans and our team will help you find the right fit.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/residences" variant="light" size="lg" arrow>
            Explore Residences
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-light" size="lg">
            Contact Our Team
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
