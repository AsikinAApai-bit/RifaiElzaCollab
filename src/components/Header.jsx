import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   HEADER — glassmorphism + progress bar
   ══════════════════════════════════════════════════ */

function Header() {
  var headerRef = React.useRef(null);
  var progressRef = React.useRef(null);

  React.useEffect(function () {
    function onScroll() {
      var scrolled = window.scrollY > 60;
      if (headerRef.current) headerRef.current.classList.toggle('is-scrolled', scrolled);
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return function () { window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <header ref={headerRef} className="header">
      <div className="flex items-center justify-between h-full px-6 sm:px-10 lg:px-16 mx-auto" style={{ maxWidth: '1400px' }}>
        <a href="#" className="group relative inline-flex items-baseline gap-1.5">
          <span className="font-body text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-[#6b9f7a] transition-colors duration-300 group-hover:text-[#e2f0e6]">Regnum</span>
          <span className="font-display text-xl font-black text-[#4ade80] leading-none italic">Naturae</span>
          <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#4ade80] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {['Portal', 'Sungai', 'Rimba'].map(function (item) {
            return (
              <a key={item} href={'#' + item.toLowerCase()} className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#6b9f7a] relative pb-0.5 transition-colors duration-300 hover:text-[#e2f0e6] group">
                {item}
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#4ade80] scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
              </a>
            );
          })}
        </nav>
      </div>
      <div ref={progressRef} className="header__progress" />
    </header>
  );
}


export default Header;
