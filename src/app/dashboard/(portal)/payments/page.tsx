import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardHeader, EmptyState, Loading, Panel, PanelSkeleton, PortalFallback, SectionError } from "@/components/dashboard/ui";
import { ExternalButtonLink } from "@/components/ui/button";
import { requireResident } from "@/lib/auth/dal";
import { formatPrice } from "@/lib/format";
import { residentPortalUrl } from "@/lib/resident/config";
import { formatDay } from "@/lib/resident/format";
import { getPaymentSummary } from "@/lib/resident/service";

export const metadata: Metadata = { title: "Payments" };

const statusCopy = { current: "Up to date", due: "Payment due", "past-due": "Past due" } as const;

export default function PaymentsPage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Payments & billing"
        title="Payments."
        description="Rent and billing are handled securely through the official RentCafe resident portal."
      />
      <Suspense
        fallback={
          <Loading label="Loading payments">
            <PanelSkeleton lines={4} />
          </Loading>
        }
      >
        <Payments />
      </Suspense>
    </>
  );
}

async function Payments() {
  const resident = await requireResident("/dashboard/payments");
  const result = await getPaymentSummary(resident);

  // No verified financial data → never show balances; send residents to the official portal.
  if (!result.ok) {
    return result.reason === "unavailable" ? (
      <SectionError message={result.message} />
    ) : (
      <PortalFallback title="Make payments and view your balance in the resident portal." cta="Open Payment Portal">
        For your security, this dashboard doesn&rsquo;t process payments or display balances. Your current balance,
        due dates and payment history are available in the official RentCafe resident portal.
      </PortalFallback>
    );
  }

  const summary = result.data;
  if (!summary) {
    return <EmptyState title="No billing information yet">Your billing details will appear here once available.</EmptyState>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel title="Summary">
        <p className="text-sm text-muted">Status</p>
        <p className="mt-1 font-serif text-3xl">{statusCopy[summary.status]}</p>
        {summary.amountDue !== undefined && (
          <>
            <p className="mt-6 text-sm text-muted">Amount due</p>
            <p className="mt-1 font-serif text-3xl">{formatPrice(summary.amountDue)}</p>
          </>
        )}
        {summary.nextDueDate && (
          <>
            <p className="mt-6 text-sm text-muted">Next due date</p>
            <p className="mt-1">{formatDay(summary.nextDueDate)}</p>
          </>
        )}
        {residentPortalUrl && (
          <ExternalButtonLink href={residentPortalUrl} className="mt-8 w-full">
            Make a Payment
          </ExternalButtonLink>
        )}
      </Panel>

      <Panel title="Payment history" className="lg:col-span-2">
        {summary.history.length === 0 ? (
          <p className="text-muted">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <caption className="sr-only">Payment history</caption>
              <thead>
                <tr className="border-b border-charcoal">
                  <th scope="col" className="py-3 pr-4 font-medium">Date</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Description</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary.history.map((p) => (
                  <tr key={p.id} className="border-b border-line">
                    <td className="py-3.5 pr-4 whitespace-nowrap">{formatDay(p.date)}</td>
                    <td className="py-3.5 pr-4">{p.description}</td>
                    <td className="py-3.5 pr-4 capitalize">{p.status}</td>
                    <td className="py-3.5 text-right whitespace-nowrap">{formatPrice(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
