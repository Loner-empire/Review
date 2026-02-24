-- Youth Spark Careers Database Schema
-- Run this file against your PostgreSQL database to set up all tables.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position_applied VARCHAR(255) NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  cv_url TEXT NOT NULL,
  certificates_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);

-- Sample job data relevant to South African youth employment
INSERT INTO jobs (title, description, requirements, benefits, location, category) VALUES
(
  'Junior Customer Service Agent',
  'We are looking for enthusiastic young South Africans to join our customer service team. You will be the first point of contact for our customers, handling queries via phone, email, and live chat. This is an excellent entry-level opportunity for matriculants and recent graduates who want to build a career in the service industry.',
  '- Grade 12 (Matric) certificate
- Strong verbal and written communication skills in English
- Basic computer literacy
- Ability to work shifts including weekends
- Positive attitude and willingness to learn',
  '- Market-related salary
- Full training provided
- Medical aid contribution
- Employee wellness programme
- Opportunities for promotion within 12 months',
  'Johannesburg, Gauteng',
  'Customer Service'
),
(
  'Retail Sales Assistant',
  'A leading South African retail chain is recruiting motivated young individuals for sales assistant positions across our Gauteng stores. You will assist customers, manage stock, and help maintain an excellent shopping environment. No prior retail experience is required as full training will be provided.',
  '- Grade 12 or NQF Level 4 equivalent
- Must be between 18 and 35 years old
- Fluent in at least two South African languages
- Willingness to work weekends and public holidays
- Basic numeracy skills',
  '- Competitive salary plus performance incentives
- Uniform provided
- Staff discount
- SETA-accredited retail skills training
- UIF and PAYE compliance',
  'Pretoria, Gauteng',
  'Retail'
),
(
  'Learnerships: IT Support Technician',
  'This 12-month SETA-accredited learnership programme offers young unemployed South Africans the chance to gain a nationally recognised IT qualification (NQF Level 4) while earning a monthly stipend. Learners will gain practical experience supporting end users, setting up workstations, and performing basic network troubleshooting.',
  '- South African citizen aged 18 to 35
  - Grade 12 with Maths or Technical subjects recommended
  - No prior IT experience necessary
  - Must be currently unemployed
  - Passion for technology and problem-solving',
  '- Monthly stipend of R3500
  - MICT SETA registered qualification
  - Practical workplace experience
  - Certificate upon successful completion
  - Potential for permanent employment',
  'Cape Town, Western Cape',
  'Learnership'
),
(
  'Data Capturer – Government Project',
  'A government-funded community development project requires data capturers to assist with community survey fieldwork and data entry. This is a 6-month contract position with the possibility of renewal. Candidates from the local community are strongly encouraged to apply.',
  '- Matric certificate (Grade 12)
  - Computer literate (MS Word, Excel, email)
  - Ability to work independently in the field
  - Own transport or reliable commute to work
  - Attention to detail and basic report writing skills',
  '- Monthly stipend
  - Government project experience for your CV
  - Subsistence allowance for fieldwork
  - Certificate of completion',
  'Durban, KwaZulu-Natal',
  'Administration'
),
(
  'Assistant Chef – Hotel & Catering',
  'A 4-star hotel in Sandton is recruiting junior kitchen staff to work under our executive chef team. This is a permanent position offering comprehensive on-the-job training. Candidates who have completed a hospitality learnership or culinary course will be preferred, but motivated individuals with a passion for food are welcome to apply.',
  '- Grade 12 or a hospitality certificate/diploma
  - Basic food hygiene knowledge
  - Ability to work long hours in a fast-paced kitchen
  - Team player with a willingness to learn
  - Punctual and reliable',
  '- Full kitchen training under qualified chefs
  - Meals on duty
  - Accommodation assistance available
  - Pathway to sous chef positions
  - Annual performance review and salary increase',
  'Sandton, Gauteng',
  'Hospitality'
);
