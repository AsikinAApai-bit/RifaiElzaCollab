import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   FLOATING ORBS — antigravity decoration (GSAP yoyo)
   ══════════════════════════════════════════════════ */

function FloatingOrbs() {
  var ref = React.useRef(null);
  React.useEffect(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var orbs = ref.current.querySelectorAll('.float-orb');
    var tweens = [];
    orbs.forEach(function (orb, i) {
      var tw = gsap.to(orb, {
        y: -20 - i * 8,
        x: (i % 2 === 0 ? 1 : -1) * (5 + i * 3),
        duration: 3 + i * 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      tweens.push(tw);
    });
    return function () { tweens.forEach(function (t) { t.kill(); }); };
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="float-orb absolute w-48 h-48 rounded-full opacity-[0.015]" style={{ background: 'radial-gradient(circle, #4ade80, transparent)', top: '15%', left: '8%' }} />
      <div className="float-orb absolute w-64 h-64 rounded-full opacity-[0.01]" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', top: '60%', right: '5%' }} />
      <div className="float-orb absolute w-36 h-36 rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #4ade80, transparent)', bottom: '20%', left: '30%' }} />
    </div>
  );
}

export default FloatingOrbs;
