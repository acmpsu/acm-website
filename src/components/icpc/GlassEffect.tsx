"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Dynamic liquid glass effects:
 * - Mouse-tracking specular highlights on glass cards
 * - Parallax orb movement on mouse move
 * - Scroll-based orb drift
 * - Magnifying lens that follows cursor on hero
 */
export function GlassEffect() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    function tick() {
      const { x, y } = mouseRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nx = x / vw; // 0–1 normalized
      const ny = y / vh;

      // ── Move orbs based on cursor (parallax) ──
      const orbs = document.querySelectorAll<HTMLElement>(".orb");
      orbs.forEach((orb, i) => {
        const speed = 30 + i * 15;
        const ox = (nx - 0.5) * speed;
        const oy = (ny - 0.5) * speed;
        orb.style.transform = `translate(${ox}px, ${oy}px)`;
      });

      // ── Specular highlight on glass cards ──
      const cards = document.querySelectorAll<HTMLElement>(".glass-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cx = x - rect.left;
        const cy = y - rect.top;
        const inside =
          cx >= -60 && cy >= -60 && cx <= rect.width + 60 && cy <= rect.height + 60;

        if (inside) {
          // radial highlight follows cursor
          card.style.setProperty("--gx", `${cx}px`);
          card.style.setProperty("--gy", `${cy}px`);
          card.style.setProperty("--glow-opacity", "1");

          // subtle 3D tilt
          const rx = ((cy / rect.height) - 0.5) * -6; // tilt X
          const ry = ((cx / rect.width) - 0.5) * 6;   // tilt Y
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
        } else {
          card.style.setProperty("--glow-opacity", "0");
          card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
        }
      });

      // ── Magnify lens on hero ──
      const lens = document.getElementById("glass-lens");
      if (lens) {
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    // ── Scroll-based orb shift ──
    function handleScroll() {
      const sy = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `${sy}`);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Global magnifying lens — purely decorative */}
      <div
        id="glass-lens"
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-50 w-44 h-44 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          boxShadow: "0 0 60px 20px rgba(59,130,246,0.04)",
        }}
        aria-hidden="true"
      />
      {/* Show lens only when inside icpc-page */}
      <style>{`
        .icpc-page:hover #glass-lens { opacity: 1; }
      `}</style>
    </>
  );
}
