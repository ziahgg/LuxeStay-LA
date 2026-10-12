import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceSection, FinalCta, HowItWorks, NeighborhoodsSection } from "@/components/home/sections";
import { Container, SectionHeading } from "@/components/ui/layout";
import { PageIntro } from "@/components/ui/page-intro";
import { photos } from "@/lib/images";
import { getNeighborhoods } from "@/lib/properties/service";

export const metadata: Metadata = {
  title: "The Experience",
  description:
    "What it's like to stay with LuxeStay LA: thoughtfully furnished residences, convenient Los Angeles neighborhoods, flexible stays and a straightforward leasing process.",
  alternates: { canonical: "/experience" },
};

const included = [
  {
    title: "The kitchen",
    image: photos.kitchenBrass,
    items: ["Cookware, knives and utensils", "Dinnerware and glassware", "Coffee maker and kettle", "Full-size appliances"],
  },
  {
    title: "The bedroom",
    image: photos.bedroomBright,
    items: ["Quality mattress and bedding", "Fresh linens and towels", "Wardrobe storage", "Window coverings"],
  },
  {
    title: "Working from home",
    image: photos.workspace,
    items: ["High-speed Wi-Fi", "Desk and task chair in many residences", "Good natural light", "Quiet spaces to focus"],
  },
];

export default async function ExperiencePage() {
  const neighborhoods = await getNeighborhoods();

  return (
    <>
      <PageIntro eyebrow="The Experience" title="Settled in from the first evening.">
        <p>
          Every LuxeStay LA residence is prepared so that arriving feels simple — and staying feels like living, not
          waiting.
        </p>
      </PageIntro>

      <Container>
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
          <Image
            src={photos.livingGalleryWall.src}
            alt={photos.livingGalleryWall.alt}
            fill
            sizes="100vw"
            quality={80}
            preload
            className="object-cover"
          />
        </div>
      </Container>

      <ExperienceSection />

      <section aria-labelledby="included" className="bg-stone-soft py-24 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow="What's included"
            title={<span id="included">Ready for real life.</span>}
            intro="Typical inclusions are listed below. Each residence page details its own furnishings and amenities."
          />
          <ul className="mt-16 grid gap-12 md:grid-cols-3">
            {included.map((group) => (
              <li key={group.title} className="reveal">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={group.image.src}
                    alt={group.image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    quality={70}
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-7 font-serif text-[1.875rem]">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-muted">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-4 bg-olive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <NeighborhoodsSection neighborhoods={neighborhoods.ok ? neighborhoods.data : []} />

      <HowItWorks />

      <FinalCta />
    </>
  );
}
