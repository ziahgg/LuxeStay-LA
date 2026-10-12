import type { Metadata } from "next";
import Image from "next/image";
import { FinalCta } from "@/components/home/sections";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/layout";
import { PageIntro } from "@/components/ui/page-intro";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "The LuxeStay LA philosophy: comfortable, well-located furnished residences that make temporary living in Los Angeles feel like home.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Comfort first",
    body: "Good mattresses, soft linens, blackout shades, quiet spaces. The fundamentals of rest come before anything decorative.",
  },
  {
    title: "Convenience by design",
    body: "Residences arrive ready: kitchens equipped, Wi-Fi connected, laundry in-unit where possible. Less to arrange, more time to settle in.",
  },
  {
    title: "Quality you can feel",
    body: "Natural materials, considered layouts and furniture chosen to be lived with — not just photographed.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About LuxeStay LA" title="Temporary living, made to feel like home.">
        <p>
          We create furnished residences for people whose lives are in motion — and who would rather not put comfort on
          hold while they&rsquo;re in transition.
        </p>
      </PageIntro>

      <Container>
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
          <Image
            src={photos.livingNeutral.src}
            alt={photos.livingNeutral.alt}
            fill
            sizes="100vw"
            quality={80}
            preload
            className="object-cover"
          />
        </div>
      </Container>

      <section aria-labelledby="philosophy" className="py-24 lg:py-36">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Our philosophy</Eyebrow>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <h2 id="philosophy" className="font-serif text-headline">
                A good home changes how a new city feels.
              </h2>
              <div className="prose-editorial mt-8">
                <p>
                  Moving for work, waiting for a home to be ready, or spending a season in Los Angeles — these are
                  moments when the right place to live matters most. Hotels are built for nights; long-term rentals are
                  built for years. LuxeStay LA is built for the space in between.
                </p>
                <p>
                  We choose residences for their light, their layouts and their neighborhoods, then furnish them with
                  the same care we&rsquo;d want in our own homes. The result is somewhere you can work well, rest well
                  and genuinely live — for a month or for a season.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="why-furnished" className="bg-stone-soft py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
              <Image
                src={photos.kitchenIsland.src}
                alt={photos.kitchenIsland.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={70}
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <SectionHeading
                eyebrow="Why furnished living"
                title={<span id="why-furnished">The ease of a hotel. The space of a home.</span>}
              />
              <ul className="mt-10 space-y-6">
                {[
                  ["Move in with a suitcase", "No furniture to buy, deliver or store — and nothing to sell when you leave."],
                  ["Room to live properly", "Separate spaces to sleep, cook, work and unwind, rather than a single room."],
                  ["Flexibility for changing plans", "Stays shaped around projects, relocations and life's in-between moments."],
                  ["A neighborhood, not a lobby", "Live among locals, with cafés, parks and markets on your doorstep."],
                ].map(([title, body]) => (
                  <li key={title} className="reveal border-t border-line pt-6">
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="approach" className="py-24 lg:py-36">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            title={<span id="approach">Comfort, convenience and quality.</span>}
            align="center"
          />
          <ul className="mt-16 grid gap-12 md:grid-cols-3 lg:mt-20">
            {principles.map((p, i) => (
              <li key={p.title} className="reveal">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={[photos.bedroomCity, photos.workspace, photos.detailChair][i].src}
                    alt={[photos.bedroomCity, photos.workspace, photos.detailChair][i].alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    quality={70}
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-8 font-serif text-[1.875rem]">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="expect" className="border-t border-line py-24 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="What to expect" title={<span id="expect">From first inquiry to move-out.</span>} />
            </div>
            <ol className="lg:col-span-6 lg:col-start-7">
              {[
                ["Before you arrive", "Clear information about your residence, your lease and how to get in touch."],
                ["On arrival", "A clean, prepared residence with everything in place for your first evening."],
                ["During your stay", "A responsive team for questions and maintenance, so small issues stay small."],
                ["When plans change", "Honest conversations about extensions or move-out timing, subject to availability."],
              ].map(([title, body], i) => (
                <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7">
                  <span aria-hidden="true" className="font-serif text-xl text-taupe-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
