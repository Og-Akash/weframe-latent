import { defineField, defineType } from "sanity";

export const submission = defineType({
  name: "submission",
  title: "Submission",
  type: "document",
  groups: [
    { name: "meta", title: "Meta" },
    { name: "answers", title: "Answers", default: true },
    { name: "review", title: "Review" },
  ],
  fields: [
    // ---- meta ----
    defineField({ name: "submissionId", type: "string", group: "meta", readOnly: true }),
    defineField({ name: "submittedAt", type: "datetime", group: "meta", readOnly: true }),
    defineField({ name: "timeTakenSec", type: "number", group: "meta", readOnly: true }),

    // ---- Q1 ----
    defineField({ name: "name", title: "Name", type: "string", group: "answers", readOnly: true }),
    defineField({ name: "age", title: "Age", type: "number", group: "answers", readOnly: true }),
    defineField({ name: "town", title: "Town", type: "string", group: "answers", readOnly: true }),

    // ---- Q2 ----
    defineField({ name: "song", title: "Most played song", type: "string", group: "answers", readOnly: true }),

    // ---- Q3 ----
    defineField({ name: "purchase", title: "Dumbest purchase", type: "text", rows: 3, group: "answers", readOnly: true }),
    defineField({ name: "amountInr", title: "Amount (INR)", type: "number", group: "answers", readOnly: true }),

    // ---- Q4 ----
    defineField({ name: "q4", title: "What 15-year-old you expected", type: "text", rows: 4, group: "answers", readOnly: true }),

    // ---- Q5 ----
    defineField({ name: "call3am", title: "3am call", type: "string", group: "answers", readOnly: true }),
    defineField({ name: "voicemail", title: "Straight to voicemail", type: "string", group: "answers", readOnly: true }),

    // ---- Q6 ----
    defineField({ name: "q6", title: "Most embarrassing thing", type: "text", rows: 4, group: "answers", readOnly: true }),

    // ---- Q7 ----
    defineField({ name: "q7", title: "What people say after you leave", type: "text", rows: 4, group: "answers", readOnly: true }),

    // ---- Q8 ----
    defineField({ name: "timeWaster", title: "Wastes the most time", type: "string", group: "answers", readOnly: true }),
    defineField({ name: "efficient", title: "Most efficient", type: "string", group: "answers", readOnly: true }),
    defineField({ name: "q8Why", title: "Why", type: "text", rows: 4, group: "answers", readOnly: true }),

    // ---- review (editable) ----
    defineField({
      name: "status",
      type: "string",
      group: "review",
      initialValue: "new",
      options: {
        layout: "radio",
        list: [
          { title: "New", value: "new" },
          { title: "Shortlist", value: "shortlist" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Done", value: "done" },
        ],
      },
    }),
    defineField({ name: "reviewerNotes", title: "Notes for the session", type: "text", rows: 5, group: "review" }),
  ],
  preview: {
    select: { title: "name", subtitle: "town", date: "submittedAt" },
    prepare: ({ title, subtitle, date }) => ({
      title: title || "Untitled",
      subtitle: [subtitle, date && new Date(date).toLocaleDateString("en-IN")]
        .filter(Boolean)
        .join(" · "),
    }),
  },
  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] },
    { title: "Biggest bad purchase", name: "spend", by: [{ field: "amountInr", direction: "desc" }] },
  ],
});
