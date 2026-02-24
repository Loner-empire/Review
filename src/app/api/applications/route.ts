import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { Application } from "@/types";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendApplicationNotification } from "@/lib/email";
import { uploadFile, ALLOWED_MIME_TYPES, FILE_LIMITS } from "@/lib/storage";

// Returns all applications (admin only)
export async function GET(req: NextRequest) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const params: unknown[] = [];
  let sql = "SELECT * FROM applications";

  if (status) {
    params.push(status);
    sql += ` WHERE status = $1`;
  }

  sql += " ORDER BY created_at DESC";

  const applications = await query<Application>(sql, params);
  return NextResponse.json(applications);
}

// Submit a new application
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(`apply:${ip}`, { maxRequests: 3, windowMs: 15 * 60 * 1000 });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const formData = await req.formData();

  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const positionApplied = (formData.get("position_applied") as string)?.trim();
  const jobId = formData.get("job_id") as string | null;
  const coverLetter = (formData.get("cover_letter") as string)?.trim() || null;
  const cvFile = formData.get("cv") as File | null;
  const certFile = formData.get("certificates") as File | null;

  // Server-side validation
  if (!fullName || !email || !phone || !positionApplied || !cvFile) {
    return NextResponse.json(
      { error: "Full name, email, phone, position and CV are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (cvFile.size > FILE_LIMITS.cv) {
    return NextResponse.json({ error: "CV file must be under 5 MB." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.cv.includes(cvFile.type)) {
    return NextResponse.json(
      { error: "CV must be a PDF or DOCX file." },
      { status: 400 }
    );
  }

  // Upload CV
  const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
  const { url: cvUrl } = await uploadFile(cvBuffer, cvFile.name, cvFile.type, "cvs");

  // Upload certificates if provided
  let certUrl: string | null = null;
  if (certFile && certFile.size > 0) {
    if (certFile.size > FILE_LIMITS.certificates) {
      return NextResponse.json(
        { error: "Certificates file must be under 5 MB." },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME_TYPES.certificates.includes(certFile.type)) {
      return NextResponse.json(
        { error: "Certificates must be a PDF file." },
        { status: 400 }
      );
    }
    const certBuffer = Buffer.from(await certFile.arrayBuffer());
    const { url } = await uploadFile(certBuffer, certFile.name, certFile.type, "certificates");
    certUrl = url;
  }

  const application = await queryOne<Application>(
    `INSERT INTO applications
       (full_name, email, phone, position_applied, job_id, cv_url, certificates_url, cover_letter)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [fullName, email, phone, positionApplied, jobId || null, cvUrl, certUrl, coverLetter]
  );

  // Send email notification (non-blocking – don't fail the request if email fails)
  sendApplicationNotification({
    fullName,
    email,
    phone,
    positionApplied,
  }).catch((err) => console.error("Email notification failed:", err));

  return NextResponse.json(application, { status: 201 });
}
