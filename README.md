# Youth Spark Careers

A South African youth employment platform built with Next.js 14, PostgreSQL, and S3-compatible cloud storage.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Storage**: S3-compatible (AWS S3 or Supabase Storage)
- **Auth**: JWT stored in httpOnly cookies
- **Email**: Nodemailer (SMTP)

---

## Project Structure

```
src/
  app/
    (public pages)    - page.tsx, jobs/, apply/, blog/, contact/
    admin/            - login/, dashboard/, jobs/, applications/, blog/
    api/              - REST API routes
  components/         - Shared React components
  lib/                - db.ts, auth.ts, storage.ts, email.ts, rateLimit.ts
  types/              - index.ts (shared TypeScript types)
scripts/
  create-admin.js     - CLI to create admin users
schema.sql            - Database schema and sample data
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- An S3-compatible storage bucket (AWS S3 or Supabase Storage)
- SMTP credentials (Gmail app password works well)

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd youth-spark-careers
npm install
```

### 2. Environment Variables

Copy the template:

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_SECRET` | Random string (32+ chars). Use: `openssl rand -hex 32` |
| `STORAGE_BUCKET` | S3 bucket name |
| `STORAGE_REGION` | AWS region or Supabase region |
| `STORAGE_ACCESS_KEY_ID` | S3 access key |
| `STORAGE_SECRET_ACCESS_KEY` | S3 secret key |
| `STORAGE_ENDPOINT` | S3 endpoint URL |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP port (587 for TLS) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password or app password |
| `ADMIN_EMAIL` | Email address to receive notifications |
| `NEXT_PUBLIC_APP_URL` | Full URL of your deployment |

---

### 3. Database Configuration

#### Option A: Local PostgreSQL

```bash
createdb youth_spark_careers
psql youth_spark_careers < schema.sql
```

#### Option B: Hosted PostgreSQL (Supabase, Neon, Railway, etc.)

1. Create a database in your provider's dashboard
2. Copy the connection string into `DATABASE_URL` in `.env.local`
3. Run the schema:

```bash
psql $DATABASE_URL < schema.sql
```

The schema creates the following tables: `jobs`, `applications`, `blog_posts`, `admin_users`, plus indexes and sample job data.

---

### 4. Storage Setup

#### Option A: AWS S3

1. Create an S3 bucket in your AWS console
2. Set the bucket region (e.g. `af-south-1` for South Africa)
3. Create an IAM user with `s3:PutObject`, `s3:DeleteObject` permissions on the bucket
4. Set `STORAGE_ENDPOINT` to `https://s3.<region>.amazonaws.com`
5. Enable public read access on the bucket, or set a bucket policy for public `GetObject`

#### Option B: Supabase Storage

1. Go to your Supabase project → Storage
2. Create a new bucket (e.g. `youth-spark-uploads`)
3. Set it to public
4. Use your Supabase S3-compatible credentials:
   - `STORAGE_ENDPOINT`: `https://<project-ref>.supabase.co/storage/v1/s3`
   - `STORAGE_REGION`: Your Supabase region
   - Access keys: Available in Supabase → Settings → Storage → S3 Access Keys

---

### 5. Create the First Admin User

```bash
node scripts/create-admin.js admin@youthsparkcareers.co.za yourpassword superadmin
```

You can run this against your production database by passing the correct `DATABASE_URL` in `.env.local`.

---

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Deployment on Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Set the **Framework Preset** to `Next.js`

### Step 3: Add Environment Variables

In Vercel → your project → **Settings** → **Environment Variables**, add all variables from your `.env.local` file. Make sure `NEXT_PUBLIC_APP_URL` is set to your production URL (e.g. `https://youthsparkcareers.co.za`).

### Step 4: Deploy

Click **Deploy**. Vercel will build and deploy automatically.

> **Note on the rate limiter**: The default in-memory rate limiter works fine on Vercel serverless but will reset on each cold start. For production traffic, replace it with a Redis-based solution (e.g. Upstash) by updating `src/lib/rateLimit.ts`.

---

## Admin User Management

To add or update admin users:

```bash
# Create a new admin
node scripts/create-admin.js newadmin@example.com password123 admin

# Update a password (re-runs with the same email)
node scripts/create-admin.js admin@example.com newpassword superadmin
```

Admin roles:
- `admin` – full access to applications, jobs, blog
- `superadmin` – same as admin (extend as needed)

---

## Security Notes

- All cookies are `httpOnly`, `secure` (in production), and `sameSite: strict`
- Passwords are hashed using `bcryptjs` with a cost factor of 12
- File uploads are type-checked and size-limited server-side before storage
- Rate limiting is applied to form submissions and login attempts
- Security headers (X-Frame-Options, X-Content-Type-Options) are set via `next.config.js`
- All sensitive configuration is stored in environment variables

---

## Email Configuration (Gmail)

If using Gmail for SMTP:
1. Enable 2-factor authentication on the Google account
2. Create an App Password: Google Account → Security → App Passwords
3. Use the generated 16-character password as `SMTP_PASS`
4. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
