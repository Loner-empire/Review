# Deployment Guide — GitHub → Vercel

## Step 1: Push to GitHub

Open a terminal on your local machine and run these commands one at a time:

```bash
# Download the zip you got from Claude, then unzip it
# Navigate into the project folder
cd youth-spark-careers

# Initialize git (the repo is already set up — just push it)
git init
git branch -m main
git remote add origin https://github.com/Loner-empire/Youth-Spark-Careers.git
git add -A
git commit -m "Initial commit: Youth Spark Careers"
git push -u origin main
```

If GitHub asks for your credentials:
- Username: your GitHub username
- Password: use a **Personal Access Token** (not your password)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Select scope: `repo`
  - Copy the token and paste it as the password

---

## Step 2: Set Up a PostgreSQL Database (Neon — free tier)

1. Go to https://neon.tech and create a free account
2. Create a new project, name it `youth-spark-careers`
3. Copy the **Connection string** — it looks like:
   `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Open the **SQL Editor** in Neon and paste + run the contents of `schema.sql`
   - This creates all tables and inserts the sample jobs

---

## Step 3: Set Up Storage (Supabase — free tier)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Storage** → **New Bucket**, name it `youth-spark-uploads`, set it to **Public**
4. Go to **Project Settings** → **Storage** → **S3 Connection** — copy:
   - Endpoint URL (your `STORAGE_ENDPOINT`)
   - Region (your `STORAGE_REGION`)
   - Access Key ID (your `STORAGE_ACCESS_KEY_ID`)
   - Secret Access Key (your `STORAGE_SECRET_ACCESS_KEY`)

---

## Step 4: Deploy to Vercel

1. Go to https://vercel.com and sign in with your GitHub account
2. Click **Add New Project**
3. Find and import `Youth-Spark-Careers` from your GitHub repos
4. Vercel will auto-detect it as Next.js — no build settings to change
5. Before clicking Deploy, click **Environment Variables** and add all of these:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Any random 32+ character string |
| `STORAGE_BUCKET` | `youth-spark-uploads` |
| `STORAGE_REGION` | From Supabase S3 settings |
| `STORAGE_ACCESS_KEY_ID` | From Supabase S3 settings |
| `STORAGE_SECRET_ACCESS_KEY` | From Supabase S3 settings |
| `STORAGE_ENDPOINT` | From Supabase S3 settings |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your Gmail App Password (see below) |
| `ADMIN_EMAIL` | Email to receive notifications |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (add after first deploy) |

6. Click **Deploy**

---

## Step 5: Gmail App Password (for email notifications)

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** if not already on
3. Search for **App Passwords**
4. Select App: **Mail**, Device: **Other** → type "Youth Spark"
5. Copy the 16-character password → use as `SMTP_PASS`

---

## Step 6: Create the First Admin User

After your first Vercel deploy, run this locally with your production database URL:

```bash
# In the project folder
DATABASE_URL="your-neon-connection-string" node scripts/create-admin.js admin@yourdomain.com yourpassword superadmin
```

Or add `DATABASE_URL` to a local `.env.local` file first, then:

```bash
node scripts/create-admin.js admin@yourdomain.com yourpassword superadmin
```

Then visit: `https://your-app.vercel.app/admin/login`

---

## Step 7: Update NEXT_PUBLIC_APP_URL

After your first deploy, Vercel gives you a URL like `https://youth-spark-careers.vercel.app`:

1. Go to Vercel → your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
3. Redeploy: Vercel → your project → **Deployments** → click the three dots on the latest → **Redeploy**

---

## Future Deployments

Every `git push origin main` will automatically trigger a new Vercel deployment.

```bash
# Make a change, then:
git add -A
git commit -m "your message"
git push origin main
```

Vercel builds and deploys within about 60 seconds.
