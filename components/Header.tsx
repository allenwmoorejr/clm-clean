// components/Header.tsx
"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LiveBadge } from "@/components/LiveBadge";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const nav: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/watch", label: "Watch Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
      <div className="container flex items-center justify-between h-16">
        <Link href={"/" as Route} className="font-semibold tracking-tight text-lg">
          CLM <span className="text-white/60 ml-2 text-sm">Christ Like Ministries</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 relative">
          {nav.map((item) => {
            const active = path === item.href;
            return (
              <span key={item.href} className="relative py-2">
                <Link
                  href={item.href}
                  className={`text-sm hover:text-white ${active ? "text-white" : "text-white/70"}`}
                >
                  {item.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-white/80 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </span>
            );
          })}
        </nav>

        <div className="hidden md:block"><LiveBadge /></div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-3">
          <Link href={"/watch" as Route} className="btn-primary">Watch</Link>
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded-xl hover:bg-white/10">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-[#0b1020] border-l border-white/10 p-6 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>
              <LiveBadge />
              <nav className="flex flex-col gap-3">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-3 rounded-xl ${path === item.href ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Link href={"/give" as Route} className="btn-primary w-full justify-center">Give</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

