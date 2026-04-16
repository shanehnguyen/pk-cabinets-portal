import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Resend } from "resend";

function generatePassword(length = 12): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

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

  if (application.status === "APPROVED") {
    return NextResponse.json(
      { error: "Application already approved" },
      { status: 400 }
    );
  }

  const tempPassword = generatePassword();
  const passwordHash = await hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: {
      email: application.email,
      name: `${application.firstName} ${application.lastName}`,
      passwordHash,
      applicationId: application.id,
    },
  });

  await prisma.contractorApplication.update({
    where: { id },
    data: { status: "APPROVED", reviewedAt: new Date() },
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "PK Cabinets Portal <onboarding@resend.dev>",
        to: application.email,
        subject: "Your PK Cabinets Contractor Account is Ready",
        html: `
          <h2>Welcome to PK Cabinets, ${application.firstName}!</h2>
          <p>Your contractor application has been approved. You can now log in to the contractor portal.</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          <p>Please change your password after your first login.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }
  }

  return NextResponse.json({ success: true, userId: user.id });
}
