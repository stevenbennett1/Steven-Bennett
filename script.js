(function(){
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var STORAGE_KEY = "sb-theme";

  function applyTheme(theme){
    if(theme === "light" || theme === "dark"){
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  var stored = null;
  try{ stored = localStorage.getItem(STORAGE_KEY); }catch(e){}
  applyTheme(stored);

  if(themeToggle){
    themeToggle.addEventListener("click", function(){
      var current = root.getAttribute("data-theme") || "light";
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try{ localStorage.setItem(STORAGE_KEY, next); }catch(e){}
    });
  }

  var header = document.getElementById("site-header");
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 8){ header.classList.add("scrolled"); }
    else{ header.classList.remove("scrolled"); }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  function closeNav(){
    if(!mainNav || !navToggle) return;
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  if(navToggle && mainNav){
    navToggle.addEventListener("click", function(){
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    mainNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeNav();
    });
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if(prefersReducedMotion || !("IntersectionObserver" in window)){
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });

    revealEls.forEach(function(el){ observer.observe(el); });

    // Safety net: a very fast/instant scroll (flick, anchor jump, End key)
    // can move past an element between the browser's intersection checks,
    // leaving it stuck at opacity:0 forever. Catch anything IntersectionObserver
    // missed by directly checking element positions after scrolling settles.
    var pendingCheck = null;
    function sweepMissed(){
      pendingCheck = null;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach(function(el){
        if(el.classList.contains("is-visible")) return;
        var rect = el.getBoundingClientRect();
        if(rect.top < vh && rect.bottom > 0){
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      });
    }
    function scheduleSweep(){
      if(pendingCheck) return;
      pendingCheck = requestAnimationFrame(sweepMissed);
    }
    window.addEventListener("scroll", scheduleSweep, { passive: true });
    window.addEventListener("resize", scheduleSweep);
    scheduleSweep();
  }

  var yearEl = document.getElementById("year");
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

})();
