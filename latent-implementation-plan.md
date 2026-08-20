# Latent — Application Form Platform

**Implementation plan**

Internal "Latent"-style show for a fun-Friday team session. Candidates fill an
eight-question form on a branded site; answers are stored in Sanity and read back
during a video call. Not public, not recorded, not published.

---

## 1. Scope

| In scope | Out of scope |
|---|---|
| Branded landing page with animated logo intro | Public launch / SEO |
| Eight-question step form, all required | Candidate accounts or login |
| Sanity Content Lake as datastore | Email notifications |
| Sanity Studio at `/studio` for review | Video call integration |
| Confetti + success + one-time lockout | Payments, scheduling |
| Optional presenter view for the session | Multi-tenant / multi-season |

**Success criteria:** a team member opens the link, completes eight questions in
under three minutes on a phone, and the answer appears in Studio immediately.

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 19 |
| Styling | Tailwind CSS 4 | CSS-first config |
| Components | shadcn/ui | Button, Input, Textarea, Label, Progress, Sonner only |
| Animation | `motion` (`motion/react`) | Formerly Framer Motion |
| Confetti | `canvas-confetti` | Dynamically imported |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | Per-step validation |
| Data | Sanity v4 + `next-sanity` | Private dataset |
| IDs | `nanoid` | Human-shareable submission ID |
| Deploy | Vercel | |
| Package manager | Bun | |
| Linter | Biome | |

**Before installing:** verify `next-sanity` and `sanity` have released Next.js 16 /
React 19 compatible versions. If the embedded Studio has friction, run Studio as a
separate `sanity dev` app instead — it does not block anything else in this plan.

---

## 3. Project structure

```
latent/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # landing
│   ├── apply/
│   │   └── page.tsx                # form shell (client)
│   ├── api/
│   │   └── submit/route.ts         # server-only Sanity write
│   ├── studio/
│   │   └── [[...tool]]/page.tsx    # embedded Studio
│   └── globals.css
├── components/
│   ├── intro/
│   │   ├── IntroOverlay.tsx
│   │   └── LogoDraw.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── JudgeCard.tsx
│   │   └── JudgeGrid.tsx
│   ├── form/
│   │   ├── FormShell.tsx           # state machine
│   │   ├── QuestionStep.tsx
│   │   ├── FieldRenderer.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ReviewStep.tsx
│   │   ├── SuccessScreen.tsx
│   │   └── LockedState.tsx
│   └── fx/
│       ├── ParticleField.tsx       # ambient canvas
│       └── fireConfetti.ts
├── lib/
│   ├── questions.ts                # single source of truth
│   ├── schema.ts                   # Zod derived from questions.ts
│   ├── storage.ts                  # safe localStorage
│   └── sanity/
│       ├── client.ts               # read client
│       ├── writeClient.ts          # server-only
│       └── queries.ts
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts
│   │   └── submission.ts
│   └── structure.ts
├── sanity.config.ts
├── sanity.cli.ts
└── .env.local
```

---

## 4. Environment

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID="xxxxxxxx"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-01-01"

# Server only — never prefix with NEXT_PUBLIC_
SANITY_WRITE_TOKEN="sk..."
```

Add all four to Vercel. The write token goes in **Production + Preview** only.

---

## 5. Sanity setup

### 5.1 Create the project

```bash
bunx sanity@latest init --env
```

Choose **"Clean project with no predefined schemas"**.

> **Set the dataset to private.** Sanity datasets default to public, meaning anyone
> with the project ID and dataset name can read every document over the API without
> a token. These answers name colleagues. Set private at creation, or afterwards:
> **Manage → API → Datasets → production → Private**.

### 5.2 Create the write token

Manage → API → Tokens → Add token → permission **Editor** → copy into
`SANITY_WRITE_TOKEN`. It is shown once.

### 5.3 Document schema

```ts
// sanity/schemaTypes/submission.ts
import { defineField, defineType } from 'sanity'

export const submission = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  groups: [
    { name: 'meta',    title: 'Meta' },
    { name: 'answers', title: 'Answers', default: true },
    { name: 'review',  title: 'Review' },
  ],
  fields: [
    // ---- meta ----
    defineField({ name: 'submissionId', type: 'string', group: 'meta', readOnly: true }),
    defineField({ name: 'submittedAt',  type: 'datetime', group: 'meta', readOnly: true }),
    defineField({ name: 'timeTakenSec', type: 'number', group: 'meta', readOnly: true }),

    // ---- Q1 ----
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'answers', readOnly: true }),
    defineField({ name: 'age',  title: 'Age',  type: 'number', group: 'answers', readOnly: true }),
    defineField({ name: 'town', title: 'Town', type: 'string', group: 'answers', readOnly: true }),

    // ---- Q2 ----
    defineField({ name: 'song', title: 'Most played song', type: 'string', group: 'answers', readOnly: true }),

    // ---- Q3 ----
    defineField({ name: 'purchase',  title: 'Dumbest purchase', type: 'text', rows: 3, group: 'answers', readOnly: true }),
    defineField({ name: 'amountInr', title: 'Amount (INR)', type: 'number', group: 'answers', readOnly: true }),

    // ---- Q4 ----
    defineField({ name: 'q4', title: 'What 15-year-old you expected', type: 'text', rows: 4, group: 'answers', readOnly: true }),

    // ---- Q5 ----
    defineField({ name: 'call3am',   title: '3am call', type: 'string', group: 'answers', readOnly: true }),
    defineField({ name: 'voicemail', title: 'Straight to voicemail', type: 'string', group: 'answers', readOnly: true }),

    // ---- Q6 ----
    defineField({ name: 'q6', title: 'Most embarrassing thing', type: 'text', rows: 4, group: 'answers', readOnly: true }),

    // ---- Q7 ----
    defineField({ name: 'q7', title: 'What people say after you leave', type: 'text', rows: 4, group: 'answers', readOnly: true }),

    // ---- Q8 ----
    defineField({ name: 'timeWaster', title: 'Wastes the most time', type: 'string', group: 'answers', readOnly: true }),
    defineField({ name: 'efficient',  title: 'Most efficient', type: 'string', group: 'answers', readOnly: true }),
    defineField({ name: 'q8Why',      title: 'Why', type: 'text', rows: 4, group: 'answers', readOnly: true }),

    // ---- review (editable) ----
    defineField({
      name: 'status',
      type: 'string',
      group: 'review',
      initialValue: 'new',
      options: {
        layout: 'radio',
        list: [
          { title: 'New',       value: 'new' },
          { title: 'Shortlist', value: 'shortlist' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Done',      value: 'done' },
        ],
      },
    }),
    defineField({ name: 'reviewerNotes', title: 'Notes for the session', type: 'text', rows: 5, group: 'review' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'town', date: 'submittedAt' },
    prepare: ({ title, subtitle, date }) => ({
      title: title || 'Untitled',
      subtitle: [subtitle, date && new Date(date).toLocaleDateString('en-IN')]
        .filter(Boolean).join(' · '),
    }),
  },
  orderings: [
    { title: 'Newest', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Biggest bad purchase', name: 'spend', by: [{ field: 'amountInr', direction: 'desc' }] },
  ],
})
```

Answer fields are `readOnly` so nobody edits someone's answer by accident while
scrolling in Studio. Only `status` and `reviewerNotes` are writable.

### 5.4 Studio config

```ts
// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'latent',
  title: 'Latent',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Submissions are created by the app, never by hand.
    actions: (prev, { schemaType }) =>
      schemaType === 'submission'
        ? prev.filter(a => !['duplicate', 'unpublish'].includes(a.action ?? ''))
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(t => t.templateId !== 'submission')
        : prev,
  },
})
```

Invite the team under **Manage → Members**. Studio auth is Sanity's own — no auth
code to write. Check current seat limits on your plan before inviting everyone.

### 5.5 Clients

```ts
// lib/sanity/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
})
```

```ts
// lib/sanity/writeClient.ts
import 'server-only'
import { createClient } from 'next-sanity'

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // CDN is read-only and stale; never use for writes
})
```

The `server-only` import makes the build fail loudly if this file is ever
imported into a client component. Install it: `bun add server-only`.

Because the dataset is private, **any read from the browser also needs a token**.
Keep all reads server-side too — the presenter view in §12 is a server component
for exactly this reason.

---

## 6. Question config — single source of truth

Add a ninth question later and you touch this file only. It drives the steps, the
Zod schema, the progress total, and the payload mapping.

```ts
// lib/questions.ts
export type FieldType = 'text' | 'textarea' | 'number' | 'currency'

export interface Field {
  key: string
  type: FieldType
  label?: string
  placeholder?: string
  help?: string
  max?: number
  min?: number
  rows?: number
}

export interface Question {
  id: string
  index: number
  prompt: string
  sub?: string
  fields: Field[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1', index: 1,
    prompt: "Let's start with you.",
    sub: "Name, age, and the exact town you're from.",
    fields: [
      { key: 'name', type: 'text',   label: 'Full name', max: 80 },
      { key: 'age',  type: 'number', label: 'Age', min: 15, max: 99 },
      { key: 'town', type: 'text',   label: 'Town', max: 100,
        help: "The actual town — not the nearest big city." },
    ],
  },
  {
    id: 'q2', index: 2,
    prompt: "Your #1 most played song on Spotify this year.",
    fields: [
      { key: 'song', type: 'text', label: 'Song — Artist',
        placeholder: 'Song name — Artist', max: 120 },
    ],
  },
  {
    id: 'q3', index: 3,
    prompt: "The dumbest thing you've ever spent your own money on.",
    fields: [
      { key: 'purchase', type: 'textarea', label: 'What was it?', rows: 3, max: 400 },
      { key: 'amount',   type: 'currency', label: 'How much?', min: 1 },
    ],
  },
  {
    id: 'q4', index: 4,
    prompt: "What did 15-year-old you think you'd be doing right now?",
    fields: [{ key: 'q4', type: 'textarea', rows: 4, max: 600 }],
  },
  {
    id: 'q5', index: 5,
    prompt: "Who on this team would you call at 3am — and who goes straight to voicemail?",
    fields: [
      { key: 'call3am',   type: 'text', label: 'The 3am call',
        placeholder: 'A name, or "pass"', max: 80 },
      { key: 'voicemail', type: 'text', label: 'Straight to voicemail',
        placeholder: 'A name, or "pass"', max: 80 },
    ],
  },
  {
    id: 'q6', index: 6,
    prompt: "The most embarrassing thing you've done to impress someone who didn't care.",
    fields: [{ key: 'q6', type: 'textarea', rows: 4, max: 800 }],
  },
  {
    id: 'q7', index: 7,
    prompt: "What do you think people say about you when you leave the room?",
    fields: [{ key: 'q7', type: 'textarea', rows: 4, max: 600 }],
  },
  {
    id: 'q8', index: 8,
    prompt: "Who here wastes the most time, who's the most efficient, and why?",
    fields: [
      { key: 'timeWaster', type: 'text', label: 'Wastes time',
        placeholder: 'A name, or "pass"', max: 80 },
      { key: 'efficient',  type: 'text', label: 'Most efficient',
        placeholder: 'A name, or "pass"', max: 80 },
      { key: 'q8Why',      type: 'textarea', label: 'Why?', rows: 4, max: 600 },
    ],
  },
]

export const TOTAL_QUESTIONS = QUESTIONS.length
export const ALL_FIELDS = QUESTIONS.flatMap(q => q.fields)
```

**Every field is required.** There is no skip. `"pass"` is a valid answer, which is
why the placeholder on Q5 and Q8 says so — people discover the escape hatch without
anyone explaining it in the meeting.

Validation is deliberately shallow: minimum two characters, trimmed. Do not add
word counts or "please elaborate" nudges — they fight the escape hatch.

### Derived Zod schema

```ts
// lib/schema.ts
import { z } from 'zod'
import { QUESTIONS, type Field } from './questions'

const fieldSchema = (f: Field) => {
  switch (f.type) {
    case 'number':
      return z.coerce.number({ message: 'Required' })
        .int().min(f.min ?? 0).max(f.max ?? 999)
    case 'currency':
      return z.coerce.number({ message: 'Required' })
        .positive('Enter an amount')
    default:
      return z.string().trim()
        .min(2, 'Required')
        .max(f.max ?? 1000, `Keep it under ${f.max} characters`)
  }
}

export const fullSchema = z.object(
  Object.fromEntries(
    QUESTIONS.flatMap(q => q.fields).map(f => [f.key, fieldSchema(f)]),
  ),
)

export type FormValues = z.infer<typeof fullSchema>

/** Field keys for one step — used to gate the Next button. */
export const stepKeys = (i: number) => QUESTIONS[i].fields.map(f => f.key)
```

---

## 7. Submit route

```ts
// app/api/submit/route.ts
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { writeClient } from '@/lib/sanity/writeClient'
import { fullSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { timeTakenSec, ...answers } = (body ?? {}) as Record<string, unknown>

  const parsed = fullSchema.safeParse(answers)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const d = parsed.data
  const submissionId = nanoid(8).toUpperCase()

  try {
    await writeClient.create({
      _type: 'submission',
      submissionId,
      submittedAt: new Date().toISOString(),
      timeTakenSec: typeof timeTakenSec === 'number' ? timeTakenSec : null,
      name: d.name,
      age: d.age,
      town: d.town,
      song: d.song,
      purchase: d.purchase,
      amountInr: d.amount,
      q4: d.q4,
      call3am: d.call3am,
      voicemail: d.voicemail,
      q6: d.q6,
      q7: d.q7,
      timeWaster: d.timeWaster,
      efficient: d.efficient,
      q8Why: d.q8Why,
      status: 'new',
    })
  } catch (err) {
    console.error('[submit] Sanity write failed', err)
    return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, submissionId })
}
```

Notes:

- Validate on the server even though the client already did. The client is a
  suggestion.
- Map `amount → amountInr` here rather than renaming the form field; the form key
  stays short and the document field stays explicit.
- Return the `submissionId` so the success screen can show it.
- **Never** import `writeClient` from a client component.

**Optional dedupe** — now cheap, unlike with Sheets:

```ts
const existing = await writeClient.fetch(
  `count(*[_type == "submission" && lower(name) == $n])`,
  { n: d.name.toLowerCase().trim() },
)
if (existing > 0) {
  return NextResponse.json({ error: 'You have already submitted.' }, { status: 409 })
}
```

Adds ~150ms. Worth it if people will inevitably double-submit for laughs.

---

## 8. Screens

```
/            intro overlay → hero → judges → CTA
/apply       8 steps → review → submit → confetti → success → home
/apply       (already submitted) → locked card → home
/studio      Sanity Studio
```

### 8.1 Intro overlay

A `fixed inset-0` panel over an already-rendered hero.

1. Logo SVG paths animate with Motion's `pathLength` 0 → 1 (~1.1s, staggered).
2. Fill fades in (~0.3s).
3. Whole panel animates `y: "-100%"` with a custom ease and unmounts via
   `AnimatePresence`.

Because the hero is mounted underneath from first paint, there is no layout shift
and the animation does not block LCP.

Details people skip:

- Lock `document.body.style.overflow` while the overlay is up; restore on unmount.
- `sessionStorage` flag so a returning visitor does not sit through it again.
- `prefers-reduced-motion` → 300ms fade, no draw.
- Export the logo with **stroked paths**. A logo exported as filled compound paths
  cannot be drawn with `pathLength`. Ask for outlines-as-strokes from the designer,
  or trace a stroke-only version for the animation and swap to the real fill at the
  end.

### 8.2 Hero

Heading with staggered word-by-word entrance, one paragraph of description, one CTA
routing to `/apply`. Use a real route, not a scroll-to — the link gets shared in
Slack and should land people on the form.

Below: judge / host cards with a subtle tilt or parallax on hover. Ambient particle
canvas behind everything at low opacity.

### 8.3 Form shell

State machine in `FormShell.tsx`:

```
step: number        // 0..7 questions, 8 = review
direction: 1 | -1   // drives slide direction
status: 'idle' | 'submitting' | 'error' | 'success'
```

- One `useForm` instance for the whole flow, `mode: 'onChange'`.
- Advance with `await trigger(stepKeys(step))` — validates only the current
  question's fields.
- Next button disabled until the current step is valid.
- `Enter` advances when enabled. `Shift+Enter` inserts a newline in textareas.
- Back preserves everything.
- `AnimatePresence mode="wait"` with a `custom={direction}` prop so going back
  slides the other way.

### 8.4 Progress

Spring-animated `motion.div` width, plus a "3 of 8" label.

```tsx
<div role="progressbar" aria-valuenow={step + 1} aria-valuemin={1}
     aria-valuemax={TOTAL_QUESTIONS} aria-label="Progress">
```

Announce step changes with an `aria-live="polite"` region.

### 8.5 Review step

All eight answers listed with edit-jump links back to each step. Cheap to build,
and it noticeably reduces "wait I meant something else" messages afterwards.

### 8.6 Success

Fires only on a `200`. Shows the submission ID, a line about what happens next, and
one link home. No re-entry, no edit.

### 8.7 Locked state

If `latent:submitted:v1` exists, `/apply` renders a card instead of the form:
"You've already applied — `A7K2M9P4`" plus a home link.

Be clear with the team that this is UX, not security. Clearing site data bypasses
it. If you want real one-shot enforcement, use the dedupe query in §7.

---

## 9. Animation & effects

### Confetti

```ts
// components/fx/fireConfetti.ts
export async function fireConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const confetti = (await import('canvas-confetti')).default
  const colors = ['#F5C518', '#FF4D6D', '#5B8DEF', '#FFFFFF'] // brand palette

  const shoot = (angle: number, origin: { x: number; y: number }) =>
    confetti({ particleCount: 60, spread: 55, startVelocity: 55, angle, origin, colors })

  shoot(60, { x: 0, y: 0.7 })
  shoot(120, { x: 1, y: 0.7 })
  setTimeout(() => { shoot(60, { x: 0, y: 0.7 }); shoot(120, { x: 1, y: 0.7 }) }, 220)
}
```

Two angled cannons from the edges, not one centre burst — reads far better on a
phone. Dynamically imported so it stays out of the initial bundle. Fire on the
API's `200`, not on the click, or someone sees confetti for a failed submit.

### Ambient particles

Skip `tsparticles` — heavy and over-configured for this. Write ~60 lines of canvas:

- 30–50 slow-drifting dots, `requestAnimationFrame`
- `IntersectionObserver` pauses the loop when off-screen
- Cap `devicePixelRatio` at 2
- Bail out entirely on `prefers-reduced-motion`
- `pointer-events: none`, low opacity, behind content

Reduced motion overall: ambient off, intro becomes a fade, confetti becomes a
scale-in checkmark, step transitions become opacity-only.

---

## 10. Persistence

Three keys, deliberately separate:

| Key | Store | Purpose |
|---|---|---|
| `latent:draft:v1` | localStorage | `{ answers, step, startedAt }`, debounced 400ms |
| `latent:submitted:v1` | localStorage | `{ submissionId, at }` — drives the lock |
| `latent:introSeen` | sessionStorage | Skip the logo animation on repeat |

Rules:

- Draft expires after 48h — check `startedAt` on load and discard if stale.
- On resume, show a small bar: "Picked up where you left off · Start over" rather
  than silently restoring. Silent restore is confusing.
- Clear the draft the moment submission succeeds.
- Wrap every read and write in `try/catch`. Safari private mode throws on access.
- All storage reads go in `useEffect`, never during render, or you get a hydration
  mismatch.

```ts
// lib/storage.ts
export const safeGet = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch { return null }
}

export const safeSet = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* noop */ }
}

export const safeRemove = (key: string) => {
  try { localStorage.removeItem(key) } catch { /* noop */ }
}
```

Bump the `v1` suffix whenever the question set changes, so old drafts do not
restore into a mismatched form.

---

## 11. Design

The single highest-leverage choice is typography. A distinctive display face for
the question prompts does more for "modern and branded" than any animation.

- `next/font` — one display face for prompts and headings, one clean sans for UI.
- Big prompts. On desktop the question should be the only thing on screen.
- Restyle shadcn defaults heavily — default shadcn reads as templated. Change the
  radius, the border treatment, the focus ring, and the button fill.
- Tailwind 4 `@theme` block for brand tokens; do not hardcode hexes in components.
- Dark by default suits a show format, but check the logo works on it.

### Judge / host imagery

- **If these are real teammates, use real photos.** AI likenesses of people the
  audience knows will look wrong, and the joke lands worse. Run real photos through
  one consistent treatment — duotone, grain, hard crop.
- If they are invented personas, generate all of them in **one session with a fixed
  style prompt and consistent seed**. Mismatched lighting across four portraits is
  the giveaway.
- Spec: 3:4 portrait, 1200×1600 source, exported AVIF + WebP, `next/image` with
  `sizes`, `priority` only on above-fold cards.
- A shared colour-grade pass in post does more for cohesion than prompt tweaking.

---

## 12. Optional — presenter view

Genuinely useful for the actual session, since the whole point is reading answers
back and asking follow-ups.

`/present` — a server component (needs a token; the dataset is private) that fetches
all submissions and shows one person at a time with arrow-key navigation. Big type,
one answer revealed at a time, host notes visible.

Protect it with Vercel password protection or a simple middleware check on a shared
secret in the URL. Do not leave it open.

```ts
// lib/sanity/queries.ts
export const ALL_SUBMISSIONS = `
  *[_type == "submission"] | order(submittedAt asc) {
    submissionId, name, age, town, song, purchase, amountInr,
    q4, call3am, voicemail, q6, q7, timeWaster, efficient, q8Why,
    reviewerNotes
  }
`
```

---

## 13. Accessibility

Not optional, and cheap if done as you go rather than bolted on.

- **On each step change, move focus to the question heading**, not the first input.
  Otherwise screen reader users land in a text field with no idea what changed.
  Give the heading `tabIndex={-1}` and call `.focus()` in an effect on `step`.
- `aria-live="polite"` on the progress label.
- Real `<label>` for every input, `aria-describedby` for help text and errors,
  `aria-invalid` when invalid.
- The whole flow must be completable keyboard-only. Test it once end to end.
- Focus-visible rings on everything, including the custom-styled buttons.
- Error messages next to the field, not only in a toast.

---

## 14. Build phases

| # | Phase | Work | Depends on |
|---|---|---|---|
| 0 | Setup | Sanity project created, dataset set **private**, write token issued, team invited, logo SVG prepared with stroked paths, judge photos sourced | — |
| 1 | Foundation | Scaffold, Tailwind tokens, fonts, `questions.ts`, `schema.ts`, shadcn install | 0 |
| 2 | Landing | Logo draw animation, intro overlay, hero, judge cards, ambient particles | 1 |
| 3 | Form engine | Step machine, field renderer, compound layouts, per-step validation gating, progress, draft persistence, review step | 1 |
| 4 | Data | Sanity schema deployed, Studio at `/studio`, submit route, error + retry states | 0, 3 |
| 5 | Finish | Confetti, success screen, lockout state | 3, 4 |
| 6 | Polish | A11y pass, reduced motion, mobile, OG image, Lighthouse | all |
| 7 | Ship | Deploy, live test submission, verify document in Studio, confirm dataset is private | 6 |
| 8 | Optional | Presenter view, CSV export | 7 |

Phases 2 and 3 are independent — parallelise if two people are on it.

---

## 15. Gotchas checklist

- [ ] Dataset is **private** — verify by hitting the public API without a token
- [ ] `SANITY_WRITE_TOKEN` has no `NEXT_PUBLIC_` prefix
- [ ] `writeClient.ts` imports `server-only`
- [ ] `useCdn: false` on the write client
- [ ] `apiVersion` is a pinned date string, not `"v1"` or `"latest"`
- [ ] Route handler has `export const runtime = 'nodejs'`
- [ ] Logo SVG uses stroked paths, or `pathLength` will do nothing
- [ ] All `localStorage` access is inside `useEffect` and wrapped in `try/catch`
- [ ] Confetti fires on the response, not the click
- [ ] Draft cleared on successful submit
- [ ] Focus moves to the heading on step change
- [ ] Env vars added to Vercel for Production and Preview
- [ ] `/studio` and `/present` are not indexable — `robots.txt` disallow
- [ ] Tested end to end on a real phone, not just a narrow browser window
