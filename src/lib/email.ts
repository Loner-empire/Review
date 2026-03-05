import nodemailer from "nodemailer";

// Only create transporter if SMTP is configured
const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendApplicationNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  positionApplied: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Log to console for local development
  console.log("=== NEW APPLICATION RECEIVED ===");
  console.log(`Name: ${data.fullName}`);
  console.log(`Email: ${data.email}`);
  console.log(`Phone: ${data.phone}`);
  console.log(`Position: ${data.positionApplied}`);
  console.log(`View at: ${appUrl}/admin/dashboard`);
  console.log("================================");

  // Send email if SMTP is configured
  if (transporter && adminEmail) {
    try {
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
      console.log("Email notification sent successfully");
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  // Log to console for local development
  console.log("=== NEW CONTACT FORM SUBMISSION ===");
  console.log(`Name: ${data.name}`);
  console.log(`Email: ${data.email}`);
  console.log(`Message: ${data.message}`);
  console.log("===================================");

  // Send email if SMTP is configured
  if (transporter && adminEmail) {
    try {
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
      console.log("Email notification sent successfully");
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }
}
