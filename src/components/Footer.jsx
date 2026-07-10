import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useReveal from '../hooks/useReveal';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   CTA FOOTER
   ══════════════════════════════════════════════════ */

function Footer() {
  var ref = useReveal('.rv');
  return (
    <footer className="relative bg-void px-6 sm:px-10 lg:px-16 overflow-hidden" style={{ paddingTop: 'clamp(5rem,10vw,8rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />

      <div ref={ref} className="rv mx-auto text-center relative z-10" style={{ maxWidth: '800px' }}>
        <h2 className="font-display italic text-[#e2f0e6] leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
          Portal ini
          <br />
          <span className="text-[#4ade80]">tidak menunggu.</span>
        </h2>
        <p className="mt-5 text-[0.85rem] text-[#3d6b4a] max-w-md mx-auto leading-relaxed">
          Gulir kembali ke atas dan rasakan lagi. Atau bawa pengalaman ini ke proyekmu sendiri.
        </p>
        <button type="button" className="btn btn--primary mt-9" onClick={function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span>Kembali ke Portal</span>
          <span className="btn__icon" aria-hidden="true">↑</span>
        </button>
      </div>

      <div className="mt-20 pt-8 border-t border-[rgba(74,222,128,0.06)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ maxWidth: '1300px' }}>
        <div className="flex items-baseline gap-1.5">
          <span className="font-body text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-[#2e5c3d]">Regnum</span>
          <span className="font-display text-sm font-black text-[#4ade80] italic">Naturae</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[0.6rem] text-[#2e5c3d] font-mono tracking-wider">
          <span>React + Tailwind + GSAP + Canvas API</span>
          <span className="hidden sm:inline">·</span>
          <span>Antigravity Motion · Flashbang Scrub · MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
