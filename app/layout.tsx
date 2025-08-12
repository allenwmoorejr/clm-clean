// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { LiveTakeover } from "@/components/LiveTakeover";
import PWA from "@/components/PWA";

export const metadata: Metadata = {
  // 👇 This removes the warnings and makes OG/Twitter URLs absolute
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
  twitter: { card: "summary_large_image", title: "CLM", description: "Live and sermons from CLM" },
};

