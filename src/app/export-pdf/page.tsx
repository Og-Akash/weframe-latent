import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { SUBMISSIONS_BY_STATUS, SUBMISSION_BY_ID } from "@/lib/sanity/queries";
import { QUESTIONS } from "@/lib/questions";
import { PrintButton } from "./PrintButton";
import { FilterControl } from "./FilterControl";

export const dynamic = "force-dynamic";

interface Submission {
  _id: string;
  submissionId?: string;
  submittedAt?: string;
  timeTakenSec?: number;
  status?: string;
  name?: string;
  age?: number;
  town?: string;
  song?: string;
  purchase?: string;
  amountInr?: number;
  q4?: string;
  call3am?: string;
  voicemail?: string;
  q6?: string;
  q7?: string;
  timeWaster?: string;
  efficient?: string;
  q8Why?: string;
  reviewerNotes?: string;
}

export default async function ExportPdfPage(props: {
  searchParams: Promise<{ status?: string; id?: string }>;
}) {
  const params = await props.searchParams;
  const statusParam = params.status || "all";
  const idParam = params.id;

  let submissions: Submission[] = [];

  try {
    if (idParam) {
      const single = await client.fetch<Submission | null>(SUBMISSION_BY_ID, { id: idParam });
      if (single) submissions = [single];
    } else {
      submissions = await client.fetch<Submission[]>(SUBMISSIONS_BY_STATUS, { status: statusParam });
    }
  } catch (err) {
    console.error("[ExportPdfPage] Failed to fetch submissions", err);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans print:bg-white print:text-black">
      {/* Floating Action Controls (Hidden during print) */}
      <header className="no-print sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            ← Back to Sanity Studio
          </Link>
          <h1 className="text-sm font-semibold tracking-wide text-amber-400 uppercase">
            PDF Participant Export
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {!idParam && <FilterControl currentStatus={statusParam} />}
          <PrintButton />
        </div>
      </header>

      {/* Main Print Booklet Content */}
      <main className="mx-auto max-w-4xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
        {submissions.length === 0 ? (
          <div className="my-20 text-center">
            <h2 className="text-2xl font-bold text-neutral-300">No submissions found</h2>
            <p className="mt-2 text-sm text-neutral-500">
              There are no submissions matching your filter criteria.
            </p>
          </div>
        ) : (
          submissions.map((sub, index) => (
            <article
              key={sub._id || index}
              className="page-break mb-12 border-b border-neutral-800 pb-12 print:mb-0 print:border-none print:pb-0 print:pt-4"
            >
              {/* Participant Header Banner */}
              <div className="rounded-xl border border-amber-500/30 bg-neutral-900/80 p-6 print:border-neutral-300 print:bg-neutral-100 print:p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase print:text-amber-700">
                      Weframe&apos;s Got Latent · Participant #{index + 1}
                    </span>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white print:text-black">
                      {sub.name || "Anonymous Participant"}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-neutral-400 print:text-neutral-700">
                      {sub.age ? `${sub.age} years old` : "Age not specified"}
                      {sub.town ? ` · From ${sub.town}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 text-right">
                    <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase text-amber-300 print:border-amber-800 print:bg-amber-100 print:text-amber-900">
                      Status: {sub.status || "new"}
                    </span>
                    {sub.submissionId && (
                      <span className="font-mono text-xs text-neutral-400 print:text-neutral-600">
                        ID: {sub.submissionId}
                      </span>
                    )}
                    {sub.submittedAt && (
                      <span className="text-xs text-neutral-400 print:text-neutral-600">
                        Submitted: {new Date(sub.submittedAt).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Questions & Answers List */}
              <div className="mt-8 flex flex-col gap-6">
                {/* Q1 */}
                <QuestionBlock
                  number={1}
                  prompt={QUESTIONS[0].prompt}
                  subPrompt={QUESTIONS[0].sub}
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AnswerItem label="Full Name" value={sub.name} />
                    <AnswerItem label="Age" value={sub.age ? String(sub.age) : undefined} />
                    <AnswerItem label="Town" value={sub.town} />
                  </div>
                </QuestionBlock>

                {/* Q2 */}
                <QuestionBlock number={2} prompt={QUESTIONS[1].prompt}>
                  <AnswerItem label="Song — Artist" value={sub.song} />
                </QuestionBlock>

                {/* Q3 */}
                <QuestionBlock number={3} prompt={QUESTIONS[2].prompt}>
                  <div className="flex flex-col gap-3">
                    <AnswerItem label="Dumbest Purchase" value={sub.purchase} />
                    <AnswerItem
                      label="Amount Spent"
                      value={sub.amountInr != null ? `₹${sub.amountInr.toLocaleString("en-IN")}` : undefined}
                    />
                  </div>
                </QuestionBlock>

                {/* Q4 */}
                <QuestionBlock number={4} prompt={QUESTIONS[3].prompt}>
                  <AnswerItem label="15-Year-Old Expectations" value={sub.q4} />
                </QuestionBlock>

                {/* Q5 */}
                <QuestionBlock number={5} prompt={QUESTIONS[4].prompt}>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AnswerItem label="The 3am Call" value={sub.call3am} />
                    <AnswerItem label="Straight to Voicemail" value={sub.voicemail} />
                  </div>
                </QuestionBlock>

                {/* Q6 */}
                <QuestionBlock number={6} prompt={QUESTIONS[5].prompt}>
                  <AnswerItem label="Most Embarrassing Thing Done" value={sub.q6} />
                </QuestionBlock>

                {/* Q7 */}
                <QuestionBlock number={7} prompt={QUESTIONS[6].prompt}>
                  <AnswerItem label="What People Say Behind Back" value={sub.q7} />
                </QuestionBlock>

                {/* Q8 */}
                <QuestionBlock number={8} prompt={QUESTIONS[7].prompt}>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <AnswerItem label="Wastes Most Time" value={sub.timeWaster} />
                      <AnswerItem label="Most Efficient" value={sub.efficient} />
                    </div>
                    <AnswerItem label="Why?" value={sub.q8Why} />
                  </div>
                </QuestionBlock>

                {/* Reviewer Notes (if present) */}
                {sub.reviewerNotes && (
                  <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4 print:border-neutral-300 print:bg-neutral-50">
                    <h4 className="text-xs font-bold uppercase text-amber-400 print:text-amber-800">
                      Session Reviewer Notes
                    </h4>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-200 print:text-black">
                      {sub.reviewerNotes}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </main>

      {/* Print CSS overrides */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            break-after: page;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}

function QuestionBlock({
  number,
  prompt,
  subPrompt,
  children,
}: {
  number: number;
  prompt: string;
  subPrompt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 print:border-neutral-300 print:bg-white print:p-3">
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs font-bold text-amber-400 print:text-amber-700">
            Q{number}.
          </span>
          <h3 className="text-base font-bold text-amber-200 print:text-black">
            {prompt}
          </h3>
        </div>
        {subPrompt && (
          <p className="ml-6 text-xs text-neutral-400 print:text-neutral-600">{subPrompt}</p>
        )}
      </div>
      <div className="ml-2 pl-4 border-l-2 border-amber-500/30 print:border-amber-600">
        {children}
      </div>
    </div>
  );
}

function AnswerItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 print:text-neutral-600">
        {label}
      </span>
      <p className="mt-0.5 whitespace-pre-wrap text-sm font-medium text-neutral-100 print:text-black">
        {value && value.trim() ? value : "—"}
      </p>
    </div>
  );
}
