"use client";

import { useEffect } from "react";

/**
 * Handles all interactivity for the portfolio page: theme toggle, sticky
 * header scroll state, mobile nav, and scroll-reveal animations. Mirrors the
 * original static-site script.js logic 1:1, just scoped to the #portfolio-root
 * element instead of document.documentElement (since the portfolio's CSS
 * variables live on that wrapper now, not :root — see app/portfolio.css).
 */
export default function PortfolioChrome() {
  useEffect(() => {
    const root = document.getElementById("portfolio-root");
    if (!root) return;

    const STORAGE_KEY = "sb-theme";
    function applyTheme(theme: string | null) {
      if (theme === "light" || theme === "dark") {
        root!.setAttribute("data-theme", theme);
      } else {
        root!.removeAttribute("data-theme");
      }
    }

    const themeToggle = document.getElementById("theme-toggle");
    function onThemeToggle() {
      const current = root!.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
    }
    themeToggle?.addEventListener("click", onThemeToggle);

    const header = document.getElementById("site-header");
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 8) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");
    function closeNav() {
      if (!mainNav || !navToggle) return;
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
    function onNavToggle() {
      if (!mainNav || !navToggle) return;
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closeNav();
    }
    navToggle?.addEventListener("click", onNavToggle);
    const navLinks = mainNav ? Array.from(mainNav.querySelectorAll("a")) : [];
    navLinks.forEach((link) => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", onKeydown);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls = Array.from(root.querySelectorAll(".reveal"));
    let observer: IntersectionObserver | undefined;
    let pendingCheck: number | null = null;

    function sweepMissed() {
      pendingCheck = null;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add("is-visible");
          observer?.unobserve(el);
        }
      });
    }
    function scheduleSweep() {
      if (pendingCheck) return;
      pendingCheck = requestAnimationFrame(sweepMissed);
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      revealEls.forEach((el) => observer!.observe(el));

      window.addEventListener("scroll", scheduleSweep, { passive: true });
      window.addEventListener("resize", scheduleSweep);
      scheduleSweep();
    }

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    return () => {
      themeToggle?.removeEventListener("click", onThemeToggle);
      window.removeEventListener("scroll", onScroll);
      navToggle?.removeEventListener("click", onNavToggle);
      navLinks.forEach((link) => link.removeEventListener("click", closeNav));
      document.removeEventListener("keydown", onKeydown);
      window.removeEventListener("scroll", scheduleSweep);
      window.removeEventListener("resize", scheduleSweep);
      observer?.disconnect();
    };
  }, []);

  return null;
}
