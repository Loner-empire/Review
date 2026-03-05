# Youth Spark Careers

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (local)
- **Storage**: Local filesystem
- **Auth**: JWT stored in httpOnly cookies
- **Email**: Console logging (optional SMTP)

## Prerequisites

- Node.js 18+
- PostgreSQL 13+

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd youth-spark-careers
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Database (required)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/postgres

# JWT Secret (required - any random string)
JWT_SECRET=your-secret-key-here-minimum-32-characters-long

# Admin email for notifications (optional)
ADMIN_EMAIL=admin@localhost

# App URL (optional, defaults to localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMTP (optional - only if you want email notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Storage (optional - for production file uploads)
# STORAGE_TYPE=local  # or "s3" for AWS S3
# AWS_S3_BUCKET=your-bucket-name
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key

# Error Tracking (optional - for production monitoring)
# NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```
## Security Notes

- All cookies are `httpOnly`, `secure` (in production), and `sameSite: strict`
- Passwords are hashed using `bcryptjs` with a cost factor of 12
- File uploads are type-checked and size-limited server-side
- Rate limiting is applied to form submissions and login attempts (database-backed for production)
- Security headers (X-Frame-Options, X-Content-Type-Options) are set via `next.config.js`
- All sensitive configuration is stored in environment variables

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure `DATABASE_URL` with production PostgreSQL
- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure `ADMIN_EMAIL` for notifications
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Configure SMTP for email notifications (optional)
- [ ] Configure AWS S3 for file storage (recommended for serverless)
- [ ] Configure Sentry DSN for error tracking (recommended)
- [ ] Run database migrations: `psql -U postgres -d postgres -f schema.sql`
- [ ] Test health endpoint: `GET /api/health`

### Health Check

Production deployments should use the health endpoint for load balancer checks:

```
bash
curl https://your-domain.com/api/health
```

Response includes database status and latency.
