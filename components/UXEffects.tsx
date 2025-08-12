"use client";
import { useEffect } from "react";

/** Global click ripple for .btn-primary and .btn-ghost */
export default function UXEffects(){
  useEffect(() => {
    function handler(e: MouseEvent){
      const target = (e.target as HTMLElement)?.closest(".btn-primary, .btn-ghost") as HTMLElement | null;
      if(!target) return;
      const rect = target.getBoundingClientRect();
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.left = `${e.clientX - rect.left}px`;
      span.style.top  = `${e.clientY - rect.top}px`;
      target.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
}

