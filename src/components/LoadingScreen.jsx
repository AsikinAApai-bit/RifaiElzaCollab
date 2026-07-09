import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   LOADING SCREEN — preload frames + show %
   ══════════════════════════════════════════════════ */

function LoadingScreen(props) {
  var pctRef = React.useRef(null);
  var fillRef = React.useRef(null);
  var depthRef = React.useRef(null);
  var screenRef = React.useRef(null);

  React.useEffect(function () {
    /* Loading is driven by preload progress from parent via props.progress */
    var checkIv = setInterval(function () {
      var p = props.progressRef.current;
      if (pctRef.current) pctRef.current.textContent = Math.floor(p) + '%';
      var circumference = 251.33;
      if (fillRef.current) fillRef.current.style.strokeDashoffset = circumference - (circumference * p / 100);
      if (depthRef.current) depthRef.current.textContent = 'Memuat ' + Math.floor(p * 2.4) + ' frame';
      if (p >= 100) {
        clearInterval(checkIv);
        setTimeout(function () {
          if (screenRef.current) screenRef.current.classList.add('is-hidden');
          if (props.onDone) props.onDone();
        }, 600);
      }
    }, 50);
    return function () { clearInterval(checkIv); };
  }, []);

  return (
    <div ref={screenRef} className="loading-screen">
      <div className="loading-ring">
        <svg viewBox="0 0 88 88">
          <circle className="loading-ring__track" cx="44" cy="44" r="40" />
          <circle ref={fillRef} className="loading-ring__fill" cx="44" cy="44" r="40" />
        </svg>
        <span ref={pctRef} className="loading-ring__pct">0%</span>
      </div>
      <div className="loading-brand">
        <span className="loading-brand__pre">Regnum</span>
        <span className="loading-brand__name"></span>
      </div>
      <span ref={depthRef} className="loading-depth">Memuat 0 frame</span>
    </div>
  );
}


export default LoadingScreen;
