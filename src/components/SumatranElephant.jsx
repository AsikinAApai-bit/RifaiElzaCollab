import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: ELEPHANT GALLERY — Hover Distortion
   ══════════════════════════════════════════════════ */
function SumatranElephant() {
  var imgRef = React.useRef(null);
  var filterRef = React.useRef(null);

  React.useEffect(function() {
    var img = imgRef.current;
    var filter = filterRef.current;
    if (!img || !filter || window.matchMedia('(hover: none)').matches) return;

    var hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(filter, { attr: { scale: 30 }, duration: 0.8, ease: "power2.out" })
           .to(img, { scale: 1.05, duration: 1.5, ease: "power2.out" }, 0);

    function onEnter() { hoverTl.play(); }
    function onLeave() { hoverTl.reverse(); }

    img.addEventListener('mouseenter', onEnter);
    img.addEventListener('mouseleave', onLeave);

    return function() {
      img.removeEventListener('mouseenter', onEnter);
      img.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="relative px-6 sm:px-10 lg:px-16 border-t border-[rgba(74,222,128,0.05)] pt-16 md:pt-32 pb-24 md:pb-48" style={{ background: '#020807' }}>
      
      {/* SVG Filter for Liquid Distortion */}
      <svg className="hidden">
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap ref={filterRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24" style={{ maxWidth: '1200px' }}>
        <div className="lg:w-1/2 relative">
          <div className="eyebrow mb-6">
            <span className="eyebrow__line" />
            <span className="eyebrow__text">Sumatran Elephant</span>
          </div>
          <h2 className="font-display italic text-[#e2f0e6] leading-[1.05] mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}>
            The Gentle
            <br />
            <span className="text-[#4ade80]">Guardians</span>
          </h2>
          <p className="text-[#6b9f7a] leading-relaxed mb-8">
            To safeguard the area, the community welcomed a team of trained captive elephants and their mahouts. Together, they established the legendary Tangkahan Elephant Patrol, actively scouting the jungle to deter illegal loggers, protect the wildlife.
          </p>
          <div className="p-6 border border-[rgba(74,222,128,0.15)] rounded-2xl bg-[rgba(10,31,18,0.5)] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#4ade80] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#4ade80] mb-3">Fun Fact</p>
            <p className="text-[0.85rem] text-[#e2f0e6] leading-relaxed">
              There are 9 Sumatran Elephants in Tangkahan, rescued from conflict in Banda Aceh. They are specially trained to help rangers patrol the forest and protect it from ilegal logging. 
              <br/><br/>The coolest part is that you can see the harmonious interaction between the local community and the elephants. The community helps to care for them and save their herds from extinction.
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/2 w-full">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <img 
              ref={imgRef}
              src="/asset/elephant_hero.png" 
              alt="Sumatran Elephant in Tangkahan" 
              className="w-full h-full object-cover transition-all duration-700 grayscale hover:grayscale-0"
              style={{ filter: 'url(#liquid)', cursor: 'crosshair' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-6 left-6 pointer-events-none">
              <span className="badge backdrop-blur-md border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.4)] text-white">
                Hover for Distortion
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default SumatranElephant;
