import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: HISTORY — Scrub Text Reveal
   ══════════════════════════════════════════════════ */
function HistorySlider() {
  var containerRef = React.useRef(null);
  var topImageWrapperRef = React.useRef(null);
  var topImageRef = React.useRef(null);
  var bottomImageRef = React.useRef(null);
  var handleRef = React.useRef(null);
  var label1Ref = React.useRef(null);
  var label2Ref = React.useRef(null);
  var isDragging = React.useRef(false);

  React.useEffect(function() {
    var container = containerRef.current;
    var topImgWrap = topImageWrapperRef.current;
    var topImg = topImageRef.current;
    var bottomImg = bottomImageRef.current;
    var handle = handleRef.current;

    if (!container || !topImgWrap || !topImg || !handle) return;

    // Ambient animations
    const bgTween1 = gsap.to(topImg, { scale: 1.05, duration: 15, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    const bgTween2 = gsap.to(bottomImg, { scale: 1.05, duration: 15, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    function updateSlider(clientX) {
      var rect = container.getBoundingClientRect();
      var x = clientX - rect.left;
      var xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      gsap.set(topImgWrap, { clipPath: 'polygon(0 0, ' + xPct + '% 0, ' + xPct + '% 100%, 0 100%)' });
      gsap.set(handle, { left: xPct + '%' });
    }

    function onPointerMove(e) {
      if (!isDragging.current) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    }

    function onPointerDown(e) {
      isDragging.current = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    }

    function onPointerUp() {
      isDragging.current = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    return function() {
      bgTween1.kill();
      bgTween2.kill();
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, []);

  return (
    <section className="relative px-6 sm:px-10 lg:px-16 overflow-hidden" style={{ paddingTop: '10rem', paddingBottom: '10rem', background: '#0a1f12' }}>
      
      <div className="relative z-10 mx-auto max-w-6xl mb-12 flex flex-col items-center">
        <div className="eyebrow mb-6">
          <span className="eyebrow__line" />
          <span className="eyebrow__text">The Turning Point</span>
          <span className="eyebrow__line" />
        </div>
        <h2 className="font-display italic text-[#e2f0e6] leading-[0.9] text-center" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}>
          <span className="inline-block -translate-x-12 sm:-translate-x-24">From Them to Us:</span>
          <br />
          <span className="inline-block translate-x-12 sm:translate-x-24" style={{ color: '#c8b07a' }}>A Responsibility</span>
        </h2>
      </div>

      <div 
        ref={containerRef}
        className="w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] mx-auto rounded-3xl overflow-hidden relative cursor-ew-resize select-none shadow-2xl"
        style={{ touchAction: 'none', border: '1px solid rgba(74,222,128,0.15)' }}
      >
        {/* Bottom Image (After - Present Day) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a1f12]">
          <img ref={bottomImageRef} src="/asset/asset7-after.jpeg" alt="Present Eco Tourism" className="absolute inset-0 w-full h-full object-cover origin-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,18,0.6)] to-transparent pointer-events-none" />

        </div>

        {/* Top Image (Before - 1990s) */}
        <div ref={topImageWrapperRef} className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 95% 100%, 0 100%)' }}>
          <img ref={topImageRef} src="/asset/asset7-before.jpeg" alt="1990s Deforestation" className="absolute inset-0 w-full h-full object-cover origin-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,18,0.8)] to-transparent pointer-events-none" />

        </div>

        {/* The Drag Handle (Sleek Glassmorphic Pill) */}
        <div 
          ref={handleRef}
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: '95%', transform: 'translateX(-50%)' }}
        >
          {/* Vertical 1px Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2" />
          
          {/* Pill Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 rounded-full backdrop-blur-xl bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.4)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between px-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

      </div>
    </section>
  );
}


export default HistorySlider;
