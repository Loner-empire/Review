import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Only load the weights actually used to keep the font payload small
const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8770a",
};

export const metadata: Metadata = {
  title: {
    default: "Youth Spark Careers",
    template: "%s | Youth Spark Careers",
  },
  description:
    "Connecting South African youth to meaningful employment. Find verified jobs, learnerships, and career resources — free to apply.",
  keywords: ["jobs South Africa", "youth employment", "learnerships", "matric jobs", "entry level jobs SA", "careers"],
  authors: [{ name: "Youth Spark Careers" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Youth Spark Careers",
    title: "Youth Spark Careers — South African Youth Employment Platform",
    description:
      "Find verified jobs and learnerships for young South Africans aged 18–35. Free to apply.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Spark Careers",
    description: "Verified jobs and learnerships for South African youth.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* DNS prefetch for storage and font CDNs */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
