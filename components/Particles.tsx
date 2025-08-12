// components/Particles.tsx
"use client";
import { useEffect, useRef } from "react";

export default function Particles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let width = 0, height = 0;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReduced) return; // disable entirely

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    function resize(){
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const isSmall = width < 768;          // phones/tablets
    const N = isSmall ? 6 : 12;           // fewer orbs on small screens
    const baseAlpha = isSmall ? 0.05 : 0.08;

    const orbs = Array.from({ length: N }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (isSmall ? 24 : 40) + Math.random() * (isSmall ? 80 : 120),
      dx: (Math.random() - 0.5) * (isSmall ? 0.09 : 0.15),
      dy: (Math.random() - 0.5) * (isSmall ? 0.09 : 0.15),
      hue: 220 + Math.random() * 80,
      alpha: baseAlpha + Math.random() * (isSmall ? 0.04 : 0.06),
    }));

    function tick(){
      ctx.clearRect(0,0,width,height);
      for(const o of orbs){
        o.x += o.dx; o.y += o.dy;
        if(o.x < -o.r) o.x = width + o.r;
        if(o.x > width + o.r) o.x = -o.r;
        if(o.y < -o.r) o.y = height + o.r;
        if(o.y > height + o.r) o.y = -o.r;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue}, 80%, 60%, ${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas className={className} ref={ref} />;
}

