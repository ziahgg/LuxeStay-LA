import { getCurrentResident } from "@/lib/auth/dal";
import { getDocumentFile } from "@/lib/resident/service";

/**
 * Authenticated document download.
 * - Requires a verified session (also enforced by src/proxy.ts).
 * - The adapter only returns documents owned by the signed-in resident;
 *   anything else is a 404 so document ids can't be probed.
 * - Responses are private and never cached by shared caches.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/resident/documents/[id]">) {
  const resident = await getCurrentResident();
  if (!resident) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const result = await getDocumentFile(resident, id);
  if (!result.ok) {
    return Response.json(
      { error: result.reason === "unsupported" ? "Not available" : "Temporarily unavailable" },
      { status: result.reason === "unsupported" ? 404 : 503 },
    );
  }
  if (!result.data) return Response.json({ error: "Not found" }, { status: 404 });

  const file = result.data;
  const safeName = file.fileName.replace(/[^\w.-]/g, "_");
  return new Response(file.body as BodyInit, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
