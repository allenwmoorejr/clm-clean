"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Clamp the scroll progress to prevent overshoot past the page bounds.
  const clampedProgress = useTransform(scrollYProgress, (p) => Math.min(Math.max(p, 0), 1));
  const scaleX = useSpring(clampedProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand-600 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
