import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendApplicationNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  positionApplied: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  await transporter.sendMail({
    from: `"Youth Spark Careers" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Application: ${data.positionApplied}`,
    html: `
      <h2>New Job Application Received</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Position:</strong> ${data.positionApplied}</p>
      <p><a href="${appUrl}/admin/dashboard">View in Admin Dashboard</a></p>
    `,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!;

  await transporter.sendMail({
    from: `"Youth Spark Careers" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Contact Form: Message from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <h3>Message:</h3>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}
