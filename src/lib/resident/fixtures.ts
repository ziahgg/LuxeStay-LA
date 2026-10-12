import "server-only";
import type { ResidentDataAdapter } from "./adapter";
import type {
  Announcement,
  MaintenanceRequest,
  Residence,
  ResidentDocument,
  ResidentProfile,
} from "./types";

/**
 * DEVELOPMENT FIXTURES — FICTIONAL TEST DATA ONLY.
 *
 * Two fictional residents exist so that authorisation (resident A must never
 * see resident B's records) can be exercised end to end. Emails use the
 * reserved `.test` domain. There is deliberately NO payment data: financial
 * records are never fabricated, so the Payments page always shows the portal
 * fallback until a verified integration exists.
 */

export const FIXTURE_RESIDENTS: (ResidentProfile & { residence: Residence })[] = [
  {
    id: "fx-resident-a",
    firstName: "Avery",
    lastName: "Sample",
    email: "resident.a@example.test",
    residence: {
      propertyName: "Marisol",
      propertySlug: "marisol-santa-monica",
      neighborhood: "Santa Monica",
      unit: "204",
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["In-unit washer and dryer", "High-speed Wi-Fi", "Assigned parking (one space)", "Bicycle storage"],
      moveInDate: "2026-09-01",
      leaseStartDate: "2026-09-01",
      leaseEndDate: "2026-12-31",
      leaseStatus: "active",
      moveInNotes: [
        "Collect keys and access devices from the leasing team on move-in day.",
        "Complete the move-in condition checklist within 72 hours.",
      ],
    },
  },
  {
    id: "fx-resident-b",
    firstName: "Jordan",
    lastName: "Sample",
    email: "resident.b@example.test",
    residence: {
      propertyName: "Foundry Loft",
      propertySlug: "foundry-loft-arts-district",
      neighborhood: "Arts District",
      unit: "3B",
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["Rooftop terrace", "High-speed Wi-Fi", "Secure entry"],
      moveInDate: "2026-10-01",
      leaseStartDate: "2026-10-01",
      leaseEndDate: "2027-03-31",
      leaseStatus: "active",
    },
  },
];

const announcementsByProperty: Record<string, Announcement[]> = {
  "marisol-santa-monica": [
    {
      id: "fx-ann-1",
      title: "Window cleaning scheduled",
      body: "Exterior window cleaning is planned for the building next week. Please keep balcony doors closed during the visit.",
      publishedAt: "2026-10-08",
      priority: "important",
    },
    {
      id: "fx-ann-2",
      title: "Bicycle storage update",
      body: "Bicycle storage is being reorganized. Untagged bicycles will be relocated to the secondary rack.",
      publishedAt: "2026-09-28",
    },
  ],
  "foundry-loft-arts-district": [
    {
      id: "fx-ann-3",
      title: "Rooftop terrace hours",
      body: "The rooftop terrace closes at 10 pm on weeknights out of respect for neighbors.",
      publishedAt: "2026-10-02",
    },
  ],
};

const seedRequests: MaintenanceRequest[] = [
  {
    id: "fx-req-1001",
    residentId: "fx-resident-a",
    category: "plumbing",
    title: "Kitchen sink draining slowly",
    description: "Water takes several minutes to drain from the kitchen sink.",
    status: "scheduled",
    submittedAt: "2026-10-06T16:20:00Z",
    updatedAt: "2026-10-07T09:05:00Z",
    permissionToEnter: true,
    history: [
      { at: "2026-10-06T16:20:00Z", status: "submitted" },
      { at: "2026-10-07T09:05:00Z", status: "scheduled", note: "Technician visit scheduled for a weekday morning." },
    ],
  },
  {
    id: "fx-req-1002",
    residentId: "fx-resident-a",
    category: "appliances",
    title: "Dishwasher not starting",
    description: "Dishwasher display lights up but the cycle does not start.",
    status: "completed",
    submittedAt: "2026-09-14T18:00:00Z",
    updatedAt: "2026-09-16T13:30:00Z",
    permissionToEnter: true,
    history: [
      { at: "2026-09-14T18:00:00Z", status: "submitted" },
      { at: "2026-09-15T10:00:00Z", status: "in-progress" },
      { at: "2026-09-16T13:30:00Z", status: "completed", note: "Door latch replaced." },
    ],
  },
  {
    id: "fx-req-2001",
    residentId: "fx-resident-b",
    category: "electrical",
    title: "Bedroom outlet not working",
    description: "The outlet beside the bed has no power.",
    status: "submitted",
    submittedAt: "2026-10-10T08:45:00Z",
    updatedAt: "2026-10-10T08:45:00Z",
    permissionToEnter: false,
    history: [{ at: "2026-10-10T08:45:00Z", status: "submitted" }],
  },
];

const documents: ResidentDocument[] = [
  {
    id: "fx-doc-a1",
    residentId: "fx-resident-a",
    label: "Residential lease agreement",
    category: "lease",
    issuedAt: "2026-08-20",
    contentType: "text/plain; charset=utf-8",
    fileName: "lease-agreement-fixture.txt",
  },
  {
    id: "fx-doc-a2",
    residentId: "fx-resident-a",
    label: "Move-in condition checklist",
    category: "move-in",
    issuedAt: "2026-09-01",
    contentType: "text/plain; charset=utf-8",
    fileName: "move-in-checklist-fixture.txt",
  },
  {
    id: "fx-doc-b1",
    residentId: "fx-resident-b",
    label: "Residential lease agreement",
    category: "lease",
    issuedAt: "2026-09-22",
    contentType: "text/plain; charset=utf-8",
    fileName: "lease-agreement-fixture.txt",
  },
];

// Requests created during development live in memory only (lost on restart).
const store = globalThis as typeof globalThis & { __lsFixtureRequests?: MaintenanceRequest[] };
const createdRequests = (store.__lsFixtureRequests ??= []);

const allRequests = () => [...createdRequests, ...seedRequests];
const findResident = (id: string) => FIXTURE_RESIDENTS.find((r) => r.id === id) ?? null;

export const fixtureAdapter: ResidentDataAdapter = {
  source: "fixtures",
  capabilities: {
    residence: true,
    announcements: true,
    maintenanceRead: true,
    maintenanceCreate: true,
    maintenanceAttachments: false,
    payments: false,
    documentsList: true,
    documentsDownload: true,
  },

  isConfigured() {
    return true;
  },

  async getProfile(residentId) {
    const r = findResident(residentId);
    return r ? { id: r.id, firstName: r.firstName, lastName: r.lastName, email: r.email } : null;
  },

  async getResidence(residentId) {
    return findResident(residentId)?.residence ?? null;
  },

  async getAnnouncements(residentId) {
    const slug = findResident(residentId)?.residence.propertySlug;
    return slug ? (announcementsByProperty[slug] ?? []) : [];
  },

  async listMaintenanceRequests(residentId) {
    return allRequests()
      .filter((r) => r.residentId === residentId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getMaintenanceRequest(residentId, requestId) {
    return allRequests().find((r) => r.id === requestId && r.residentId === residentId) ?? null;
  },

  async createMaintenanceRequest(residentId, input) {
    const now = new Date().toISOString();
    const request: MaintenanceRequest = {
      id: `fx-req-${3000 + createdRequests.length + 1}`,
      residentId,
      ...input,
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
      history: [{ at: now, status: "submitted" }],
    };
    createdRequests.unshift(request);
    return request;
  },

  async getPaymentSummary() {
    return null;
  },

  async listDocuments(residentId) {
    return documents.filter((d) => d.residentId === residentId);
  },

  async getDocumentFile(residentId, documentId) {
    const doc = documents.find((d) => d.id === documentId && d.residentId === residentId);
    if (!doc) return null;
    return {
      contentType: doc.contentType,
      fileName: doc.fileName,
      body: [
        "DEVELOPMENT FIXTURE — NOT A REAL DOCUMENT",
        "",
        `Document: ${doc.label}`,
        `Issued: ${doc.issuedAt}`,
        "",
        "This placeholder file demonstrates the authenticated, ownership-checked",
        "document download flow. Real documents will be served from the verified",
        "property management integration.",
      ].join("\n"),
    };
  },
};
