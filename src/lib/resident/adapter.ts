import type {
  Announcement,
  DocumentFile,
  MaintenanceRequest,
  NewMaintenanceRequest,
  PaymentSummary,
  Residence,
  ResidentCapabilities,
  ResidentDataSource,
  ResidentDocument,
  ResidentProfile,
} from "./types";

/**
 * Contract for resident data sources (server-only).
 *
 * Every method that returns resident data takes the resident id from the
 * verified session — callers must never pass ids supplied by the browser.
 * Adapters must scope results to that resident and return null / [] for
 * records owned by anyone else.
 */
export interface ResidentDataAdapter {
  readonly source: ResidentDataSource;
  readonly capabilities: ResidentCapabilities;
  isConfigured(): boolean;
  getProfile(residentId: string): Promise<ResidentProfile | null>;
  getResidence(residentId: string): Promise<Residence | null>;
  getAnnouncements(residentId: string): Promise<Announcement[]>;
  listMaintenanceRequests(residentId: string): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(residentId: string, requestId: string): Promise<MaintenanceRequest | null>;
  createMaintenanceRequest(residentId: string, input: NewMaintenanceRequest): Promise<MaintenanceRequest>;
  getPaymentSummary(residentId: string): Promise<PaymentSummary | null>;
  listDocuments(residentId: string): Promise<ResidentDocument[]>;
  getDocumentFile(residentId: string, documentId: string): Promise<DocumentFile | null>;
}

export const NO_CAPABILITIES: ResidentCapabilities = {
  residence: false,
  announcements: false,
  maintenanceRead: false,
  maintenanceCreate: false,
  maintenanceAttachments: false,
  payments: false,
  documentsList: false,
  documentsDownload: false,
};
