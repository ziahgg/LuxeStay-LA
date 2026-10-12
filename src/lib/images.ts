import type { PropertyImage } from "@/lib/properties/types";

/**
 * Placeholder photography registry.
 *
 * All images are Unsplash photographs used for development only. They are not
 * photographs of LuxeStay LA residences and must be replaced with the client's
 * own property photography (or images from the property management system)
 * before launch. Alt text describes what is actually in each photograph.
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

function img(id: string, alt: string, width = 2400, height = 1600): PropertyImage {
  return { src: unsplash(id), alt, width, height };
}

export const photos = {
  // Living spaces
  livingWoodWall: img(
    "1600607687939-ce8a6c25118c",
    "Sunlit open-plan living room with a pale sofa, walnut feature wall and a kitchen beyond",
  ),
  livingGalleryWall: img(
    "1600210492486-724fe5c67fb0",
    "Bright living room with leather sofa, linen armchairs and a framed gallery wall",
  ),
  livingWarmLow: img(
    "1618221195710-dd6b41faaea6",
    "Warm living room with a low grey sofa, leather ottomans and clerestory windows",
  ),
  livingCream: img(
    "1631679706909-1844bbd07221",
    "Calm cream living room with a curved armchair, woven mirrors and soft lighting",
  ),
  livingSkylight: img(
    "1567767292278-a4f21aa2d36e",
    "Airy living room with tall windows, a grey sofa, glass coffee table and abstract art",
  ),
  livingLeather: img(
    "1554995207-c18c203602cb",
    "Open living room with a cognac leather sofa and sage accent wall",
  ),
  livingPool: img(
    "1600573472550-8090b5e0745e",
    "Glass-walled living space opening onto a pool terrace with a floating staircase",
  ),
  livingDusk: img(
    "1564078516393-cf04bd966897",
    "Double-height living room at dusk with a cream sectional and city-view windows",
  ),
  livingStairs: img(
    "1600566753086-00f18fb6b3ea",
    "Contemporary living room with blue cushions, timber staircase and a dog resting on the rug",
  ),
  livingSage: img(
    "1615529182904-14819c35db37",
    "Sage-green living room with rattan pendants, a grey sofa and abundant plants",
  ),
  livingNeutral: img(
    "1616486338812-3dadae4b4ace",
    "Neutral living room with a cream sectional, round coffee table and woven wall decor",
  ),
  livingArt: img(
    "1600210491369-e753d80a41f3",
    "Minimal living room with a white sofa, brass floor lamp and black-and-white artwork",
  ),
  livingPlants: img(
    "1502672260266-1c1ef2d93688",
    "Plant-filled studio living area with a grey sofa and mid-century dining chairs",
  ),
  livingLoft: img(
    "1501183638710-841dd1904471",
    "Loft living room with exposed timber trusses, a grey sectional and a fireplace",
  ),
  livingBay: img(
    "1560448204-e02f11c3d0e2",
    "Corner living room with neutral armchairs, a fireplace and wraparound windows",
  ),
  livingHerringbone: img(
    "1493809842364-78817add7ffb",
    "Light-filled living room with herringbone floors and a blue velvet sofa",
  ),
  livingBeams: img(
    "1600210491892-03d54c0aaf87",
    "Living room with exposed wood beams, arched black windows and a white fireplace",
  ),

  // Kitchens & dining
  kitchenIsland: img(
    "1600585152220-90363fe7e115",
    "White kitchen with a waterfall island, oak cabinetry and four timber stools",
  ),
  kitchenBlack: img(
    "1484154218962-a197022b5858",
    "Bright kitchen with white cabinets, black pendant lights and bar stools",
  ),
  kitchenCharcoal: img(
    "1600489000022-c2086d79f9d4",
    "Kitchen with charcoal cabinets, open timber shelving and a window over the sink",
  ),
  kitchenMarble: img(
    "1556912173-3bb406ef7e77",
    "Classic white kitchen with marble island and professional range",
  ),
  kitchenBrass: img(
    "1565538810643-b5bdb714032a",
    "Kitchen counter with a brass faucet, fresh herbs and taupe cabinetry",
  ),
  kitchenCitrus: img(
    "1556911220-bff31c812dba",
    "White kitchen counter with lemons, fresh vegetables and a built-in oven",
  ),
  dining: img(
    "1617806118233-18e1de247200",
    "Dining area with green velvet chairs, a white table and a round mirror",
  ),

  // Bedrooms
  bedroomBright: img(
    "1595526114035-0d45ed16cfbf",
    "Bright bedroom with white linens, grey bench and a window with natural light",
  ),
  bedroomBoho: img(
    "1615874959474-d609969a20ed",
    "Bedroom with layered linens, rattan pendant and a wall of framed botanical prints",
  ),
  bedroomVelvet: img(
    "1616594039964-ae9021a400a0",
    "Bedroom with a channel-tufted headboard, brass chandelier and floor-to-ceiling drapes",
  ),
  bedroomClassic: img(
    "1505693416388-ac5ce068fe85",
    "Classic bedroom with an upholstered headboard, bedside lamps and tufted bench",
  ),
  bedroomNavy: img(
    "1522771739844-6a9f6d5f14af",
    "Bedroom corner with white bedding, navy cushions and an oak nightstand lamp",
  ),
  bedroomGarden: img(
    "1600607687644-c7171b42498f",
    "Minimal bedroom with grey linens and black-framed doors opening to greenery",
  ),
  bedroomDark: img(
    "1617104678098-de229db51175",
    "Bedroom with a dark feature wall, grey bedding and tall windows onto trees",
  ),
  bedroomWarm: img(
    "1611892440504-42a792e24d32",
    "Warmly lit bedroom with timber panelling, a low bed and doors to a garden",
  ),
  bedroomCity: img(
    "1631049307264-da0ec9d70304",
    "Hotel-style bedroom with a padded headboard, bedside lamps and city views",
  ),
  bedroomPlants: img(
    "1571508601891-ca5e7a713859",
    "Cosy bedroom with patterned cushions, framed prints and potted plants",
  ),

  // Bathrooms & work
  bathShower: img(
    "1584622650111-993a426fbf0a",
    "Bathroom with a frameless glass shower, long vanity and large mirror",
  ),
  bathTub: img(
    "1620626011761-996317b8d101",
    "White bathroom with a freestanding tub, vessel basin and a tall window",
  ),
  bathModern: img(
    "1600566752355-35792bedcfea",
    "Modern bathroom with a freestanding tub, dark vanity and clerestory window",
  ),
  workspace: img(
    "1600494603989-9650cf6ddd3d",
    "Home office with a green wall, desk, ergonomic chair and garden view",
  ),
  workDesk: img(
    "1593062096033-9a26b09da705",
    "Laptop on a timber desk under a warm pendant light",
  ),

  // Details
  detailChair: img(
    "1586023492125-27b2c045efd7",
    "Mustard armchair beside a brass floor lamp and framed print",
  ),
  detailShelf: img(
    "1594026112284-02bb6f3352fe",
    "Floating oak shelves with ceramics and plants above a white console",
  ),

  // Los Angeles
  laPalmsSkyline: img(
    "1597982087634-9884f03198ce",
    "Palm-lined road at sunset with the downtown Los Angeles skyline in the distance",
  ),
  laSunset: img(
    "1515896769750-31548aa180ed",
    "Los Angeles skyline and silhouetted palm trees beneath a pink sunset sky",
  ),
  laNight: img(
    "1444723121867-7a241cacace9",
    "Los Angeles basin glittering at night beneath a deep blue sky",
  ),
  laPalmsPink: img(
    "1503891450247-ee5f8ec46dc3",
    "Tall palm trees silhouetted against a pastel Los Angeles evening sky",
  ),
  laPalmStreet: img(
    "1580655653885-65763b2597d0",
    "Street lined with towering palms against a vivid red evening sky",
  ),
  laHollywood: img(
    "1534190760961-74e8c1c5c3da",
    "The Hollywood Sign overlooking Los Angeles at sunset",
  ),
  laDowntown: img(
    "1544413660-299165566b1d",
    "Downtown Los Angeles skyline on a clear, hazy day",
  ),

  // Architecture
  archResidences: img(
    "1580041065738-e72023775cdc",
    "Low-rise residential building with planted balconies, mature trees and a landscaped pool courtyard",
  ),
  archTimber: img(
    "1600585154340-be6161a56a0c",
    "Contemporary home with timber-clad volumes and glowing windows beneath a mature tree",
  ),
  archPoolWhite: img(
    "1512917774080-9991f1c4c750",
    "White modernist house with a pool, palms and a sunny terrace",
  ),
} satisfies Record<string, PropertyImage>;

export type PhotoKey = keyof typeof photos;
