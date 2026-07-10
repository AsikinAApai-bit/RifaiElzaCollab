import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: HEARTBEAT COUNTER (STATS)
   ══════════════════════════════════════════════════ */
function SedikitIlmu() {
  const sectionRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);
  const num3Ref = useRef(null);
  const num4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation logic
      const animateCounter = (ref, targetValue, duration) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.innerText = Math.floor(obj.val).toLocaleString();
            }
          }
        });
      };

      animateCounter(num1Ref, 17000, 2.5);
      animateCounter(num2Ref, 1000, 2.5);
      animateCounter(num3Ref, 10, 2);
      animateCounter(num4Ref, 1, 1.5);
      
      // Text reveal
      gsap.from(".stat-label", {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="relative px-6 sm:px-10 lg:px-16 py-32 bg-[#020807] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-center md:items-start text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#4ade80] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num1Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Hectares of rainforests
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#4ade80] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num2Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Residents
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#4ade80] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num3Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Elephants
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#4ade80] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num4Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Heart
          </div>
        </div>

      </div>
    </section>
  );
}


export default SedikitIlmu;
