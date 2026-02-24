import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Youth Spark Careers team.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-slate-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have a question about an application, a job listing, or just want to learn more
              about what we do? We are happy to hear from you.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <a
                  href="mailto:info@youthsparkcareers.co.za"
                  className="text-brand-600 hover:text-brand-700 text-sm"
                >
                  info@youthsparkcareers.co.za
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Follow Us</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Facebook", href: "https://facebook.com" },
                    { label: "LinkedIn", href: "https://linkedin.com" },
                    { label: "Twitter / X", href: "https://twitter.com" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
                <p className="text-sm text-gray-600">South Africa (Remote-first team)</p>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
