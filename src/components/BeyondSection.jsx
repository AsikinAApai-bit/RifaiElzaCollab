import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useReveal from '../hooks/useReveal';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: BEYOND THE PORTAL — editorial content
   ══════════════════════════════════════════════════ */

function BeyondSection() {
  var ref = useReveal('.rv');
  return (
    <section id="sungai" className="relative px-6 sm:px-10 lg:px-16" style={{ paddingTop: 'clamp(6rem,12vw,10rem)', paddingBottom: 'clamp(6rem,12vw,10rem)', background: 'linear-gradient(180deg, #020807 0%, #0a1f12 100%)' }}>
      <div ref={ref} className="mx-auto" style={{ maxWidth: '1300px' }}>
        {/* Offset text block — NOT centered, NOT grid */}
        <div className="rv sm:ml-[15%] lg:ml-[20%] max-w-xl">
          <div className="eyebrow mb-5">
            <span className="eyebrow__line" />
            <span className="eyebrow__text">Di Balik Portal</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] italic leading-relaxed text-[#e2f0e6]" style={{ letterSpacing: '-0.01em' }}>
            Sungai ini tidak mengalir ke laut—ia mengalir ke dalam waktu. Parallax effect yang membawamu 
            <span className="text-[#4ade80]"> menembus kabut,</span> menuju jembatan tersembunyi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="badge">Parallax Depth</span>
            <span className="badge" style={{ borderColor: 'rgba(245,158,11,0.2)', color: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>Layered Imagery</span>
            <span className="badge" style={{ borderColor: 'rgba(251,113,133,0.2)', color: '#fb7185', background: 'rgba(251,113,133,0.06)' }}>GSAP ScrollTrigger</span>
          </div>
        </div>
      </div>
    </section>
  );
}


export default BeyondSection;
