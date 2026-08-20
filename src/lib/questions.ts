export type FieldType = "text" | "textarea" | "number" | "currency";

export interface Field {
  key: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  help?: string;
  max?: number;
  min?: number;
  rows?: number;
}

export interface Question {
  id: string;
  index: number;
  prompt: string;
  sub?: string;
  fields: Field[];
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    index: 1,
    prompt: "Let's start with you.",
    sub: "Name, age, and the exact town you're from.",
    fields: [
      { key: "name", type: "text", label: "Full name", max: 80 },
      { key: "age", type: "number", label: "Age", min: 15, max: 99 },
      {
        key: "town",
        type: "text",
        label: "Town",
        max: 100,
        help: "The actual town — not the nearest big city.",
      },
    ],
  },
  {
    id: "q2",
    index: 2,
    prompt: "Your #1 most played song on Spotify this year.",
    fields: [
      {
        key: "song",
        type: "text",
        label: "Song — Artist",
        placeholder: "Song name — Artist",
        max: 120,
      },
    ],
  },
  {
    id: "q3",
    index: 3,
    prompt: "The dumbest thing you've ever spent your own money on.",
    fields: [
      { key: "purchase", type: "textarea", label: "What was it?", rows: 3, max: 400 },
      { key: "amount", type: "currency", label: "How much?", min: 1 },
    ],
  },
  {
    id: "q4",
    index: 4,
    prompt: "What did 15-year-old you think you'd be doing right now?",
    fields: [{ key: "q4", type: "textarea", rows: 4, max: 600 }],
  },
  {
    id: "q5",
    index: 5,
    prompt: "Who on this team would you call at 3am — and who goes straight to voicemail?",
    fields: [
      {
        key: "call3am",
        type: "text",
        label: "The 3am call",
        placeholder: 'A name, or "pass"',
        max: 80,
      },
      {
        key: "voicemail",
        type: "text",
        label: "Straight to voicemail",
        placeholder: 'A name, or "pass"',
        max: 80,
      },
    ],
  },
  {
    id: "q6",
    index: 6,
    prompt: "The most embarrassing thing you've done to impress someone who didn't care.",
    fields: [{ key: "q6", type: "textarea", rows: 4, max: 800 }],
  },
  {
    id: "q7",
    index: 7,
    prompt: "What do you think people say about you when you leave the room?",
    fields: [{ key: "q7", type: "textarea", rows: 4, max: 600 }],
  },
  {
    id: "q8",
    index: 8,
    prompt: "Who here wastes the most time, who's the most efficient, and why?",
    fields: [
      {
        key: "timeWaster",
        type: "text",
        label: "Wastes time",
        placeholder: 'A name, or "pass"',
        max: 80,
      },
      {
        key: "efficient",
        type: "text",
        label: "Most efficient",
        placeholder: 'A name, or "pass"',
        max: 80,
      },
      { key: "q8Why", type: "textarea", label: "Why?", rows: 4, max: 600 },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const ALL_FIELDS = QUESTIONS.flatMap((q) => q.fields);
