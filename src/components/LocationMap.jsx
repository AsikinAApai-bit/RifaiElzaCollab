import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: LOCATION MAP
   ══════════════════════════════════════════════════ */
function LocationMap() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate grid lines
      gsap.fromTo(".dossier-line-h", 
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.5, 
          ease: "power4.out", 
          transformOrigin: "center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
      gsap.fromTo(".dossier-line-v", 
        { scaleY: 0 },
        { 
          scaleY: 1, 
          duration: 1.5, 
          ease: "power4.out", 
          transformOrigin: "center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // Animate coordinates and content
      gsap.from(".dossier-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 bg-[#020807] overflow-hidden min-h-[80vh] flex items-center">
      
      {/* Background decoration: Grid lines */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[rgba(74,222,128,0.1)] dossier-line-h"></div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[rgba(74,222,128,0.1)] dossier-line-h"></div>
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[rgba(74,222,128,0.1)] dossier-line-v"></div>
      <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[rgba(74,222,128,0.1)] dossier-line-v"></div>
      
      {/* Background decoration: Crosshairs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.3)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.3)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.3)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-3/4 left-3/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.3)] font-mono text-sm pointer-events-none">+</div>

      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* Massive Coordinate Typography */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="dossier-reveal flex items-center gap-3 mb-6">
            <span className="block w-10 h-0.5 bg-[#4ade80]"></span>
            <span className="font-mono text-sm uppercase tracking-widest text-[#4ade80]">Expedition Dossier</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="dossier-reveal font-display italic text-[clamp(3.5rem,8vw,8rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(74,222,128,0.4)] hover:[-webkit-text-stroke:2px_#4ade80] transition-all duration-500">
              03°41'02.9"N
            </span>
            <span className="dossier-reveal font-display italic text-[clamp(3.5rem,8vw,8rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(74,222,128,0.4)] hover:[-webkit-text-stroke:2px_#4ade80] transition-all duration-500">
              98°03'20.2"E
            </span>
          </div>
        </div>

        {/* Content & The Action Button */}
        <div className="w-full lg:w-5/12 flex flex-col items-start">
          <p className="dossier-reveal font-body text-lg text-[#9ca3af] leading-relaxed mb-6">
            Tangkahan adalah kawasan ekowisata yang terletak di Desa Namo Sialang dan Sei Serdang, Kecamatan Batang Serangan, Kabupaten Langkat, Sumatera Utara. 
          </p>
          <p className="dossier-reveal font-body text-lg text-[#9ca3af] leading-relaxed">
            Berbatasan langsung dengan Taman Nasional Gunung Leuser, tempat ini terkenal sebagai "Surga Tersembunyi" untuk wisata alam dan konservasi Gajah Sumatera.
          </p>
          
          <a 
            href="https://maps.app.goo.gl/cQeZcZ6yYqGqXQhH6" 
            target="_blank"
            rel="noreferrer"
            className="dossier-reveal inline-flex items-center gap-3 px-8 py-4 mt-8 rounded-full border border-[rgba(74,222,128,0.3)] bg-[rgba(10,31,18,0.4)] backdrop-blur-md text-[#4ade80] font-mono text-xs tracking-widest uppercase hover:bg-[#4ade80] hover:text-[#020807] transition-all duration-500 group"
          >
            Buka Peta Satelit
            <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}




export default LocationMap;
