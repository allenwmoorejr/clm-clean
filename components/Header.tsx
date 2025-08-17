// components/Header.tsx
"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LiveBadge } from "@/components/LiveBadge";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const nav: { href: Route; label: string }[] = [
  { href: "/" as Route, label: "Home" },
  { href: "/watch" as Route, label: "Watch Live" },
  { href: "/sermons" as Route, label: "Sermons" },
  { href: "/events" as Route, label: "Events" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition
      ${scrolled ? "backdrop-blur bg-white/5 border-b border-white/10" : "backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10"}`}>
      <div className="container grid grid-cols-2 md:grid-cols-3 items-center h-16">
        {/* Brand */}
        <Link
          href={"/" as Route}
          className="flex items-center gap-2 font-semibold tracking-tight text-lg focus:outline-none focus-visible:ring-2 ring-brand-600 rounded-xl px-1"
        >
          <NextImage src="/logo.svg" alt="CLM logo" width={32} height={32} />
          <span className="gradient-title">CLM</span>
          <span className="text-white/60 text-sm">Christ Like Ministries</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 relative justify-self-center">
          {/* sliding “pill” highlight */}
          <div className="relative flex items-center gap-2">
            {nav.map((item) => {
              const active = path === item.href;
              return (
                <div key={item.href} className="relative">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative z-10 px-3 py-2 text-sm rounded-xl hover:text-white focus:outline-none focus-visible:ring-2 ring-brand-600
                      ${active ? "text-white" : "text-white/75 hover:bg-white/5"}`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Right side: Live + CTA */}
        <div className="hidden md:flex items-center gap-4 justify-self-end">
          <div className="hidden lg:block"><LiveBadge /></div>
          <Link href={"/give" as Route} className="btn-primary">Give</Link>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-3 justify-self-end">
          <Link href={"/watch" as Route} className="btn-primary">Watch</Link>
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded-xl hover:bg-white/10 focus-visible:ring-2 ring-brand-600">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute top-16 left-4 right-4 bg-[#0b1020]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col gap-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <LiveBadge />
              <nav className="flex flex-col gap-2">
                {nav.map((item) => {
                  const active = path === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-3 rounded-xl focus-visible:ring-2 ring-brand-600 ${active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-2">
                <Link href={"/give" as Route} className="btn-primary w-full justify-center">Give</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

