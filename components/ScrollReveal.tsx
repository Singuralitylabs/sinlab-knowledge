"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal. Observes every `.reveal` element and
 * adds `.in` as it enters the viewport. A failsafe unhides anything still
 * hidden shortly after mount so content is never stuck (reduced-motion,
 * offscreen, odd browsers). Ported from the design handoff's useReveal hook.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of els) io.observe(el);

    const fail = setTimeout(() => {
      for (const el of document.querySelectorAll(".reveal:not(.in)")) el.classList.add("in");
    }, 700);

    return () => {
      io.disconnect();
      clearTimeout(fail);
    };
  }, []);

  return null;
}
