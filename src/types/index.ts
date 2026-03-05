export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  location: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  position_applied: string;
  job_id: string | null;
  cv_url: string;
  certificates_url: string | null;
  cover_letter: string | null;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string | null;
  is_published: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}
