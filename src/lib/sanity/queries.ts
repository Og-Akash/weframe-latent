export const ALL_SUBMISSIONS = `
  *[_type == "submission"] | order(submittedAt desc) {
    _id, submissionId, submittedAt, timeTakenSec, status,
    name, age, town, song, purchase, amountInr,
    q4, call3am, voicemail, q6, q7, timeWaster, efficient, q8Why,
    reviewerNotes
  }
`;

export const SUBMISSIONS_BY_STATUS = `
  *[_type == "submission" && ($status == "all" || status == $status)] | order(submittedAt desc) {
    _id, submissionId, submittedAt, timeTakenSec, status,
    name, age, town, song, purchase, amountInr,
    q4, call3am, voicemail, q6, q7, timeWaster, efficient, q8Why,
    reviewerNotes
  }
`;

export const SUBMISSION_BY_ID = `
  *[_type == "submission" && (_id == $id || submissionId == $id)][0] {
    _id, submissionId, submittedAt, timeTakenSec, status,
    name, age, town, song, purchase, amountInr,
    q4, call3am, voicemail, q6, q7, timeWaster, efficient, q8Why,
    reviewerNotes
  }
`;
