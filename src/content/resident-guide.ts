/**
 * Resident Guide content — edit this file to update the guide.
 *
 * Sections marked `pending: true` are placeholders awaiting official
 * information from property management. Never put building access codes,
 * Wi-Fi passwords or other credentials here: this file ships with the
 * application bundle. Unit-specific secrets belong in the property
 * management system and should be shown only through an authorised source.
 */

export interface GuideSection {
  id: string;
  title: string;
  intro?: string;
  items?: { title: string; body: string }[];
  pending?: boolean;
}

export const residentGuide: GuideSection[] = [
  {
    id: "move-in",
    title: "Move-in",
    intro: "A smooth first day starts with a little preparation.",
    items: [
      { title: "Before you arrive", body: "Confirm your arrival date and time with the leasing team, and make sure your lease documents are complete." },
      { title: "Keys and access", body: "Key and access device collection details are shared by the leasing team before your move-in date." },
      { title: "Condition checklist", body: "Walk through your residence on arrival and note anything that needs attention, so it's recorded from the start." },
      { title: "Settling in", body: "Your residence is furnished and equipped. If anything listed for your residence is missing, let the team know." },
    ],
  },
  {
    id: "access",
    title: "Building access",
    intro: "Building entry, visitor and delivery procedures will be published here by property management.",
    pending: true,
  },
  {
    id: "parking-amenities",
    title: "Parking & amenities",
    intro: "Parking assignments, guest parking and shared amenity hours vary by building. Your residence's amenities are listed under My Residence.",
    pending: true,
  },
  {
    id: "utilities",
    title: "Utilities & Wi-Fi",
    intro: "Utility arrangements and Wi-Fi connection details are provided by property management for your specific residence. For security, network passwords are never published in this guide.",
    pending: true,
  },
  {
    id: "guidelines",
    title: "Property guidelines",
    intro: "Official community guidelines — quiet hours, waste and recycling, smoking, pets and guests — will be published here once confirmed. Your lease agreement remains the governing document.",
    pending: true,
  },
  {
    id: "local",
    title: "Local recommendations",
    intro: "A few Los Angeles favorites to get you started.",
    items: [
      { title: "Griffith Observatory", body: "Sweeping views across the basin and the Hollywood Sign — especially beautiful around sunset." },
      { title: "The Getty Center", body: "Architecture, gardens and an art collection on a Brentwood hilltop." },
      { title: "Grand Central Market", body: "A downtown food hall with everything from breakfast to tacos." },
      { title: "The Beach Path", body: "Walk or cycle the coastal path between Santa Monica and Venice." },
      { title: "Neighborhood farmers markets", body: "Most neighborhoods host a weekly market — ask the team for the one closest to you." },
    ],
  },
];

export const residentFaq = [
  {
    id: "maintenance-emergency",
    question: "What counts as a maintenance emergency?",
    answer:
      "Issues that put people or property at risk — such as flooding, gas smells, fire, or a loss of power or heat — are emergencies. Contact building management by phone immediately rather than submitting an online request. Official emergency contact details will be provided by property management.",
  },
  {
    id: "rent",
    question: "How do I pay rent?",
    answer:
      "Payments are made through the official RentCafe resident portal. The dashboard links directly to it from the Payments page.",
  },
  {
    id: "extend",
    question: "Can I extend my stay?",
    answer:
      "Extensions depend on availability. Contact the team as early as possible and we'll confirm the options for your residence.",
  },
  {
    id: "guests",
    question: "Can I have guests stay with me?",
    answer:
      "Guest policies are set out in your lease agreement. Official community guidelines will also be published in this guide.",
  },
  {
    id: "move-out",
    question: "What happens at move-out?",
    answer:
      "The team will share move-out instructions ahead of your lease end date, including key return and the final inspection.",
  },
];
