import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-xs">
                YS
              </span>
              <span className="text-white font-display font-bold text-base">
                Youth Spark Careers
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting South African youth to meaningful employment. We believe every young
              person deserves a fair chance to build a career.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@youthsparkcareers.co.za"
                  className="hover:text-white transition-colors"
                >
                  info@youthsparkcareers.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Youth Spark Careers. All rights reserved. South
            Africa.
          </p>
        </div>
      </div>
    </footer>
  );
}
