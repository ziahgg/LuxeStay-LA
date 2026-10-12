import "server-only";
import { NO_CAPABILITIES, type ResidentDataAdapter } from "./adapter";

/**
 * Yardi / RentCafe resident data adapter — NOT IMPLEMENTED.
 *
 * No resident API documentation, credentials or account permissions were
 * available, so no endpoints are assumed. Every capability is false, which
 * makes each dashboard page fall back to the official resident portal
 * (NEXT_PUBLIC_RESIDENT_PORTAL_URL). See docs/DASHBOARD.md → "Enabling live
 * resident data" for the verification checklist.
 */
function notImplemented(): never {
  throw new Error("RentCafe resident integration has not been implemented. See docs/DASHBOARD.md.");
}

export const rentCafeResidentAdapter: ResidentDataAdapter = {
  source: "rentcafe",
  capabilities: NO_CAPABILITIES,
  isConfigured: () => false,
  getProfile: async () => notImplemented(),
  getResidence: async () => notImplemented(),
  getAnnouncements: async () => notImplemented(),
  listMaintenanceRequests: async () => notImplemented(),
  getMaintenanceRequest: async () => notImplemented(),
  createMaintenanceRequest: async () => notImplemented(),
  getPaymentSummary: async () => notImplemented(),
  listDocuments: async () => notImplemented(),
  getDocumentFile: async () => notImplemented(),
};
