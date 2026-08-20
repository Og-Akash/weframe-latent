import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { writeClient } from "@/lib/sanity/writeClient";
import { fullSchema } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { timeTakenSec, ...answers } = (body ?? {}) as Record<string, unknown>;

  const parsed = fullSchema.safeParse(answers);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;

  try {
    const existing = await writeClient.fetch<number>(
      `count(*[_type == "submission" && lower(name) == $n])`,
      { n: d.name.toLowerCase().trim() },
    );
    if (existing > 0) {
      return NextResponse.json({ error: "You have already submitted." }, { status: 409 });
    }
  } catch (err) {
    console.error("[submit] Sanity dedupe check failed", err);
    return NextResponse.json({ error: "Could not save. Try again." }, { status: 502 });
  }

  const submissionId = nanoid(8).toUpperCase();

  try {
    await writeClient.create({
      _type: "submission",
      submissionId,
      submittedAt: new Date().toISOString(),
      timeTakenSec: typeof timeTakenSec === "number" ? timeTakenSec : null,
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
      status: "new",
    });
  } catch (err) {
    console.error("[submit] Sanity write failed", err);
    return NextResponse.json({ error: "Could not save. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, submissionId });
}
