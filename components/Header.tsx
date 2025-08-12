"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LiveBadge } from "@/components/LiveBadge";

const nav = [
  { href: "/", label: "Home" },
  { href: "/watch", label: "Watch Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  // add back others when ready:
  // { href: "/beliefs", label: "Beliefs" },
  // { href: "/pastor", label: "Pastor" },
  // { href: "/prayer", label: "Prayer" },
  // { href: "/give", label: "Give" },
];

export function Header() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          CLM <span className="text-white/60 ml-2 text-sm">Christ Like Ministries</span>
        </Link>

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
        <Link href="/watch" className="btn-primary md:hidden inline-flex">Watch Live</Link>
      </div>
    </header>
  );
}

