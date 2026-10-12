import "server-only";
import type { AuthenticatedResident } from "@/lib/auth/dal";
import { NO_CAPABILITIES, type ResidentDataAdapter } from "./adapter";
import { getResidentDataSource } from "./config";
import { fixtureAdapter } from "./fixtures";
import { rentCafeResidentAdapter } from "./rentcafe-adapter";
import type {
  Announcement,
  DocumentFile,
  MaintenanceRequest,
  NewMaintenanceRequest,
  PaymentSummary,
  Residence,
  ResidentCapabilities,
  ResidentDocument,
  ResidentResult,
} from "./types";

/**
 * Resident data service. Pages and actions import only from here.
 * Each function requires an AuthenticatedResident (see lib/auth/dal.ts), checks
 * the source's capabilities and converts failures into ResidentResult states.
 * Resident data is never cached across users.
 */

export function getResidentAdapter(): ResidentDataAdapter | null {
  const source = getResidentDataSource();
  if (source === "fixtures") return fixtureAdapter;
  if (source === "rentcafe") return rentCafeResidentAdapter;
  return null;
}

export function getCapabilities(): ResidentCapabilities {
  const adapter = getResidentAdapter();
  return adapter?.isConfigured() ? adapter.capabilities : NO_CAPABILITIES;
}

export function isUsingFixtures() {
  return getResidentDataSource() === "fixtures";
}

const UNSUPPORTED = {
  ok: false,
  reason: "unsupported",
  message: "This information is available in the official resident portal.",
} as const;

async function run<T>(
  capability: keyof ResidentCapabilities,
  fn: (adapter: ResidentDataAdapter) => Promise<T>,
): Promise<ResidentResult<T>> {
  const adapter = getResidentAdapter();
  if (!adapter || !adapter.isConfigured() || !adapter.capabilities[capability]) return UNSUPPORTED;
  try {
    return { ok: true, data: await fn(adapter) };
  } catch (error) {
    console.error(`[resident] ${capability} failed`, error);
    return {
      ok: false,
      reason: "unavailable",
      message: "We couldn't load this information right now. Please try again shortly.",
    };
  }
}

export const getResidence = (r: AuthenticatedResident): Promise<ResidentResult<Residence | null>> =>
  run("residence", (a) => a.getResidence(r.id));

export const getAnnouncements = (r: AuthenticatedResident): Promise<ResidentResult<Announcement[]>> =>
  run("announcements", (a) => a.getAnnouncements(r.id));

export const listMaintenanceRequests = (r: AuthenticatedResident): Promise<ResidentResult<MaintenanceRequest[]>> =>
  run("maintenanceRead", (a) => a.listMaintenanceRequests(r.id));

export const getMaintenanceRequest = (
  r: AuthenticatedResident,
  requestId: string,
): Promise<ResidentResult<MaintenanceRequest | null>> =>
  run("maintenanceRead", (a) => a.getMaintenanceRequest(r.id, requestId));

export const createMaintenanceRequest = (
  r: AuthenticatedResident,
  input: NewMaintenanceRequest,
): Promise<ResidentResult<MaintenanceRequest>> =>
  run("maintenanceCreate", (a) => a.createMaintenanceRequest(r.id, input));

export const getPaymentSummary = (r: AuthenticatedResident): Promise<ResidentResult<PaymentSummary | null>> =>
  run("payments", (a) => a.getPaymentSummary(r.id));

export const listDocuments = (r: AuthenticatedResident): Promise<ResidentResult<ResidentDocument[]>> =>
  run("documentsList", (a) => a.listDocuments(r.id));

export const getDocumentFile = (
  r: AuthenticatedResident,
  documentId: string,
): Promise<ResidentResult<DocumentFile | null>> =>
  run("documentsDownload", (a) => a.getDocumentFile(r.id, documentId));
