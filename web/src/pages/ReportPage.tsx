import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { FieldGrid } from "@/components/incident/FieldGrid";
import { ReportForm } from "@/components/report/ReportForm";
import { SubmitStatus } from "@/components/report/SubmitStatus";
import { MyReports } from "@/components/track/MyReports";
import { LiveStatus } from "@/components/track/LiveStatus";
import { OfflineFallback } from "@/components/report/OfflineFallback";
import { LocationPrompt } from "@/components/report/LocationPrompt";
import { useReportSubmit } from "@/hooks/useReportSubmit";
import { Tour } from "@/components/tour/Tour";

export function ReportPage() {
  const { delivery, ai, extraction, question, location, reportId, message, point, submit, retryLocation } =
    useReportSubmit();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Tour id="report" />
      <LocationPrompt />
      <Card>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-danger">Emergency in this building?</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink">Need help? We'll send it.</h1>
          <p className="mt-1 text-sm text-slate-600">Your SOS and location go straight to the building's coordinator.</p>
        </div>
        <ReportForm onSubmit={submit} disabled={delivery === "pending" || ai === "pending"} />
      </Card>
      {delivery === "pending" && message && <OfflineFallback message={message} point={point} />}
      <SubmitStatus delivery={delivery} ai={ai} location={location} onRetryLocation={retryLocation} />
      {reportId && <LiveStatus reportId={reportId} />}
      {extraction && (
        <Card title="What we understood">
          <div className="space-y-3">
            <p className="text-sm">{extraction.summary}</p>
            <FieldGrid values={extraction} />
            {question && <Notice tone="info">Follow-up: {question}</Notice>}
          </div>
        </Card>
      )}
      <MyReports />
    </div>
  );
}
