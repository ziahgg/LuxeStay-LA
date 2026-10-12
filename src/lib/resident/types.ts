/**
 * Internal resident model for the Resident Dashboard.
 *
 * Every field that depends on the property management system is optional:
 * the UI only shows what an authorised, verified source actually provides.
 */

export type ResidentDataSource = "fixtures" | "rentcafe";

export interface ResidentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type LeaseStatus = "upcoming" | "active" | "ending-soon" | "month-to-month" | "ended";

export interface Residence {
  propertyName: string;
  /** Slug of the public listing, when the residence is listed on the website. */
  propertySlug?: string;
  neighborhood?: string;
  unit: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities: string[];
  moveInDate?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  leaseStatus?: LeaseStatus;
  /** Move-in notes provided by property management. */
  moveInNotes?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  priority?: "normal" | "important";
}

export const MAINTENANCE_CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "appliances", label: "Appliances" },
  { value: "heating-cooling", label: "Heating & cooling" },
  { value: "furnishings", label: "Furniture & furnishings" },
  { value: "general", label: "General maintenance" },
] as const;

export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number]["value"];

export type MaintenanceStatus = "submitted" | "scheduled" | "in-progress" | "awaiting-resident" | "completed" | "cancelled";

export interface MaintenanceEvent {
  at: string;
  status: MaintenanceStatus;
  note?: string;
}

export interface MaintenanceRequest {
  id: string;
  /** Owner — used for authorisation checks; never trusted from the client. */
  residentId: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  status: MaintenanceStatus;
  submittedAt: string;
  updatedAt: string;
  permissionToEnter?: boolean;
  history: MaintenanceEvent[];
}

export interface NewMaintenanceRequest {
  category: MaintenanceCategory;
  title: string;
  description: string;
  permissionToEnter: boolean;
}

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

export interface PaymentSummary {
  nextDueDate?: string;
  amountDue?: number;
  status: "current" | "due" | "past-due";
  history: PaymentRecord[];
}

export interface ResidentDocument {
  id: string;
  /** Owner — used for authorisation checks. */
  residentId: string;
  label: string;
  category: "lease" | "addendum" | "move-in" | "notice" | "other";
  issuedAt: string;
  contentType: string;
  fileName: string;
}

export interface DocumentFile {
  body: Uint8Array | string;
  contentType: string;
  fileName: string;
}

/**
 * What a data source can actually do. Pages check these before rendering data
 * or actions; anything unsupported falls back to the official resident portal.
 */
export interface ResidentCapabilities {
  residence: boolean;
  announcements: boolean;
  maintenanceRead: boolean;
  maintenanceCreate: boolean;
  maintenanceAttachments: boolean;
  payments: boolean;
  documentsList: boolean;
  documentsDownload: boolean;
}

export type ResidentResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unsupported" | "unavailable"; message: string };
