import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      licenseNumber,
      yearsExperience,
      serviceArea,
      projectTypes,
    } = body;

    if (!firstName || !lastName || !email || !phone || !company || !yearsExperience || !serviceArea || !projectTypes?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.contractorApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        licenseNumber: licenseNumber || null,
        yearsExperience,
        serviceArea,
        projectTypes: Array.isArray(projectTypes) ? projectTypes.join(",") : projectTypes,
      },
    });

    // Send notification email via Resend
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "PK Cabinets Portal <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL,
        subject: `New Contractor Application: ${firstName} ${lastName}`,
        html: `
          <h2>New Contractor Application</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>License #:</strong> ${licenseNumber || "N/A"}</p>
          <p><strong>Experience:</strong> ${yearsExperience}</p>
          <p><strong>Service Area:</strong> ${serviceArea}</p>
          <p><strong>Project Types:</strong> ${Array.isArray(projectTypes) ? projectTypes.join(", ") : projectTypes}</p>
        `,
      });
    }

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
