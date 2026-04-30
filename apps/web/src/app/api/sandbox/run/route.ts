import { NextResponse } from "next/server";
import { z } from "zod";

const runSchema = z.object({
  projectId: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(50),
  input: z.unknown(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = runSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const baseUrl =
    process.env.SANDBOX_RUNNER_URL ?? process.env.NEXT_PUBLIC_SANDBOX_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Sandbox runner URL not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data: unknown = await response.json().catch(() => null);
  return NextResponse.json(data, { status: response.status });
}
