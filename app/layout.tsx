// app/layout.tsx
import UXEffects from "@/components/UXEffects";
import "./globals.css";
import type { Metadata } from "next";
import Scenery from "@/components/Scenery";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { LiveTakeover } from "@/components/LiveTakeover";
import PWA from "@/components/PWA";
import WelcomeIntro from "@/components/WelcomeIntro";
import Lightning from "@/components/Lightning";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });


// ✅ Set a proper absolute base for OG/Twitter URLs
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://allenwmoorejr.org"),
  title: "Christ Like Ministries — Live & Sermons",
  description:
    "Preaching the gospel to the world in hopes that many will be saved. Teaching the saved how to stay saved.",
  openGraph: {
    title: "Christ Like Ministries — Live & Sermons",
    description:
      "Preaching the gospel to the world in hopes that many will be saved. Teaching the saved how to stay saved.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://allenwmoorejr.org",
    siteName: "CLM",
    images: [
      { url: "/api/og?title=Christ+Like+Ministries&subtitle=Preaching+the+gospel+to+the+world" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLM",
    description:
      "Preaching the gospel to the world in hopes that many will be saved. Teaching the saved how to stay saved.",
  },
};

// ✅ Server component layout signature (NO "use client" here)
// …

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* … */}</head>
      <body className={poppins.className}>
        <Scenery />
        <Lightning />  {/* ⚡️ subtle, random strikes behind content */}
        <ScrollProgress />
        <AnnouncementsBar />
        <LiveTakeover />
        <WelcomeIntro />
        <div className="relative z-20 flex flex-col min-h-dvh md:min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollToTop />
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

