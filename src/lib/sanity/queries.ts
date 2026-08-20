export const ALL_SUBMISSIONS = `
  *[_type == "submission"] | order(submittedAt asc) {
    submissionId, name, age, town, song, purchase, amountInr,
    q4, call3am, voicemail, q6, q7, timeWaster, efficient, q8Why,
    reviewerNotes
  }
`;
