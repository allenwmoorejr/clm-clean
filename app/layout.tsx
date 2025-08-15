// app/layout.tsx
import UXEffects from "@/components/UXEffects";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Scenery from "@/components/Scenery";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { LiveTakeover } from "@/components/LiveTakeover";
import PWA from "@/components/PWA";
import WelcomeIntro from "@/components/WelcomeIntro";
import Lightning from "@/components/Lightning";


// ✅ Set a proper absolute base for OG/Twitter URLs
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://allenwmoorejr.org"),
  title: "Christ Like Ministries — Live & Sermons",
  description: "Watch live and explore sermon videos from Christ Like Ministries (CLM).",
  openGraph: {
    title: "Christ Like Ministries — Live & Sermons",
    description: "Join us Sundays at 10:00am CT and browse past messages.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://allenwmoorejr.org",
    siteName: "CLM",
    images: [{ url: "/api/og?title=Christ+Like+Ministries&subtitle=Live+Sundays+10:00am+CT" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLM",
    description: "Live and sermons from CLM",
  },
};

// ✅ Server component layout signature (NO "use client" here)
// …

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* … */}</head>
      <body>
        <Scenery />
        <Lightning />  {/* ⚡️ subtle, random strikes behind content */}
        <AnnouncementsBar />
        <LiveTakeover />
        <div className="relative z-20 flex flex-col min-h-dvh md:min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <a href={process.env.NEXT_PUBLIC_GIVING_URL || "/give"} className="sticky-cta btn-primary">Give</a>
        <PWA />
        <UXEffects />
      </body>
    </html>
  );
}
// app/layout.tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",      // use the full screen on iOS notch devices
  themeColor: "#0b1020",
};

