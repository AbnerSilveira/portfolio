import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "RESEND_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body: unknown = await request.json();
    const data = contactSchema.parse(body);

    const from = process.env.CONTACT_FROM_EMAIL ?? "portfolio@example.com";
    const to = process.env.CONTACT_TO_EMAIL ?? "you@example.com";

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `[Portfolio] Contato de ${data.name}`,
      replyTo: data.email,
      text: data.message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 },
    );
  }
}
