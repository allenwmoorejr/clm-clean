// components/WelcomeIntro.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";

const SHOW_EVERY_DAYS = 7; // show at most once per N days

export default function WelcomeIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const key = "clm-welcome-seen-at";
      const prev = localStorage.getItem(key);
      const now = Date.now();
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

      // show if never seen or older than SHOW_EVERY_DAYS
      const shouldShow =
        !prev || now - Number(prev) > SHOW_EVERY_DAYS * 24 * 60 * 60 * 1000;

      if (shouldShow && !reduced) {
        setShow(true);
        // auto-dismiss after a few seconds
        const t = setTimeout(() => finish(), 3300);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  function finish() {
    try {
      localStorage.setItem("clm-welcome-seen-at", String(Date.now()));
    } catch {}
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Glow halo */}
          <motion.div
            className="absolute -inset-20 -z-10 blur-3xl opacity-40"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            exit={{ scale: 0.95, opacity: 0 }}
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(99,102,241,.6), rgba(34,211,238,.4) 40%, transparent 70%)",
            }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-xl card px-8 py-10 text-center"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {/* Shiny border accent */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl"
                 style={{
                   background:
                     "linear-gradient(120deg, rgba(99,102,241,.5), rgba(34,211,238,.45), rgba(99,102,241,.5))",
                   mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                   WebkitMask:
                     "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                   maskComposite: "exclude",
                   WebkitMaskComposite: "xor",
                   padding: 1,
                 }}/>

            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                Welcome to
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold gradient-title">
                Christlike Ministries, Inc.
              </h1>
              <p className="mt-3 text-white/70">
                We’re glad you’re here.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link href={"/watch" as Route} className="btn-primary" onClick={finish}>
                  Watch Live
                </Link>
                <Link href={"/sermons" as Route} className="btn-ghost" onClick={finish}>
                  Sermon Library
                </Link>
              </div>

              <button
                onClick={finish}
                className="mt-6 text-xs text-white/60 hover:text-white/90"
                aria-label="Skip intro"
              >
                Skip
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

