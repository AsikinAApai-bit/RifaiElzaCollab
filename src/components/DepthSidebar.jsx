import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   DEPTH SIDEBAR
   ══════════════════════════════════════════════════ */

function DepthSidebar() {
  var labelRef = React.useRef(null);
  React.useEffect(function () {
    function onScroll() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? window.scrollY / docH : 0;
      var depth = Math.floor(pct * 100);
      if (labelRef.current) labelRef.current.textContent = depth + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return function () { window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <div className="depth-sidebar hidden sm:flex">
      <span className="depth-sidebar__label" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
      <span className="depth-sidebar__line" />
      <span className="depth-sidebar__dot" />
      <span ref={labelRef} className="font-mono text-[0.55rem] text-[#4ade80] tracking-wider">0%</span>
    </div>
  );
}


export default DepthSidebar;
