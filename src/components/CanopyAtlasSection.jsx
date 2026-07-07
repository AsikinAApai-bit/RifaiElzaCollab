import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DomeGallery from './DomeGallery';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: CANOPY ATLAS (Dome Gallery)
   ══════════════════════════════════════════════════ */
function CanopyAtlasSection() {
  return (
    <section className="relative w-full h-screen bg-[#020807] overflow-hidden">
      <div className="absolute top-10 md:top-20 left-0 w-full z-20 px-4 sm:px-8 text-center pointer-events-none">
        <h2 className="font-display italic text-[#e2f0e6] leading-[0.9]" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.02em' }}>
          The Canopy Atlas
        </h2>
        <p className="font-mono text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.3em] text-[#4ade80] mt-4">
          DRAG TO EXPLORE &middot; CLICK TO ENLARGE
        </p>
      </div>
      <DomeGallery overlayBlurColor="#020807" grayscale={true} />
    </section>
  );
}



export default CanopyAtlasSection;
