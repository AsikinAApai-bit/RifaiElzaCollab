import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════ */

function CustomCursor() {
  var dotRef = React.useRef(null);
  var ringRef = React.useRef(null);

  React.useEffect(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    var mx = 0, my = 0, rx = 0, ry = 0;
    function onMove(e) { mx = e.clientX; my = e.clientY; }
    function onDown() { ringRef.current && ringRef.current.classList.add('is-clicking'); }
    function onUp() { ringRef.current && ringRef.current.classList.remove('is-clicking'); }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    function loop() {
      if (dotRef.current) { dotRef.current.style.left = mx + 'px'; dotRef.current.style.top = my + 'px'; }
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx + 'px'; ringRef.current.style.top = ry + 'px'; }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    var interactives = 'a, button, [role="button"], input, .card-glass';
    function addHover(e) { if (e.target.closest(interactives)) ringRef.current && ringRef.current.classList.add('is-hovering'); }
    function removeHover(e) { if (e.target.closest(interactives)) ringRef.current && ringRef.current.classList.remove('is-hovering'); }
    document.addEventListener('mouseover', addHover);
    document.addEventListener('mouseout', removeHover);
    return function () {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', addHover);
      document.removeEventListener('mouseout', removeHover);
    };
  }, []);

  return (
    <React.Fragment>
      <div ref={dotRef} className="cursor cursor--dot" />
      <div ref={ringRef} className="cursor cursor--ring" />
    </React.Fragment>
  );
}


export default CustomCursor;
