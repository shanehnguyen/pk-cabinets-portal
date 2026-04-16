import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const password = request.headers.get("x-admin-password");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const application = await prisma.contractorApplication.findUnique({
    where: { id },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  if (application.status === "REJECTED") {
    return NextResponse.json(
      { error: "Application already rejected" },
      { status: 400 }
    );
  }

  await prisma.contractorApplication.update({
    where: { id },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });

  const body = await request.json().catch(() => ({}));

  if (body.sendEmail && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "PK Cabinets Portal <onboarding@resend.dev>",
        to: application.email,
        subject: "PK Cabinets Contractor Application Update",
        html: `
          <h2>Application Update</h2>
          <p>Hi ${application.firstName},</p>
          <p>Thank you for your interest in the PK Cabinets contractor program. After reviewing your application, we are unable to approve it at this time.</p>
          <p>If you have questions, please contact us.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }
  }

  return NextResponse.json({ success: true });
}
