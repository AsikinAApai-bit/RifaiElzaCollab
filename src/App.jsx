import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import * as ogl from 'ogl';
import StaggeredMenu from './components/StaggeredMenu';

gsap.registerPlugin(ScrollTrigger);







gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════ */

var TOTAL_FRAMES = 240;
var FRAME_PATH = '/asset/frames/frame-';
var FLASHBANG_IMG = '/asset/Gemini_Generated_Image_5t5ekt5t5ekt5t5e.png';

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
        <span className="loading-brand__pre">8LEPHANT</span>
        <span className="loading-brand__name"></span>
      </div>
      <span ref={depthRef} className="loading-depth">Memuat 0 frame</span>
    </div>
  );
}

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

/* ══════════════════════════════════════════════════
   HEADER — glassmorphism + progress bar
   ══════════════════════════════════════════════════ */

function Header() {
  var headerRef = React.useRef(null);
  var progressRef = React.useRef(null);

  React.useEffect(function () {
    function onScroll() {
      var scrolled = window.scrollY > 60;
      if (headerRef.current) headerRef.current.classList.toggle('is-scrolled', scrolled);
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return function () { window.removeEventListener('scroll', onScroll); };
  }, []);

  const menuItems = [
    { label: 'Portal', ariaLabel: 'Go to Portal section', link: '#portal' },
    { label: 'The River', ariaLabel: 'Go to Behind the Portal section', link: '#sungai' },
    { label: 'Elephants', ariaLabel: 'Go to Elephant Gallery', link: '#elephants' },
    { label: 'Rimba', ariaLabel: 'Go to Technique section', link: '#rimba' },
    { label: 'History', ariaLabel: 'Go to History section', link: '#history' },
    { label: 'Spots', ariaLabel: 'Go to Spots section', link: '#spots' },
    { label: 'Secrets', ariaLabel: 'Go to Jungle Secrets section', link: '#jungle-secrets' },
    { label: 'Location', ariaLabel: 'Go to Location Map', link: '#location' },
    { label: 'Information', ariaLabel: 'Go to Information section', link: '#information' },
  ];

  const socialItems = [
    { label: 'Instagram', link: '#' },
    { label: 'WhatsApp', link: '#' },
  ];

  return (
    <>
      <header ref={headerRef} className="header">
        <div className="flex items-center justify-between h-full px-6 sm:px-10 lg:px-16 mx-auto" style={{ maxWidth: '1400px' }}>
          <a href="#" className="group relative inline-flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-black text-[#678A44] leading-none italic transition-colors duration-300 group-hover:text-[#e2f0e6]">8</span>
            <span className="font-body text-[0.8rem] font-semibold tracking-[0.22em] uppercase text-[#94B474]">Lephant</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#4ade80] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </div>
        <div ref={progressRef} className="header__progress" />
      </header>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#EADCB9"
        openMenuButtonColor="#C4B088"
        changeMenuColorOnOpen={true}
        colors={['#0d2916', '#132e1a']}
        accentColor="#4ade80"
      />
    </>
  );
}

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

/* ══════════════════════════════════════════════════
        maxDevicePixelRatio
      );
      const need = cssW * cssH * currentDPR * currentDPR;
      const scale = need <= pixelBudget ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(pixelBudget / Math.max(1, need))));
      const pixelRatio = currentDPR * scale;

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(cssW, cssH, false);

      if (composer.setPixelRatio) {
        composer.setPixelRatio(pixelRatio);
      }
      composer.setSize(cssW, cssH);

      const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
      const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
      material.uniforms.iResolution.value.set(wpx, hpx, 1);
      material.uniforms.iScale.value = calculateScale(host);
      bloomPass.setSize(wpx, hpx);

      hasValidSizeRef.current = true;
    };

    resize();
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      resizeObsRef.current = ro;
      ro.observe(parent);
      ro.observe(host);
    }

    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const animate = () => {
      if (!active) return;

      if (!hasValidSizeRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = performance.now();
      const t = (now - start) / 1000;

      const mat = materialRef.current;
      const comp = composerRef.current;

      if (pointerActiveRef.current) {
        velocityRef.current.set(
          currentMouseRef.current.x - mat.uniforms.iMouse.value.x,
          currentMouseRef.current.y - mat.uniforms.iMouse.value.y
        );
        mat.uniforms.iMouse.value.copy(currentMouseRef.current);
        fadeOpacityRef.current = 1.0;
      } else {
        velocityRef.current.multiplyScalar(inertia);
        if (velocityRef.current.lengthSq() > 1e-6) {
          mat.uniforms.iMouse.value.add(velocityRef.current);
        }
        const dt = now - lastMoveTimeRef.current;
        if (dt > fadeDelay) {
          const k = Math.min(1, (dt - fadeDelay) / fadeDuration);
          fadeOpacityRef.current = Math.max(0, 1 - k);
        }
      }

      const N = trailBufRef.current.length;
      headRef.current = (headRef.current + 1) % N;
      trailBufRef.current[headRef.current].copy(mat.uniforms.iMouse.value);
      const arr = mat.uniforms.iPrevMouse.value;
      for (let i = 0; i < N; i++) {
        const srcIdx = (headRef.current - i + N) % N;
        arr[i].copy(trailBufRef.current[srcIdx]);
      }

      mat.uniforms.iOpacity.value = fadeOpacityRef.current;
      mat.uniforms.iTime.value = t;

      if (filmPassRef.current && filmPassRef.current.uniforms && filmPassRef.current.uniforms.iTime) {
        filmPassRef.current.uniforms.iTime.value = t;
      }

      comp.render();

      if (!pointerActiveRef.current && fadeOpacityRef.current <= 0.001) {
        runningRef.current = false;
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const ensureLoop = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = e => {
      const rect = parent.getBoundingClientRect();
      const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
      const x = clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      const y = clamp(1 - (e.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
      currentMouseRef.current.set(x, y);
      pointerActiveRef.current = true;
      lastMoveTimeRef.current = performance.now();
      ensureLoop();
    };
    const onPointerEnter = () => {
      pointerActiveRef.current = true;
      ensureLoop();
    };
    const onPointerLeave = () => {
      pointerActiveRef.current = false;
      lastMoveTimeRef.current = performance.now();
      ensureLoop();
    };

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerenter', onPointerEnter, { passive: true });
    parent.addEventListener('pointerleave', onPointerLeave, { passive: true });

    ensureLoop();

    return () => {
      active = false;
      hasValidSizeRef.current = false;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      rafRef.current = null;

      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerenter', onPointerEnter);
      parent.removeEventListener('pointerleave', onPointerLeave);
      if (resizeObsRef.current) {
        resizeObsRef.current.disconnect();
      }

      scene.clear();
      geom.dispose();
      material.dispose();
      materialRef.current = null;
      composer.dispose();
      composerRef.current = null;
      renderer.dispose();
      renderer.forceContextLoss();
      rendererRef.current = null;

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      if (!prevParentPos || prevParentPos === 'static') {
        parent.style.position = prevParentPos;
      }
    };
  }, [
    trailLength,
    inertia,
    grainIntensity,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    pixelBudget,
    fadeDelay,
   ★ HERO — CANVAS SCRUBBING + END PARALLAX ★
   ══════════════════════════════════════════════════ */
function HeroCanvasScrub(props) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const coverRef = useRef(null);
  const textRef = useRef(null);
  const scrollInstRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showHiddenParadise, setShowHiddenParadise] = useState(false);
  const [paradiseOut, setParadiseOut] = useState(false);
  const [paradiseIn, setParadiseIn] = useState(false);
  const paradiseRef = useRef('before');
  const [showHarmony, setShowHarmony] = useState(false);
  const [harmonyOut, setHarmonyOut] = useState(false);
  const [harmonyIn, setHarmonyIn] = useState(false);
  const harmonyRef = useRef('before');
  const [showTangkahan, setShowTangkahan] = useState(false);
  const [tangkahanOut, setTangkahanOut] = useState(false);
  const [tangkahanIn, setTangkahanIn] = useState(false);
  const tangkahanRef = useRef('before');

  // Preload Logic (WebP frames)
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = 240;
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 3 : 1;
    const totalToLoad = Math.floor(totalFrames / step);

    const tempImages = new Array(totalFrames).fill(null);

    for (let i = 1; i <= totalFrames; i += step) {
      const img = new Image();
      const frameStr = i.toString().padStart(3, '0');
      img.src = `/asset/frames/frame-${frameStr}.webp`;
      img.onload = () => {
        loadedCount++;
        if (props.progressRef) {
          props.progressRef.current = (loadedCount / totalToLoad) * 100;
        }
        
        tempImages[i - 1] = img;

        if (loadedCount >= totalToLoad) {
          setLoaded(true);
        }
        
        if (i === 1) {
          requestAnimationFrame(() => {
            renderFrame(img);
          });
        }
      };
    }
    setImages(tempImages);
  }, [props.progressRef]);

  function renderFrame(img) {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }

  // GSAP ScrollTrigger
  useLayoutEffect(() => {
    if (!loaded) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top top',
        end: '+=1100%', // Diperpanjang agar scroll frame animasi terasa lebih lambat
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    // Phase 1 (The Flashbang)
    tl.to(coverRef.current, { scale: 80, ease: 'power4.in', transformOrigin: 'center center', duration: 1 }, 0);
    tl.to([textRef.current, scrollInstRef.current], { opacity: 0, ease: 'power2.out', duration: 0.5 }, 0);
    
    // Phase 2 (The Reveal)
    tl.set(coverRef.current, { opacity: 0 }, 1);

    // Phase 3 (The Canvas Scrub)
    let frameObj = { frame: 0 };
    tl.to(frameObj, {
      frame: 239,
      ease: 'none',
      duration: 3, // Durasi relatif terhadap ScrollTrigger
      onUpdate: () => {
        const frameIndex = Math.round(frameObj.frame);
        const isMobile = window.innerWidth < 768;
        const step = isMobile ? 3 : 1;
        const closestIndex = Math.floor(frameIndex / step) * step;
        if (images[closestIndex]) {
          renderFrame(images[closestIndex]);
        }
        
        if (frameIndex >= 30 && frameIndex <= 195) {
          if (paradiseRef.current !== 'active') {
             paradiseRef.current = 'active';
             setShowHiddenParadise(true);
             setParadiseOut(false);
             setTimeout(() => setParadiseIn(true), 50);
          }
        } else if (frameIndex > 195) {
          if (paradiseRef.current === 'active') {
             paradiseRef.current = 'after';
             setParadiseOut(true);
          }
        } else if (frameIndex < 30) {
          if (paradiseRef.current !== 'before') {
             paradiseRef.current = 'before';
             setParadiseOut(false);
             setParadiseIn(false);
             setTimeout(() => {
               if (paradiseRef.current === 'before') setShowHiddenParadise(false);
             }, 1000);
          }
        }

        if (frameIndex >= 105 && frameIndex <= 195) {
          if (harmonyRef.current !== 'active') {
            harmonyRef.current = 'active';
            setShowHarmony(true);
            setHarmonyOut(false);
            setTimeout(() => setHarmonyIn(true), 50);
          }
        } else if (frameIndex > 195) {
          if (harmonyRef.current === 'active') {
            harmonyRef.current = 'after';
            setHarmonyOut(true);
          }
        } else if (frameIndex < 105) {
          if (harmonyRef.current !== 'before') {
            harmonyRef.current = 'before';
            setHarmonyOut(false);
            setHarmonyIn(false);
            setTimeout(() => {
              if (harmonyRef.current === 'before') setShowHarmony(false);
            }, 1000);
          }
        }

        if (frameIndex >= 205 && frameIndex <= 240) {
          if (tangkahanRef.current !== 'active') {
            tangkahanRef.current = 'active';
            setShowTangkahan(true);
            setTangkahanOut(false);
            setTimeout(() => setTangkahanIn(true), 150);
          }
        } else if (frameIndex > 240) {
          if (tangkahanRef.current === 'active') {
            tangkahanRef.current = 'after';
            setTangkahanOut(true);
          }
        } else if (frameIndex < 205) {
          if (tangkahanRef.current !== 'before') {
            tangkahanRef.current = 'before';
            setTangkahanOut(false);
            setTangkahanIn(false);
            setTimeout(() => {
              if (tangkahanRef.current === 'before') setShowTangkahan(false);
            }, 1000);
          }
        }
      }
    }, 1);

    // Phase 4 (Parallax Geser ke Atas di Akhir Frame)
    // Canvas akan bergeser naik (yPercent: -20) saat mendekati frame terakhir
    tl.to(canvasRef.current, {
      yPercent: -20,
      ease: 'power2.inOut',
      duration: 1
    }, 3);

    return () => {
      if(tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [loaded, images]);

  useEffect(() => {
    if (!textRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const floatTween = gsap.to(textRef.current, {
      y: -20,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    return () => floatTween.kill();
  }, []);

  return (
    <section ref={wrapRef} id="portal" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Layer 1 (Canvas dengan tinggi ekstra untuk parallax) */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-[120vh] object-cover origin-top"
        style={{ zIndex: 0 }}
      />

      {/* Layer 2 (Flashbang Cover) */}
      <img
        ref={coverRef}
        src="/asset/cover.avif"
        alt="Portal Cover"
        className="absolute inset-0 w-full h-full object-cover origin-center"
        style={{ zIndex: 10 }}
      />
      
      {/* Dark gradient overlay blending into StatsSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020807]" style={{ zIndex: 15 }} />

      {/* Layer 3 (Typography) */}
      <div ref={textRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        <h1 className="font-display font-bold text-[#EADCB9] leading-none absolute" style={{ top: '35%', left: '10%', fontSize: 'clamp(4rem, 9vw, 9rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          Beyond
        </h1>
        <h1 className="font-display font-bold leading-none absolute" style={{ top: '55%', right: '28%', color: '#C4B088', fontSize: 'clamp(2rem, 5vw, 5rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          The
        </h1>
        <h1 className="font-display font-bold leading-none absolute" style={{ top: '64%', right: '12%', color: '#606C38', fontSize: 'clamp(4rem, 9vw, 9rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          Green
        </h1>
      </div>

      {/* Layer 4 (Scroll Instruction) */}
      <div ref={scrollInstRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none" style={{ zIndex: 30 }}>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70 text-center">Scroll slowly to begin your enchanted journey</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Layer 5 (Frame 030 Subtitle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 25, top: '-20%' }}>
        {showHiddenParadise && (
          <div 
            className={`transition-all duration-1000 ease-in-out uppercase text-white ${paradiseOut ? 'opacity-0 -translate-y-24' : (paradiseIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}`} 
            style={{ fontFamily: 'Tenada', fontSize: 'clamp(24px, 5vw, 45px)', letterSpacing: '1.5px', textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}
          >
            <TextType 
              text="The Hidden Paradise"
              typingSpeed={40}
              pauseDuration={2400}
              showCursor={true}
              cursorCharacter="●"
              variableSpeedEnabled
              variableSpeed={{ min: 30, max: 80 }}
              loop={false}
            />
          </div>
        )}
      </div>

      {/* Layer 6 (Frame 105 Text) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 26, top: '-5%' }}>
        {showHarmony && (
          <div className={`transition-all duration-1000 ease-in-out italic text-[#C4B088] ${harmonyOut ? 'opacity-0 -translate-y-24' : (harmonyIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}`} style={{ fontFamily: '"Oceanside Typewriter", monospace', fontSize: 'clamp(18px, 4vw, 30px)', letterSpacing: '1.5px', textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
            <DecryptedText
              text="where every leaf tells a story of harmony"
              speed={40}
              maxIterations={15}
              animateOn="view"
              revealDirection="center"
              encryptedClassName="text-[#727E58]"
            />
          </div>
        )}
      </div>

      {/* Layer 7 (Frame 205 TextPressure) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 27 }}>
        <style>{`
          .tangkahan-bronze-text span {
            background: linear-gradient(to bottom, #fdf5a9 0%, #f3d47c 30%, #b38728 60%, #8a5a19 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 8px 10px rgba(0,0,0,0.6));
          }
          .tangkahan-bronze-text.stroke span::after {
            -webkit-text-stroke-color: rgba(138, 90, 25, 0.5) !important;
          }
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
          }
          .custom-slider::-moz-range-thumb {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
            border: none;
          }
        `}</style>
        {showTangkahan && (
          <div className={`w-[80%] flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 transition-all duration-1000 ease-in-out ${tangkahanOut ? 'opacity-0 -translate-y-24' : (tangkahanIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}`} style={{ height: 'auto', minHeight: '350px' }}>
            
            <div className="relative mb-6 w-full pointer-events-auto">
              <TextPressure
                text="TANGKAHAN"
                flex={true}
                alpha={false}
                stroke={true}
                width={true}
                weight={true}
                italic={true}
                textColor="#f3d47c"
                strokeColor="#8a5a19"
                minFontSize={36}
                className="tangkahan-bronze-text"
              />
            </div>

            <div className="flex flex-col items-center w-full max-w-md mt-8 pointer-events-auto">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#EADCB9] mb-4">SLIDE TO UNLOCK THE MAGIC</span>


              <span className="font-sans text-[0.65rem] text-[rgba(255,255,255,0.6)] mt-6 text-center max-w-[80%] leading-relaxed tracking-wide">
                Experience an authentic connection with nature and community-led conservation in the heart of Sumatra.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════
   REVEAL HOOK — scroll-triggered fade in
   ══════════════════════════════════════════════════ */

function useReveal(selector, opts) {
  var options = opts || {};
  var ref = React.useRef(null);
  React.useEffect(function () {
    var root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var targets = root.querySelectorAll(selector);
    if (targets.length === 0) return;
    var tweens = [];
    targets.forEach(function (el, i) {
      var tw = gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          delay: i * (options.stagger || 0.08),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
      tweens.push(tw);
    });
    return function () {
      tweens.forEach(function (tw) {
        if (tw.scrollTrigger) tw.scrollTrigger.kill();
        tw.kill();
      });
    };
  }, [selector, options.stagger]);
  return ref;
}

/* ══════════════════════════════════════════════════
   SECTION: HEARTBEAT COUNTER (STATS)
   ══════════════════════════════════════════════════ */
function StatsSection() {
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
    <section ref={sectionRef} id="stats" className="relative px-6 sm:px-10 lg:px-16 py-16 md:py-32 overflow-hidden" style={{ backgroundImage: 'linear-gradient(180deg, rgba(2,8,7,0.85) 0%, rgba(10,31,18,0.9) 100%), url("/asset/asset5.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-center md:items-start text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#C4B088] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num1Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Hectares of rainforests
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#C4B088] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num2Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Residents
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#C4B088] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span ref={num3Ref}>0</span>
          </div>
          <div className="stat-label mt-2 font-mono text-xs sm:text-sm text-[#6b9f7a] uppercase tracking-[0.2em]">
            Elephants
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="font-display italic text-[#C4B088] leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
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

/* ══════════════════════════════════════════════════
   SECTION: BEYOND THE PORTAL — editorial content
   ══════════════════════════════════════════════════ */

function BeyondSection() {
  var ref = useReveal('.rv');
  return (
    <section id="sungai" className="relative px-6 sm:px-10 lg:px-16" style={{ paddingTop: 'clamp(6rem,12vw,10rem)', paddingBottom: 'clamp(6rem,12vw,10rem)', backgroundImage: 'url("/asset/asset5.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div ref={ref} className="mx-auto" style={{ maxWidth: '1300px' }}>
        {/* Offset text block — NOT centered, NOT grid */}
        <div className="rv sm:ml-[15%] lg:ml-[20%] max-w-xl">
          <div className="eyebrow mb-5">
            <span className="eyebrow__line" />
            <span className="eyebrow__text text-[#678A44]">BEHIND THE PORTAL</span>
          </div>
          <p className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] italic leading-relaxed text-[#e2f0e6]" style={{ letterSpacing: '-0.01em' }}>
            The city is loud, but the rainforest knows how to listen. Follow the river deep into the trees and find a place where <span className="text-[#C4B088]">time </span><span className="text-[#678A44]">slows</span><span className="text-[#C4B088]"> down</span> to match your own <span className="text-[#C4B088]">peace</span>.
          </p>

        </div>
      </div>
    </section>
  );
}

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
    var l1 = label1Ref.current;
    var l2 = label2Ref.current;

    if (!container || !topImgWrap || !topImg || !handle) return;

    // Ambient animations
    var bgTween1 = gsap.to(topImg, { scale: 1.05, duration: 15, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    var bgTween2 = gsap.to(bottomImg, { scale: 1.05, duration: 15, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    var floatTween1 = gsap.to(l1, { y: -15, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    var floatTween2 = gsap.to(l2, { y: 15, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });

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
      floatTween1.kill();
      floatTween2.kill();
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, []);

  return (
    <section id="history" className="relative px-6 sm:px-10 lg:px-16 overflow-hidden" style={{ paddingTop: '10rem', paddingBottom: '10rem', background: '#0a1f12' }}>
      
      <div className="relative z-10 mx-auto max-w-6xl mb-12 flex flex-col items-center">
        <div className="eyebrow mb-6">
          <span className="eyebrow__line" />
          <span className="eyebrow__text">The Transformation</span>
          <span className="eyebrow__line" />
        </div>
        <h2 className="font-display italic text-[#e2f0e6] leading-[0.9] text-center" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}>
          Tangkahan's
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(74,222,128,0.6)' }}>Turning Point</span>
        </h2>
      </div>

      <div 
        ref={containerRef}
        className="w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] mx-auto rounded-3xl overflow-hidden relative cursor-ew-resize select-none shadow-2xl"
        style={{ touchAction: 'none', border: '1px solid rgba(74,222,128,0.15)' }}
      >
        {/* Bottom Image (After - Present Day) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a1f12]">
          <img ref={bottomImageRef} src="/asset/history-after.png" alt="Present Eco Tourism" className="absolute inset-0 w-full h-full object-cover origin-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,18,0.6)] to-transparent pointer-events-none" />
          <div ref={label2Ref} className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-right z-10 pointer-events-none drop-shadow-2xl">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[#4ade80] block mb-2 drop-shadow-md">Present Day</span>
            <span className="font-display italic text-3xl sm:text-5xl text-white block">Eco Tourism</span>
          </div>
        </div>

        {/* Top Image (Before - 1990s) */}
        <div ref={topImageWrapperRef} className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
          <img ref={topImageRef} src="/asset/history-before.png" alt="1990s Deforestation" className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 contrast-125 origin-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,18,0.8)] to-transparent pointer-events-none" />
          <div ref={label1Ref} className="absolute top-8 left-8 sm:top-12 sm:left-12 z-10 pointer-events-none drop-shadow-2xl">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[#f59e0b] block mb-2 drop-shadow-md">1990s</span>
            <span className="font-display italic text-3xl sm:text-5xl text-gray-300 block">Deforestation</span>
          </div>
        </div>

        {/* The Drag Handle (Sleek Glassmorphic Pill) */}
        <div 
          ref={handleRef}
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
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

/* ══════════════════════════════════════════════════
   SECTION: ELEPHANT GALLERY — Hover Distortion
   ══════════════════════════════════════════════════ */
function ElephantGallery() {
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
    <section id="elephants" className="relative px-6 sm:px-10 lg:px-16 border-t border-[rgba(74,222,128,0.05)] bg-[#020807]" style={{ paddingTop: '8rem', paddingBottom: '12rem' }}>
      
      {/* Section Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none" 
        style={{ backgroundImage: 'url("/asset/background gajah sumatra.jpeg")' }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020807] via-transparent to-[#020807] opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020807] via-[rgba(2,8,7,0.7)] to-transparent pointer-events-none" />

      {/* SVG Filter for Liquid Distortion */}
      <svg className="hidden">
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap ref={filterRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10" style={{ maxWidth: '1200px' }}>
        <div className="lg:w-1/2 relative">

          <h2 className="font-display italic text-[#e2f0e6] leading-[1.05] mb-8 mt-4" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', letterSpacing: '-0.02em' }}>
            Welcome to
            <br />
            <span className="text-[#C4B088] inline-block ml-16 md:ml-32">Tangkahan</span>
          </h2>
          <p className="text-white text-lg md:text-2xl leading-relaxed mb-8 text-justify">
            Tangkahan, also known as ‘The Hidden Paradise’ was established as a biodiversity conservation area to implement sustainable solutions; helping us to protect the purity of the rainforest and support responsible tourism.
          </p>
          <div className="p-8 md:p-10 border border-[rgba(74,222,128,0.15)] rounded-2xl bg-[#4c543d]/80 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#4ade80] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <p className="font-mono text-base md:text-xl uppercase tracking-widest text-[#C4B088] font-bold mb-4">FUN FACT!</p>
            <p className="text-base md:text-lg text-[#e2f0e6] leading-relaxed">
              There are 9 Sumatran Elephants in Tangkahan, rescued from conflict in Banda Aceh. They are specially trained to help rangers patrol the forest and protect it from ilegal logging. 
              <br/><br/>The coolest part is that you can see the harmonious interaction between the local community and the elephants. The community helps to care for them and save their herds from extinction.
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/2 w-full">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <img 
              ref={imgRef}
              src="/asset/awasjatoh.jpeg" 
              alt="Sumatran Elephant in Tangkahan" 
              className="w-full h-full object-cover transition-all duration-700 grayscale hover:grayscale-0"
              style={{ filter: 'url(#liquid)', cursor: 'crosshair' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SPOTS — CircularGallery & ScrollStack
   ══════════════════════════════════════════════════ */

const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full h-auto min-h-[400px] md:min-h-[500px] my-8 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.5)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = React.useRef(null);
  const stackCompletedRef = React.useRef(false);
  const animationFrameRef = React.useRef(null);
  const tickerCallbackRef = React.useRef(null);
  const lenisRef = React.useRef(null);
  const cardsRef = React.useRef([]);
  const lastTransformsRef = React.useRef(new Map());
  const isUpdatingRef = React.useRef(false);

  const calculateProgress = React.useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = React.useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = React.useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = React.useCallback(
    element => {
      let top = 0;
      let current = element;
      while (current) {
        top += current.offsetTop;
        current = current.offsetParent;
      }
      
      if (!useWindowScroll && scrollerRef.current) {
        let scrollerTop = 0;
        let s = scrollerRef.current;
        while (s) {
          scrollerTop += s.offsetTop;
          s = s.offsetParent;
        }
        return top - scrollerTop;
      }
      return top;
    },
    [useWindowScroll]
  );

  const updateCardTransforms = React.useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const handleScroll = React.useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = React.useCallback(() => {
    if (!Lenis) return;
    if (useWindowScroll) {
      const isMobile = window.innerWidth < 768;
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        smoothTouch: false,
        syncTouch: !isMobile,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      if (window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
      }
      if (window.gsap && window.gsap.ticker) {
        tickerCallbackRef.current = (time) => {
          if (lenisRef.current) lenisRef.current.raf(time * 1000);
        };
        window.gsap.ticker.add(tickerCallbackRef.current);
        window.gsap.ticker.lagSmoothing(0);
      } else {
        const raf = time => {
          if (lenisRef.current) lenisRef.current.raf(time);
          animationFrameRef.current = requestAnimationFrame(raf);
        };
        animationFrameRef.current = requestAnimationFrame(raf);
      }
      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const isMobile = window.innerWidth < 768;
      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        smoothTouch: false,
        syncTouch: !isMobile,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (tickerCallbackRef.current && window.gsap && window.gsap.ticker) {
        window.gsap.ticker.remove(tickerCallbackRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  const containerStyles = useWindowScroll
    ? {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }
    : {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      };

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles}>
      <div className="scroll-stack-inner px-4 md:px-10 pb-[20rem] md:pb-[30rem] pt-10 min-h-screen">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

/* CircularGallery Code */

function cg_debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function cg_lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function cg_autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

const CG_DEFAULT_FONT = 'bold 30px Figtree';
const CG_DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap';

function cg_deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

async function cg_loadFontFromStylesheet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family = null;
  const fontFaces = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      document.fonts.add(face);
    })
  );
  return family;
}

async function cg_loadFontFromFile(url) {
  const family = cg_deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function cg_loadCustomFont(fontUrl) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? cg_loadFontFromStylesheet(fontUrl) : cg_loadFontFromFile(fontUrl);
}

async function cg_resolveFont(font, fontUrl) {
  const effectiveUrl = fontUrl || (font === CG_DEFAULT_FONT ? CG_DEFAULT_FONT_URL : null);
  if (!effectiveUrl) {
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(font);
        await document.fonts.ready;
      } catch (e) {}
    }
    return font;
  }
  try {
    const family = await cg_loadCustomFont(effectiveUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px';
    const resolved = `${prefix} "${family}"`;
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(resolved);
      } catch (e) {}
    }
    return resolved;
  } catch (error) {
    console.error('CircularGallery: unable to load font from', fontUrl, error);
    return font;
  }
}

function cg_getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function cg_createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const Texture = ogl.Texture;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(cg_getFontSize(font) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class CG_Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    cg_autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { Plane, Program, Mesh } = ogl;
    const { texture, width, height } = cg_createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class CG_Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const { Texture, Program } = ogl;
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }
  createMesh() {
    const { Mesh } = ogl;
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new CG_Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class AppGallery {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = cg_debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    const { Renderer } = ogl;
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    const { Camera } = ogl;
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    const { Transform } = ogl;
    this.scene = new Transform();
  }
  createGeometry() {
    const { Plane } = ogl;
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const galleryItems = items && items.length ? items : [];
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new CG_Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      default:
        break;
    }
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = cg_lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);

    this.container?.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    this.container?.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    this.container?.removeEventListener('touchstart', this.boundOnTouchDown);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }

    if (this.container) {
      this.container.removeEventListener('keydown', this.boundOnKeyDown);
    }
  }
}

function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05
}) {
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (!ogl) return;
    if (!containerRef.current) return;
    let app;
    let isMounted = true;
    cg_resolveFont(font, fontUrl).then(resolvedFont => {
      if (!isMounted || !containerRef.current) return;
      app = new AppGallery(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        scrollSpeed,
        scrollEase
      });
    });
    return () => {
      isMounted = false;
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase]);
  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Use Left and Right Arrow keys to navigate."
      ref={containerRef}
    />
  );
}

function SpotsSection() {
  

  const SPOTS = [
    { id: 'spot-1', name: 'Elephant Camp', img: '/asset/elephant_camp.png', desc: 'See them up close, interact with them and help bathe the elephants in the river.', variantClass: 'variant-1' },
    { id: 'spot-2', name: 'Hot Springs', img: '/asset/hot_springs.png', desc: 'A natural hot spring pool by the river, best after a long journey in the jungle!', variantClass: 'variant-2' },
    { id: 'spot-3', name: 'Bat Cave', img: '/asset/bat_cave.png', desc: 'Not far from Tangkahan, there is a natural cave inhabited by a colony of bats.', variantClass: 'variant-3' },
    { id: 'spot-4', name: 'Forest Trail', img: '/asset/forest_trail.png', desc: 'Explore the forest with a local guide to observe the immense biodiversity.', variantClass: 'variant-4' }
  ];

  const VARIANTS = {
    'variant-1': { imgClass: 'top-[10%] right-[10%] md:right-[15%] md:top-[15%] w-[60%] md:w-[35%] aspect-[4/5]', textClass: 'bottom-[10%] md:bottom-[20%] left-[10%] md:left-[25%]' },
    'variant-2': { imgClass: 'bottom-[10%] md:bottom-[15%] left-[10%] md:left-[20%] w-[60%] md:w-[40%] aspect-[3/4]', textClass: 'top-[15%] md:top-[25%] right-[10%] md:right-[20%]' },
    'variant-3': { imgClass: 'top-[20%] left-[20%] md:left-[30%] w-[70%] md:w-[40%] aspect-square', textClass: 'bottom-[15%] md:bottom-[25%] right-[10%] md:right-[15%]' },
    'variant-4': { imgClass: 'bottom-[15%] md:bottom-[20%] right-[10%] md:right-[20%] w-[65%] md:w-[45%] aspect-[4/3]', textClass: 'top-[15%] md:top-[20%] left-[10%] md:left-[25%]' }
  };

  const [activeSpot, setActiveSpot] = useState(null);
  const prevSpotRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  const bgContainerRef = useRef(null);
  const previewImgContainerRef = useRef(null);
  const previewImgElRef = useRef(null);
  const previewTextRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  // Background Crossfade Logic
  useEffect(() => {
    if (!bgContainerRef.current) return;
    
    if (activeSpot) {
      const newImg = document.createElement('img');
      newImg.src = activeSpot.img;
      newImg.className = 'absolute inset-0 w-full h-full object-cover opacity-0 transition-none';
      bgContainerRef.current.appendChild(newImg);
      
      gsap.to(newImg, {
        opacity: 0.4,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          const imgs = bgContainerRef.current.querySelectorAll('img');
          for (let i = 0; i < imgs.length - 1; i++) {
            imgs[i].remove();
          }
        }
      });
    } else {
      const imgs = bgContainerRef.current.querySelectorAll('img');
      if (imgs.length > 0) {
        gsap.to(imgs, {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            imgs.forEach(img => img.remove());
          }
        });
      }
    }
  }, [activeSpot]);

  // Aperture Reveal & Content Logic
  useEffect(() => {
    const prevSpot = prevSpotRef.current;
    
    if (activeSpot) {
      const variant = VARIANTS[activeSpot.variantClass];
      
      // Update textual content
      if (titleRef.current && descRef.current && previewImgElRef.current) {
        titleRef.current.innerText = activeSpot.name;
        descRef.current.innerText = activeSpot.desc;
        previewImgElRef.current.src = activeSpot.img;
      }
      
      // Reset classes for the new variant
      previewImgContainerRef.current.className = `absolute overflow-hidden shadow-2xl ${variant.imgClass}`;
      previewTextRef.current.className = `absolute max-w-[280px] md:max-w-md ${variant.textClass}`;
      
      if (!prevSpot) {
        // From null to activeSpot: Aperture reveal
        gsap.killTweensOf([previewImgContainerRef.current, previewTextRef.current]);
        
        gsap.fromTo(previewImgContainerRef.current, 
          { clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, ease: 'power3.out' }
        );
        
        gsap.fromTo(previewTextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
      } else if (prevSpot.id !== activeSpot.id) {
        // Switching between spots: crossfade content
        gsap.killTweensOf([previewImgContainerRef.current, previewTextRef.current]);
        
        gsap.fromTo(previewImgContainerRef.current,
          { opacity: 0.2 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
        gsap.fromTo(previewTextRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        gsap.set(previewImgContainerRef.current, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
      }
    } else if (prevSpot) {
      // Reverting to null
      gsap.killTweensOf([previewImgContainerRef.current, previewTextRef.current]);
      
      gsap.to(previewImgContainerRef.current, {
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        duration: 0.8,
        ease: 'power3.inOut'
      });
      
      gsap.to(previewTextRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
    
    prevSpotRef.current = activeSpot;
  }, [activeSpot]);

  const handleMouseEnter = (spot) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveSpot(spot);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSpot(null);
    }, 100);
  };

  return (
    <section id="spots" className="relative w-full h-screen bg-[#020807] overflow-hidden">
      {/* Background Layer */}
      <div ref={bgContainerRef} className="absolute inset-0 z-0"></div>
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      {/* Navigation List (Z-20) */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
        <div className="eyebrow mb-4 opacity-50">
          <span className="eyebrow__line w-8" />
          <span className="eyebrow__text tracking-[0.2em] text-[#6b9f7a]">Archive</span>
        </div>
        
        <div className="flex flex-col gap-5 items-start">
          {SPOTS.map((spot) => (
            <button
              key={spot.id}
              onMouseEnter={() => handleMouseEnter(spot)}
              onMouseLeave={handleMouseLeave}
              className={`text-left font-mono text-sm md:text-base tracking-[0.25em] uppercase transition-all duration-500 hover:text-[#e2f0e6] hover:translate-x-2 ${
                activeSpot && activeSpot.id === spot.id ? 'text-[#e2f0e6] translate-x-2' : 'text-[#6b9f7a]'
              }`}
            >
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Container (Z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Aperture Image */}
        <div ref={previewImgContainerRef} className="absolute overflow-hidden shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}>
          <img ref={previewImgElRef} src="" alt="Spot Preview" className="w-full h-full object-cover filter grayscale-[30%] contrast-[1.1] brightness-90" />
        </div>
        
        {/* Preview Text */}
        <div ref={previewTextRef} className="absolute flex flex-col gap-3 opacity-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#6b9f7a]">Location</p>
          <h3 ref={titleRef} className="font-display italic text-5xl md:text-6xl text-[#e2f0e6]"></h3>
          <p ref={descRef} className="font-body text-sm md:text-base text-[#6b9f7a] leading-relaxed max-w-sm"></p>
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════
   SECTION: STARTER PACK — Editorial Asymmetric Grid
   ══════════════════════════════════════════════════ */
var TOOLS = [
  { id: 't1', name: 'Binoculars', category: 'Observation', img: '/asset/tool_binoculars_1782866982113.png', class: 'rotate-[-1deg] translate-y-4' },
  { id: 't2', name: 'Headlamp', category: 'Illumination', img: '/asset/tool_headlamp_1782866999186.png', class: 'rotate-[2deg] translate-y-16' },
  { id: 't3', name: 'Compass', category: 'Navigation', img: '/asset/tool_compass_1782866990189.png', class: 'rotate-[-2deg]' },
  { id: 't4', name: 'Field Guide', category: 'Knowledge', img: '/asset/tool_flask_1782867009069.png', class: 'rotate-[1deg] translate-y-12' },
  { id: 't5', name: 'Machete', category: 'Clearing', img: '/asset/tool_binoculars_1782866982113.png', class: 'rotate-[-1deg] translate-y-6' },
  { id: 't6', name: 'First Aid', category: 'Safety', img: '/asset/tool_headlamp_1782866999186.png', class: 'rotate-[3deg] translate-y-20' },
  { id: 't7', name: 'Water Flask', category: 'Hydration', img: '/asset/tool_flask_1782867009069.png', class: 'rotate-[-2deg] translate-y-8' },
  { id: 't8', name: 'Paracord', category: 'Utility', img: '/asset/tool_compass_1782866990189.png', class: 'rotate-[1deg] translate-y-16' },
  { id: 't9', name: 'Trek Boots', category: 'Footwear', img: '/asset/tool_binoculars_1782866982113.png', class: 'rotate-[-1deg] translate-y-2' }
];

/* ══════════════════════════════════════════════════
   SECTION: VISUAL NOVEL — Mahout's Story
   ══════════════════════════════════════════════════ */
function VisualNovelSection() {
  const VN_NODES = {
    start: {
      id: 'start',
      text: "Masih tercium.\n\nAroma oli.\nGetah kayu.\nDan asap.",
      mood: "dark",
      choices: [
        { label: "Kau mengingat bau itu?", nextId: "pengakuan" }
      ]
    },
    pengakuan: {
      id: 'pengakuan',
      text: "Aku sangat mengenalnya.\n\nKarena dulu...\nakulah yang menebang hutan ini.",
      mood: "dark",
      choices: [
        { label: "Tidakkah kau merasa bersalah?", nextId: "angka" },
        { label: "Mengapa kau melakukannya?", nextId: "angka" }
      ]
    },
    angka: {
      id: 'angka',
      text: "Saat itu, pohon hanyalah angka.\n\nKubik kayu yang ditukar dengan beras.\n\n...Sampai suatu hari, semuanya berhenti.",
      mood: "dark",
      choices: [
        { label: "Apa yang terjadi?", nextId: "sungai_mati" }
      ]
    },
    sungai_mati: {
      id: 'sungai_mati',
      text: "Sungai berubah keruh.\n\nLumpur menelan bebatuan.\nDesa kami mengering, dan anak-anak mulai batuk berdarah.",
      mood: "sad",
      choices: [
        { label: "Hutan sedang sekarat.", nextId: "penyesalan" },
        { label: "Kalian menghancurkan diri sendiri.", nextId: "penyesalan" }
      ]
    },
    penyesalan: {
      id: 'penyesalan',
      text: "Ya.\n\nKami sedang menggergaji fondasi rumah kami sendiri.\n\nPenyesalan itu datang, tapi kami tak tahu cara memperbaikinya.",
      mood: "sad",
      choices: [
        { label: "Lalu, bagaimana kalian selamat?", nextId: "truk_datang" }
      ]
    },
    truk_datang: {
      id: 'truk_datang',
      text: "Suatu sore...\n\nTruk-truk menderu dari utara.\nMembawa sembilan raksasa kelabu yang kehilangan rumah karena konflik.",
      mood: "sad",
      choices: [
        { label: "Gajah-gajah itu...", nextId: "luka_gajah" }
      ]
    },
    luka_gajah: {
      id: 'luka_gajah',
      text: "Ada bekas kawat baja di kaki matriark tertua.\n\nLuka menganga.\nSama seperti luka hutan yang kami tinggalkan.",
      mood: "sad",
      choices: [
        { label: "Apa yang dia lakukan padamu?", nextId: "tatapan" }
      ]
    },
    tatapan: {
      id: 'tatapan',
      text: "Dia menatapku.\n\nTidak ada amarah di matanya.\nHanya...\nkesedihan purba yang sangat dalam.",
      mood: "sad",
      choices: [
        { label: "Dia tahu siapa kau.", nextId: "sentuhan" },
        { label: "Dia memaafkanmu?", nextId: "sentuhan" }
      ]
    },
    sentuhan: {
      id: 'sentuhan',
      text: "Perlahan, belalainya menyentuh telapak tanganku.\n\nTangan yang sama...\nyang dulu menghancurkan rumahnya.",
      mood: "hope",
      choices: [
        { label: "Apa yang kau rasakan?", nextId: "buang_gergaji" }
      ]
    },
    buang_gergaji: {
      id: 'buang_gergaji',
      text: "Malam itu juga...\n\nAku membuang gergajiku ke dasar jurang.\nAku bersumpah untuk menjadi perisai mereka.",
      mood: "resolute",
      choices: [
        { label: "Apakah semua warga setuju?", nextId: "kawan_lama" }
      ]
    },
    kawan_lama: {
      id: 'kawan_lama',
      text: "Tidak.\n\nBeberapa kawan lamaku mencibir.\nBagi mereka, gajah adalah hama.\nHarga gading sanggup membuat manusia buta.",
      mood: "dark",
      choices: [
        { label: "Mereka datang berburu?", nextId: "patroli_malam" }
      ]
    },
    patroli_malam: {
      id: 'patroli_malam',
      text: "Malam yang sangat pekat.\n\nAku sedang berpatroli menunggangi sang matriark.\nTerdengar bunyi decak logam senapan di balik semak.",
      mood: "dark",
      choices: [
        { label: "Kawan lamamu?", nextId: "konfrontasi" }
      ]
    },
    konfrontasi: {
      id: 'konfrontasi',
      text: "Ya.\n\nSenter mereka menyilaukan mataku.\nLaras senapan diarahkan lurus ke dada gajahku.\n\nAku menahan napas.",
      mood: "dark",
      choices: [
        { label: "Apa yang kau lakukan?", nextId: "suara_bumi" }
      ]
    },
    suara_bumi: {
      id: 'suara_bumi',
      text: "Aku tidak melakukan apa-apa.\n\nSang matriark yang mengambil langkah maju.\nIa mengeluarkan getaran rendah yang membuat tanah bergetar hebat.",
      mood: "resolute",
      choices: [
        { label: "Sebuah ancaman.", nextId: "mundur" }
      ]
    },
    mundur: {
      id: 'mundur',
      text: "Lebih dari itu.\n\nItu adalah suara rimba yang bangkit kembali.\n\nMereka menjatuhkan senapan dan lari ketakutan.",
      mood: "resolute",
      choices: [
        { label: "Kalian berhasil.", nextId: "tahun_berganti" }
      ]
    },
    tahun_berganti: {
      id: 'tahun_berganti',
      text: "Waktu berlalu.\n\nJalur tebangan kini tertutup lumut tebal.\nAir sungai kembali jernih.",
      mood: "hope",
      choices: [
        { label: "Dan desa?", nextId: "anak_desa" }
      ]
    },
    anak_desa: {
      id: 'anak_desa',
      text: "Anak-anak kembali bermain air.\n\nMereka menggambar gajah di pasir basah.\nMereka tak pernah lagi tahu bagaimana bau oli dan asap.",
      mood: "hope",
      choices: [
        { label: "Kau telah menebus dosamu.", nextId: "pesan_terakhir" }
      ]
    },
    pesan_terakhir: {
      id: 'pesan_terakhir',
      text: "Terkadang aku berpikir...\n\nHutan tidak pernah meminta kita menjadi pahlawan.",
      mood: "hope",
      choices: [
        { label: "Lalu apa yang ia minta?", nextId: "ending_final" }
      ]
    },
    ending_final: {
      id: 'ending_final',
      text: "...\n\nIa hanya berharap kita berhenti menjadi musuhnya.",
      mood: "hope",
      choices: [
        { label: "[ Tutup Memori ]", nextId: "end" }
      ]
    }
  };

  
  
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [lineIndex, setLineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const node = VN_NODES[currentNodeId];
  const textLines = node && node.text ? node.text.split('\n\n').filter(Boolean) : [];
  const isTextFullyRevealed = lineIndex >= textLines.length - 1;
  
  const sectionRef = useRef(null);
  const boxRef = useRef(null);
  const textContainerRef = useRef(null);
  const choicesContainerRef = useRef(null);
  const bgRef = useRef(null);
  const mahoutRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const floatTween = gsap.to(boxRef.current, { y: -15, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => { floatTween.kill(); };
  }, []);

  useEffect(() => {
    if (!node || currentNodeId === 'end') return;
    
    let filterStr = 'contrast(1.2) brightness(0.8)';
    let bgScale = 1;
    let mahoutScale = 1;
    let mahoutX = 0;
    
    if (node.mood === 'hope') {
      filterStr = 'contrast(1.1) brightness(1.2) hue-rotate(-5deg)';
      bgScale = 1.05;
      mahoutScale = 1.03;
    } else if (node.mood === 'sad') {
      filterStr = 'contrast(1.3) brightness(0.5) sepia(0.3)';
      bgScale = 0.98;
      mahoutX = 10;
    } else if (node.mood === 'resolute') {
      filterStr = 'contrast(1.25) brightness(1) sepia(0)';
      bgScale = 1.02;
      mahoutScale = 1.08;
      mahoutX = -10;
    } else if (node.mood === 'dark') {
      filterStr = 'contrast(1.2) brightness(0.8)';
    }
    
    gsap.to(mahoutRef.current, { filter: filterStr, scale: mahoutScale, x: mahoutX, duration: 1.5, ease: 'power2.inOut' });
    gsap.to(bgRef.current, { scale: bgScale, duration: 2, ease: 'sine.inOut' });
    
  }, [currentNodeId]);

  useEffect(() => {
    if (!node || currentNodeId === 'end' || textLines.length === 0) return;
    
    const currentLineEl = lineRefs.current[lineIndex];
    if (currentLineEl) {
      gsap.fromTo(currentLineEl, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
    
    if (isTextFullyRevealed && (!node.choices || node.choices.length === 0)) {
      const delay = node.delay || 2500;
      const timeout = setTimeout(() => {
        if (node.autoNext) handleChoice(node.autoNext);
      }, delay);
      return () => clearTimeout(timeout);
    }
    
  }, [lineIndex, currentNodeId, isTextFullyRevealed]);

  useEffect(() => {
    if (!node || currentNodeId === 'end') return;
    
    if (isTextFullyRevealed && node.choices && node.choices.length > 0) {
      if (choicesContainerRef.current) {
        const buttons = choicesContainerRef.current.querySelectorAll('button');
        gsap.fromTo(buttons, 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.2 }
        );
      }
    }
  }, [isTextFullyRevealed, currentNodeId]);

  const handleContainerClick = () => {
    if (currentNodeId === 'end' || isTransitioning) return;
    
    if (!isTextFullyRevealed) {
      setLineIndex(prev => prev + 1);
    }
  };

  const handleChoice = (nextId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        if (nextId === 'end') {
          gsap.to(boxRef.current, { opacity: 0, y: 40, duration: 1, ease: 'power3.inOut' });
          setCurrentNodeId('end');
        } else {
          setCurrentNodeId(nextId);
          setLineIndex(0);
        }
        setIsTransitioning(false);
      }
    });
    
    if (choicesContainerRef.current) {
      const buttons = choicesContainerRef.current.querySelectorAll('button');
      if (buttons.length > 0) {
        tl.to(buttons, { opacity: 0, x: 20, stagger: -0.05, duration: 0.3, ease: 'power2.in' }, 0);
      }
    }
    if (textContainerRef.current) {
      tl.to(textContainerRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0.1);
      tl.set(textContainerRef.current, { opacity: 1, y: 0 });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#020807] flex items-center justify-center sm:justify-end px-4 sm:px-16" id="vn-branching">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img ref={bgRef} src="/asset/vn_bg.png" alt="Forest Background" className="absolute top-[-5%] left-[-5%] w-[110%] h-[110%] object-cover opacity-30 transform-gpu" />
      </div>
      
      <div className="absolute inset-0 z-10 flex items-end justify-start pointer-events-none">
        <img ref={mahoutRef} src="/asset/vn_mahout.png" alt="Mahout Silhouette" className="h-[40vh] md:h-[60vh] w-auto max-w-none object-contain opacity-60 origin-bottom mix-blend-screen transform-gpu" style={{ filter: 'contrast(1.2) brightness(0.8)' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-transparent to-[#020807]/50 opacity-90 z-20 pointer-events-none" />

      <div className="relative z-30 w-full max-w-2xl pt-20 pointer-events-none">
        <div ref={boxRef} onClick={handleContainerClick} className="w-full backdrop-blur-2xl bg-[rgba(10,31,18,0.4)] border border-[rgba(74,222,128,0.2)] rounded-[2rem] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(74,222,128,0.05)] relative pointer-events-auto cursor-pointer transition-colors hover:bg-[rgba(10,31,18,0.45)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,222,128,0.08)] to-transparent rounded-[2rem] pointer-events-none" />
          
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#f59e0b] mb-6 flex items-center gap-3 opacity-80">
            <span className="w-8 h-px bg-[#f59e0b] block" />
            Jejak Raksasa di Tangkahan
          </div>
          
          {currentNodeId !== 'end' && node && (
            <div className="relative min-h-[150px] md:min-h-[200px] flex flex-col justify-between">
              <div ref={textContainerRef} className="flex flex-col gap-6">
                {textLines.slice(0, lineIndex + 1).map((line, idx) => (
                  <p key={idx} ref={el => lineRefs.current[idx] = el} className="font-display italic text-base md:text-xl lg:text-2xl leading-[1.6] text-[#e2f0e6] opacity-0 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>

              {!isTextFullyRevealed && (
                <div className="absolute bottom-[-20px] right-0 animate-pulse text-[#4ade80] opacity-50 font-mono text-sm tracking-widest">
                  KLIK UNTUK MELANJUTKAN ▼
                </div>
              )}

              {isTextFullyRevealed && node.choices && node.choices.length > 0 && (
                <div ref={choicesContainerRef} className="mt-8 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                  {node.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice.nextId)}
                      className="group relative overflow-hidden flex items-center justify-between w-full text-left px-6 py-4 rounded-2xl backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] transition-colors duration-500 hover:bg-[rgba(74,222,128,0.1)] hover:border-[rgba(74,222,128,0.3)] hover:shadow-[0_0_20px_rgba(74,222,128,0.15)] opacity-0 cursor-pointer"
                    >
                      <span className="relative z-10 font-body text-[0.85rem] font-medium tracking-wide text-[#c4dccb] group-hover:text-[#4ade80] transition-colors duration-300">
                        ▶ {choice.label}
                      </span>
                      <span className="relative z-10 font-mono text-[0.8rem] text-[#4ade80] opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Lanjut
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JungleSecretsSection() {
  var SECRETS = [
    { id: 'sec-1', name: 'Rafflesia Arnoldii', img: '/asset/bat_cave.png', subtitle: 'THE CORPSE FLOWER', desc: 'A rare and magnificent parasitic plant known for producing the largest individual flower on Earth, with a very unique odor.' },
    { id: 'sec-2', name: 'Thomas Leaf Monkey', img: '/asset/forest_trail.png', subtitle: 'THE CANOPY ACROBAT', desc: 'Endemic to northern Sumatra, these primates are known for their distinct punk-rock hairstyles and incredible agility in the trees.' },
    { id: 'sec-3', name: 'Sumatran Tiger', img: '/asset/elephant_camp.png', subtitle: 'THE APEX PREDATOR', desc: 'The smallest of all tiger subspecies, highly elusive and critically endangered, roaming the deep primary forests.' },
    { id: 'sec-4', name: 'Banyan Tree', img: '/asset/hot_springs.png', subtitle: 'THE ANCIENT GIANT', desc: 'Massive fig trees with intricate aerial root systems that can cover huge areas, often considered sacred by local communities.' }
  ];

  return (
    <section id="jungle-secrets" className="relative w-full bg-gradient-to-b from-[#020807] to-[#0a1f12] py-24 border-t border-[rgba(74,222,128,0.05)] overflow-hidden">
      
      {/* Title */}
      <div className="text-center mb-12 lg:mb-24 px-4 relative z-20">
        <div className="eyebrow mb-6 justify-center">
          <span className="eyebrow__line w-8" />
          <span className="eyebrow__text tracking-[0.25em]">Flora & Fauna</span>
          <span className="eyebrow__line w-8" />
        </div>
        <h2 className="font-display italic text-[#e2f0e6] leading-[0.9]" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.02em' }}>
          Jungle
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(74,222,128,0.5)' }}>Secrets</span>
        </h2>
      </div>

      {/* Bottom Half: Scroll Stack */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 z-20 pointer-events-auto">
        <ScrollStack
          useWindowScroll={true}
          itemDistance={80}
          itemStackDistance={35}
          baseScale={0.8}
        >
          {SECRETS.map(function(secret, i) {
            return (
              <ScrollStackItem key={secret.id} itemClassName="overflow-hidden group border border-[rgba(74,222,128,0.15)] bg-[#020807]">
                {/* Background Image Layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img src={secret.img} alt={secret.name} className="w-full h-full object-cover transform transition-transform duration-1000 ease-out md:group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal" />
                </div>

                {/* Gradient Mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-[rgba(2,8,7,0.8)] to-transparent pointer-events-none"></div>

                {/* Typography & Content */}
                <div className="relative z-10 h-full min-h-[400px] md:min-h-[500px] flex flex-col justify-end p-8 md:p-12">
                  {/* Top Right Asymmetry - Giant Faint Number */}
                  <div className="absolute top-6 right-8 md:top-10 md:right-12 font-mono text-[6rem] md:text-[8rem] font-bold text-[rgba(255,255,255,0.03)] leading-none select-none pointer-events-none">
                    0{i+1}
                  </div>

                  {/* Bottom Content */}
                  <div className="max-w-md">
                    <p className="font-mono text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.3em] text-[#4ade80] mb-3">
                      {secret.subtitle}
                    </p>
                    <h3 className="font-display italic text-4xl md:text-5xl text-[#e2f0e6] mb-4">
                      {secret.name}
                    </h3>
                    <p className="font-body text-sm md:text-base text-[#c4dccb] leading-relaxed opacity-90">
                      {secret.desc}
                    </p>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}


function StarterPackSection() {
  var sectionRef = React.useRef(null);
  var cardsRef = React.useRef([]);

  React.useEffect(function() {
    var cards = cardsRef.current;
    if (!cards || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Scroll Reveal
    var tweens = [];
    cards.forEach(function(card, i) {
      if(!card) return;
      var tw = gsap.fromTo(card, 
        { y: 80, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 1.2, 
          ease: 'sine.inOut',
          delay: (i % 3) * 0.15,
          scrollTrigger: { trigger: card, start: 'top 85%', once: true }
        }
      );
      tweens.push(tw);
    });

    return function() {
      tweens.forEach(function(tw) {
        if(tw.scrollTrigger) tw.scrollTrigger.kill();
        tw.kill();
      });
    };
  }, []);

  return (
    <section className="relative px-6 sm:px-10 lg:px-16 overflow-hidden py-40" style={{ background: '#0a1f12' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,222,128,0.03) 0%, transparent 100%)' }} />
      
      <div className="mx-auto" style={{ maxWidth: '1400px' }}>
        
        {/* Asymmetrical Header */}
        <div className="mb-24 sm:mb-32 pl-4 sm:pl-20 lg:pl-32 relative z-10">
          <div className="eyebrow mb-4">
            <span className="eyebrow__line" style={{ width: '60px' }} />
            <span className="eyebrow__text">Essential Tools</span>
          </div>
          <h2 className="font-display italic text-[#e2f0e6] leading-[0.9]" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}>
            Bekal
            <br />
            <span className="text-transparent ml-12 sm:ml-24" style={{ WebkitTextStroke: '1px rgba(74,222,128,0.7)' }}>Penjelajah</span>
          </h2>
        </div>

        {/* Custom Asymmetrical Masonry/Flex Layout */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-24 relative z-10">
          {TOOLS.map(function(tool, i) {
            return (
              <div 
                key={tool.id}
                ref={function(el) { cardsRef.current[i] = el; }}
                className={"relative w-full sm:w-[45%] lg:w-[28%] aspect-[4/5] rounded-3xl cursor-crosshair group " + tool.class}
                style={{ 
                  perspective: '1000px',
                  opacity: 0 // for scroll reveal
                }}
              >
                {/* Inner Card wrapper for 3D flip */}
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Face (Image + overlay text) */}
                  <div 
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    style={{
                      background: 'rgba(2,8,7,0.4)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(74,222,128,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none" />
                    
                    <img 
                      src={tool.img} 
                      alt={tool.name} 
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,8,7,0.9)] via-[rgba(2,8,7,0.2)] to-transparent z-10 pointer-events-none" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-20 pointer-events-none">
                      <div className="flex justify-between items-start w-full">
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#4ade80]">
                          {tool.category}
                        </span>
                        <span className="font-mono text-[0.55rem] text-[rgba(255,255,255,0.4)]">
                          0{i+1}
                        </span>
                      </div>
                      
                      <h3 className="font-display italic text-[#e2f0e6] text-3xl sm:text-4xl leading-none">
                        {tool.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Back Face (Gold card) */}
                  <div 
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    style={{
                      background: '#c8b07a',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none" />
                    
                    <h3 className="font-display font-bold text-[#0a1f12] text-2xl sm:text-3xl mb-6 relative z-10">
                      {tool.name}
                    </h3>
                    
                    <div className="flex gap-3 relative z-10 flex-wrap justify-center">
                      <span className="px-4 py-2 rounded-full border border-[rgba(10,31,18,0.2)] font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[#0a1f12] bg-[rgba(255,255,255,0.2)] transition-colors hover:bg-[rgba(255,255,255,0.4)]">
                        {tool.category}
                      </span>
                      <span className="px-4 py-2 rounded-full border border-[rgba(10,31,18,0.2)] font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[#0a1f12] bg-[rgba(255,255,255,0.2)] transition-colors hover:bg-[rgba(255,255,255,0.4)]">
                        Item 0{i+1}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: LOCATION MAP
   ══════════════════════════════════════════════════ */
function LocationMapSection() {
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
    <section id="location" ref={sectionRef} className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden min-h-[85vh] flex items-center" style={{ backgroundImage: 'linear-gradient(180deg, rgba(2,8,7,0.92) 0%, rgba(10,31,18,0.95) 50%, rgba(2,8,7,0.92) 100%), url("/asset/asset4.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      
      {/* Background decoration: Grid lines */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[rgba(74,222,128,0.08)] dossier-line-h"></div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[rgba(74,222,128,0.08)] dossier-line-h"></div>
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[rgba(74,222,128,0.08)] dossier-line-v"></div>
      <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[rgba(74,222,128,0.08)] dossier-line-v"></div>
      
      {/* Background decoration: Crosshairs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.2)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.2)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.2)] font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-3/4 left-3/4 -translate-x-1/2 -translate-y-1/2 text-[rgba(74,222,128,0.2)] font-mono text-sm pointer-events-none">+</div>

      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-0 relative z-10">
        
        {/* ═══ MAP AREA (Hijau) ═══ */}
        <div className="w-full lg:w-[55%] flex flex-col">
          {/* Section eyebrow */}
          <div className="dossier-reveal flex items-center gap-3 mb-5">
            <span className="block w-10 h-0.5 bg-[#4ade80]"></span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4ade80]">WHERE IS TANGKAHAN</span>
          </div>
          
          {/* Map container */}
          <div className="dossier-reveal relative flex-1 rounded-2xl lg:rounded-r-none overflow-hidden shadow-2xl" style={{ minHeight: '380px', border: '1px solid rgba(74,222,128,0.2)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15924.939221147772!2d98.0573908!3d3.693766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30373809650d03bb%3A0xc669ef0faee2e896!2sTangkahan%20CRU!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', inset: 0, zIndex: 1 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="bg-[#020807]"
            ></iframe>

            {/* Top-left coordinate badge */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg backdrop-blur-md font-mono text-[0.65rem] tracking-wider text-[#4ade80] pointer-events-none" style={{ background: 'rgba(2,8,7,0.7)', border: '1px solid rgba(74,222,128,0.15)' }}>
              3.6938° N, 98.0574° E
            </div>
          </div>
        </div>

        {/* ═══ TEXT BOX + NAVIGATION (Oren + Ungu) ═══ */}
        <div className="w-full lg:w-[45%] flex flex-col">
          {/* Spacer for eyebrow alignment on desktop */}
          <div className="hidden lg:block mb-5" style={{ height: 'calc(0.75rem + 12px)' }}></div>
          
          {/* Glass card */}
          <div className="dossier-reveal flex-1 rounded-2xl lg:rounded-l-none p-8 lg:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(160deg, rgba(10,31,18,0.6) 0%, rgba(2,8,7,0.8) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(74,222,128,0.1)', borderLeft: 'none' }}>
            
            {/* Title */}
            <div>
              <h3 className="font-display italic text-[#e2f0e6] leading-[1.05] mb-4" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', letterSpacing: '-0.02em' }}>
                where is
                <br />
                <span className="text-[#C4B088]">TANGKAHAN</span>
              </h3>
              
              {/* Divider */}
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#4ade80] to-transparent mb-5"></div>
              
              {/* Description text */}
              <p className="font-body text-[0.95rem] text-[#9ca3af] leading-[1.8] text-justify">
                Tangkahan is an ecotourism area in Langkat Regency, North Sumatra. This area, which forms part of Taman Nasional Gunung Leuser, offers a unique and unforgettable tourist experience.
              </p>

              {/* Mini stats */}
              <div className="flex gap-6 mt-6 mb-6">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#4ade80] mb-1">Altitude</p>
                  <p className="font-display italic text-xl text-[#e2f0e6]">200m</p>
                </div>
                <div className="w-px bg-[rgba(74,222,128,0.15)]"></div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#4ade80] mb-1">From Medan</p>
                  <p className="font-display italic text-xl text-[#e2f0e6]">3 hrs</p>
                  <p className="text-[0.65rem] text-[#9ca3af] mt-1">by car or bus</p>
                </div>
                <div className="w-px bg-[rgba(74,222,128,0.15)]"></div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#4ade80] mb-1">Best Season</p>
                  <p className="font-display italic text-xl text-[#e2f0e6]">Jun–Sep</p>
                  <p className="text-[0.65rem] text-[#9ca3af] mt-1">less rain</p>
                </div>
              </div>
            </div>

            {/* ═══ Navigation Button (Ungu) ═══ */}
            <a 
              href="https://maps.google.com/?q=Tangkahan+CRU" 
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-4 w-full px-7 py-5 mt-6 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.12) 0%, rgba(10,31,18,0.5) 100%)', border: '1px solid rgba(74,222,128,0.2)' }}
            >
              {/* Hover fill */}
              <span className="absolute inset-0 bg-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Pin icon */}
              <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-500" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <svg className="w-5 h-5 text-[#4ade80] group-hover:text-[#020807] transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              
              {/* Text */}
              <div className="relative z-10 flex-1">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#4ade80] group-hover:text-[#020807] transition-colors duration-500 mb-0.5">Navigate to</p>
                <p className="font-display text-lg italic text-[#e2f0e6] group-hover:text-[#020807] transition-colors duration-500">Google Maps</p>
              </div>
              
              {/* Arrow */}
              <svg className="relative z-10 w-5 h-5 text-[#4ade80] group-hover:text-[#020807] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   CTA FOOTER
   ══════════════════════════════════════════════════ */

function CTAFooter() {
  var ref = useReveal('.rv');
  return (
    <footer className="relative bg-void px-6 sm:px-10 lg:px-16 overflow-hidden" style={{ paddingTop: 'clamp(5rem,10vw,8rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />

      <div ref={ref} className="rv mx-auto text-center relative z-10" style={{ maxWidth: '800px' }}>
        <h2 className="font-display italic text-[#e2f0e6] leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
          Portal ini
          <br />
          <span className="text-[#4ade80]">tidak menunggu.</span>
        </h2>
        <p className="mt-5 text-[0.85rem] text-[#3d6b4a] max-w-md mx-auto leading-relaxed">
          Gulir kembali ke atas dan rasakan lagi. Atau bawa pengalaman ini ke proyekmu sendiri.
        </p>
        <button type="button" className="btn btn--primary mt-9" onClick={function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span>Kembali ke Portal</span>
          <span className="btn__icon" aria-hidden="true">↑</span>
        </button>
      </div>


    </footer>
  );
}

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



const DEFAULT_IMAGES = [
  { src: '/asset/elephant_hero.png', alt: 'Elephant Hero' },
  { src: '/asset/elephant_camp.png', alt: 'Elephant Camp' },
  { src: '/asset/hot_springs.png', alt: 'Hot Springs' },
  { src: '/asset/bat_cave.png', alt: 'Bat Cave' },
  { src: '/asset/forest_trail.png', alt: 'Forest Trail' },
  { src: '/asset/elephant_hero.png', alt: 'Elephant Hero 2' },
  { src: '/asset/elephant_camp.png', alt: 'Elephant Camp 2' },
  { src: '/asset/hot_springs.png', alt: 'Hot Springs 2' },
  { src: '/asset/bat_cave.png', alt: 'Bat Cave 2' },
  { src: '/asset/forest_trail.png', alt: 'Forest Trail 2' }
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 10
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}


function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#120F17',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const cancelTapRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const pointerTypeRef = useRef('mouse');
  const tapTargetRef = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dg-scroll-lock');
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dg-scroll-lock');
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge');
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let isDown = false;
    let lastX = 0;
    let lastY = 0;
    let timeDown = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e) => {
      if (focusedElRef.current) return;
      stopInertia();
      pointerTypeRef.current = e.pointerType || 'mouse';
      if (pointerTypeRef.current === 'touch') {
          // allow default on touch for scrolling unless we prevent it in move
      }
      draggingRef.current = true;
      cancelTapRef.current = false;
      movedRef.current = false;
      startRotRef.current = { ...rotationRef.current };
      startPosRef.current = { x: e.clientX, y: e.clientY };
      lastX = e.clientX;
      lastY = e.clientY;
      timeDown = performance.now();
      const potential = e.target.closest?.('.item__image');
      tapTargetRef.current = potential || null;
      isDown = true;
    };

    const onPointerMove = (e) => {
      if (!isDown || focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
      if (pointerTypeRef.current === 'touch') e.preventDefault();

      const dxTotal = e.clientX - startPosRef.current.x;
      const dyTotal = e.clientY - startPosRef.current.y;

      if (!movedRef.current) {
        const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
        if (dist2 > 16) movedRef.current = true;
      }

      const nextX = clamp(
        startRotRef.current.x - dyTotal / dragSensitivity,
        -maxVerticalRotationDeg,
        maxVerticalRotationDeg
      );
      const nextY = startRotRef.current.y + dxTotal / dragSensitivity;

      const cur = rotationRef.current;
      if (cur.x !== nextX || cur.y !== nextY) {
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
      }
      
      const now = performance.now();
      const dt = Math.max(1, now - timeDown);
      velX = (e.clientX - lastX) / dt;
      velY = (e.clientY - lastY) / dt;
      lastX = e.clientX;
      lastY = e.clientY;
      timeDown = now;
    };

    const onPointerUp = (e) => {
      if (!isDown) return;
      isDown = false;
      
      draggingRef.current = false;
      let isTap = false;

      if (startPosRef.current) {
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;
        const dist2 = dx * dx + dy * dy;
        const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 10 : 6;
        if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) {
          isTap = true;
        }
      }

      if (!isTap && (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05)) {
        // Adjust velocity for inertia matching useGesture's format
        startInertia(velX * 10, velY * 10); 
      }
      startPosRef.current = null;
      cancelTapRef.current = !isTap;

      if (isTap && tapTargetRef.current && !focusedElRef.current) {
        openItemFromElement(tapTargetRef.current);
      }
      tapTargetRef.current = null;

      if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 120);
      if (movedRef.current) lastDragEndAt.current = performance.now();
      movedRef.current = false;
      if (pointerTypeRef.current === 'touch') unlockScroll();
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [dragSensitivity, maxVerticalRotationDeg, startInertia, unlockScroll, lockScroll]);

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const overlay = viewerRef.current?.querySelector('.enlarge');
      if (!overlay) return;

      const refDiv = parent.querySelector('.item__image--reference');

      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', `0deg`);
        parent.style.setProperty('--rot-x-delta', `0deg`);
        el.style.visibility = '';
        el.style.zIndex = 0;
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();

      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height
      };

      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height
      };

      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `
        position: absolute;
        left: ${overlayRelativeToRoot.left}px;
        top: ${overlayRelativeToRoot.top}px;
        width: ${overlayRelativeToRoot.width}px;
        height: ${overlayRelativeToRoot.height}px;
        z-index: 9999;
        border-radius: ${openedImageBorderRadius};
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        transition: all ${enlargeTransitionMs}ms ease-out;
        pointer-events: none;
        margin: 0;
        transform: none;
        filter: ${grayscale ? 'grayscale(1)' : 'none'};
      `;

      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        animatingOverlay.appendChild(img);
      }

      overlay.remove();
      rootRef.current.appendChild(animatingOverlay);

      void animatingOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
        animatingOverlay.style.opacity = '0';
      });

      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;

        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';

        parent.style.setProperty('--rot-y-delta', `0deg`);
        parent.style.setProperty('--rot-x-delta', `0deg`);

        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = 0;
          focusedElRef.current = null;
          rootRef.current?.removeAttribute('data-enlarging');

          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';

            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute('data-enlarging') !== 'true')
                  document.body.classList.remove('dg-scroll-lock');
              }, 300);
            });
          });
        });
      };

      animatingOverlay.addEventListener('transitionend', cleanup, {
        once: true
      });
    };

    scrim.addEventListener('click', close);
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      scrim.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [enlargeTransitionMs, openedImageBorderRadius, grayscale]);

  const openItemFromElement = el => {
    if (openingRef.current) return;
    openingRef.current = true;
    openStartedAtRef.current = performance.now();
    lockScroll();
    const parent = el.parentElement;
    focusedElRef.current = el;
    el.setAttribute('data-focused', 'true');

    const offsetX = getDataNumber(parent, 'offsetX', 0);
    const offsetY = getDataNumber(parent, 'offsetY', 0);
    const sizeX = getDataNumber(parent, 'sizeX', 2);
    const sizeY = getDataNumber(parent, 'sizeY', 2);

    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY = normalizeAngle(parentRot.rotateY);
    const globalY = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;

    parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

    const refDiv = document.createElement('div');
    refDiv.className = 'item__image item__image--reference opacity-0';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);

    void refDiv.offsetHeight;

    const tileR = refDiv.getBoundingClientRect();
    const mainR = mainRef.current?.getBoundingClientRect();
    const frameR = frameRef.current?.getBoundingClientRect();

    if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
      openingRef.current = false;
      focusedElRef.current = null;
      parent.removeChild(refDiv);
      unlockScroll();
      return;
    }

    originalTilePositionRef.current = {
      left: tileR.left,
      top: tileR.top,
      width: tileR.width,
      height: tileR.height
    };

    el.style.visibility = 'hidden';
    el.style.zIndex = 0;

    const overlay = document.createElement('div');
    overlay.className = 'enlarge';
    overlay.style.position = 'absolute';
    overlay.style.left = frameR.left - mainR.left + 'px';
    overlay.style.top = frameR.top - mainR.top + 'px';
    overlay.style.width = frameR.width + 'px';
    overlay.style.height = frameR.height + 'px';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '30';
    overlay.style.willChange = 'transform, opacity';
    overlay.style.transformOrigin = 'top left';
    overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;
    overlay.style.borderRadius = openedImageBorderRadius;
    overlay.style.overflow = 'hidden';
    overlay.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';

    const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
    const rawAlt = parent.dataset.alt || el.querySelector('img')?.alt || '';
    const img = document.createElement('img');
    img.src = rawSrc;
    img.alt = rawAlt;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.filter = grayscale ? 'grayscale(1)' : 'none';
    overlay.appendChild(img);
    viewerRef.current.appendChild(overlay);

    const tx0 = tileR.left - frameR.left;
    const ty0 = tileR.top - frameR.top;
    const sx0 = tileR.width / frameR.width;
    const sy0 = tileR.height / frameR.height;

    const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
    const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

    overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

    setTimeout(() => {
      if (!overlay.parentElement) return;
      overlay.style.opacity = '1';
      overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
      rootRef.current?.setAttribute('data-enlarging', 'true');
    }, 16);

    const wantsResize = openedImageWidth || openedImageHeight;
    if (wantsResize) {
      const onFirstEnd = ev => {
        if (ev.propertyName !== 'transform') return;
        overlay.removeEventListener('transitionend', onFirstEnd);
        const prevTransition = overlay.style.transition;
        overlay.style.transition = 'none';
        const tempWidth = openedImageWidth || `${frameR.width}px`;
        const tempHeight = openedImageHeight || `${frameR.height}px`;
        overlay.style.width = tempWidth;
        overlay.style.height = tempHeight;
        const newRect = overlay.getBoundingClientRect();
        overlay.style.width = frameR.width + 'px';
        overlay.style.height = frameR.height + 'px';
        void overlay.offsetWidth;
        overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
        const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
        requestAnimationFrame(() => {
          overlay.style.left = `${centeredLeft}px`;
          overlay.style.top = `${centeredTop}px`;
          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
        });
        const cleanupSecond = () => {
          overlay.removeEventListener('transitionend', cleanupSecond);
          overlay.style.transition = prevTransition;
        };
        overlay.addEventListener('transitionend', cleanupSecond, {
          once: true
        });
      };
      overlay.addEventListener('transitionend', onFirstEnd);
    }
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock');
    };
  }, []);

  const cssStyles = `
    .sphere-root {
      --radius: 520px;
      --viewer-pad: 72px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }
    
    .sphere-root * {
      box-sizing: border-box;
    }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }
    
    .stage {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      margin: auto;
      perspective: calc(var(--radius) * 2);
      perspective-origin: 50% 50%;
    }
    
    .sphere {
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: absolute;
    }
    
    .sphere-item {
      width: calc(var(--item-width) * var(--item-size-x));
      height: calc(var(--item-height) * var(--item-size-y));
      position: absolute;
      top: -999px;
      bottom: -999px;
      left: -999px;
      right: -999px;
      margin: auto;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
      transition: transform 300ms;
      transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) 
                 rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) 
                 translateZ(var(--radius));
    }
    
    .sphere-root[data-enlarging="true"] .scrim {
      opacity: 1 !important;
      pointer-events: all !important;
    }
    
    @media (max-aspect-ratio: 1/1) {
      .viewer-frame {
        height: auto !important;
        width: 100% !important;
      }
    }
    
    /* body.dg-scroll-lock {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      touch-action: none !important;
      overscroll-behavior: contain !important;
    } */
    .item__image {
      position: absolute;
      inset: 10px;
      border-radius: var(--tile-radius, 12px);
      overflow: hidden;
      cursor: pointer;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 300ms;
      pointer-events: auto;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .item__image:hover { filter: none !important; }
    .item__image--reference {
      position: absolute;
      inset: 10px;
      pointer-events: none;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={rootRef}
        className="sphere-root relative w-full h-full"
        style={{
          ['--segments-x']: segments,
          ['--segments-y']: segments,
          ['--overlay-blur-color']: overlayBlurColor,
          ['--tile-radius']: imageBorderRadius,
          ['--enlarge-radius']: openedImageBorderRadius,
          ['--image-filter']: grayscale ? 'grayscale(1)' : 'none'
        }}
      >
        <main
          ref={mainRef}
          className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent"
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="sphere-item absolute m-auto"
                  data-src={it.src}
                  data-alt={it.alt}
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={{
                    ['--offset-x']: it.x,
                    ['--offset-y']: it.y,
                    ['--item-size-x']: it.sizeX,
                    ['--item-size-y']: it.sizeY,
                    top: '-999px',
                    bottom: '-999px',
                    left: '-999px',
                    right: '-999px'
                  }}
                >
                  <div
                    className="item__image absolute block overflow-hidden cursor-pointer bg-gray-200 transition-transform duration-300"
                    role="button"
                    tabIndex={0}
                    aria-label={it.alt || 'Open image'}
                    onClick={e => {
                      if (draggingRef.current) return;
                      if (movedRef.current) return;
                      if (performance.now() - lastDragEndAt.current < 80) return;
                      if (openingRef.current) return;
                      openItemFromElement(e.currentTarget);
                    }}
                    onPointerUp={e => {
                      if (e.pointerType !== 'touch') return;
                      if (draggingRef.current) return;
                      if (movedRef.current) return;
                      if (performance.now() - lastDragEndAt.current < 80) return;
                      if (openingRef.current) return;
                      openItemFromElement(e.currentTarget);
                    }}
                    style={{
                      inset: '10px',
                      borderRadius: `var(--tile-radius, ${imageBorderRadius})`,
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <img
                      src={it.src}
                      draggable={false}
                      alt={it.alt}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        backfaceVisibility: 'hidden',
                        filter: `var(--image-filter, ${grayscale ? 'grayscale(1)' : 'none'})`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute inset-0 m-auto z-[3] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`
            }}
          />

          <div
            className="absolute inset-0 m-auto z-[3] pointer-events-none"
            style={{
              WebkitMaskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
              maskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
              backdropFilter: 'blur(3px)'
            }}
          />

          <div
            className="absolute left-0 right-0 top-0 h-[120px] z-[5] pointer-events-none rotate-180"
            style={{
              background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-[120px] z-[5] pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`
            }}
          />

          <div
            ref={viewerRef}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
            style={{ padding: 'var(--viewer-pad)' }}
          >
            <div
              ref={scrimRef}
              className="scrim absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(3px)'
              }}
            />
            <div
              ref={frameRef}
              className="viewer-frame h-full aspect-square flex"
              style={{ borderRadius: `var(--enlarge-radius, ${openedImageBorderRadius})` }}
            />
          </div>
        </main>
      </div>
    </>
  );
}


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
      <DomeGallery 
        images={[
          { src: '/asset/elephant_hero.png', alt: 'Elephant Hero' },
          { src: '/asset/elephant_camp.png', alt: 'Elephant Camp' },
          { src: '/asset/hot_springs.png', alt: 'Hot Springs' },
          { src: '/asset/bat_cave.png', alt: 'Bat Cave' },
          { src: '/asset/forest_trail.png', alt: 'Forest Trail' },
          { src: '/asset/history-before.png', alt: 'History Before' },
          { src: '/asset/history-after.png', alt: 'History After' },
          { src: '/asset/info_1.png', alt: 'Info 1' },
          { src: '/asset/info_2.png', alt: 'Info 2' },
          { src: '/asset/info_3.png', alt: 'Info 3' },
          { src: '/asset/info_4.png', alt: 'Info 4' },
          { src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop', alt: 'Jungle Canopy' },
          { src: 'https://images.unsplash.com/photo-1544252890-a7d1b3127888?q=80&w=800&auto=format&fit=crop', alt: 'Elephant in River' },
          { src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop', alt: 'Rainforest' },
          { src: 'https://images.unsplash.com/photo-1540206395-68808572332f?q=80&w=800&auto=format&fit=crop', alt: 'Misty Mountains' },
          { src: 'https://images.unsplash.com/photo-1589139855580-0433d7d74ccf?q=80&w=800&auto=format&fit=crop', alt: 'Elephant Walking' },
          { src: 'https://images.unsplash.com/photo-1518182170546-076616fdacfb?q=80&w=800&auto=format&fit=crop', alt: 'Lush Greenery' },
          { src: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop', alt: 'Tropical Forest' },
          { src: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop', alt: 'Sumatran Elephant' },
          { src: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop', alt: 'River stream' },
          { src: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&auto=format&fit=crop', alt: 'Deserted jungle path' },
          { src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop', alt: 'River in forest' },
          { src: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?q=80&w=800&auto=format&fit=crop', alt: 'Deep tropical foliage' }
        ]}
        overlayBlurColor="#020807" 
        grayscale={false} 
        fit={0.75}
        minRadius={800}
        maxVerticalRotationDeg={6}
        segments={20}
        dragDampening={2.4}
        dragSensitivity={window.innerWidth < 768 ? 10 : 20}
      />
    </section>
  );
}



const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      
      if (onActiveChange) {
        onActiveChange(rest[0]);
      }
      
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-[10%] lg:right-[15%] transform -translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[10%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[15%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};




/* ══════════════════════════════════════════════════
   SECTION: INFORMATION (CardSwap)
   ══════════════════════════════════════════════════ */
function InformationSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const infoData = [
    { category: "INITIATIVE", title: "Donate Clean Water", desc: "Every family in North Sumatra deserves access to clean drinking water. Support underprivileged families with a water filter to help them save money and improve their health.", color: "#0ea5e9", img: "/asset/info_1.png" },
    { category: "FAQ", title: "Getting to Tangkahan", desc: "Located in North Sumatra, on the border of Leuser National Park. 3 hours from Medan. June-September has less rain, but embrace the rainforest showers!", color: "#4ade80", img: "/asset/info_2.png" },
    { category: "FAQ", title: "Duration & Stay", desc: "We recommend staying 3-5 days. Perfect for meeting locals, bonfire dinners, jungle trekking, and tubing.", color: "#f59e0b", img: "/asset/info_3.png" },
    { category: "FAQ", title: "Elephant Interaction", desc: "The herd is used to human interaction under mahout supervision. You can feed, bathe, and walk with them. Elephant rides are strictly not allowed.", color: "#a855f7", img: "/asset/info_4.png" }
  ];
  
  const activeColor = infoData[activeIndex]?.color || '#4ade80';
  
  // Use a map to handle dynamic stroke styling
  const strokeColorMap = {
    "#0ea5e9": "rgba(14,165,233,0.5)",
    "#4ade80": "rgba(74,222,128,0.5)",
    "#f59e0b": "rgba(245,158,11,0.5)",
    "#a855f7": "rgba(168,85,247,0.5)"
  };

  return (
    <section 
      id="information"
      className="relative w-full h-[800px] md:h-screen overflow-hidden flex items-center bg-[#020807]"
    >
      {/* Dynamic Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        {infoData.map((item, i) => (
          <div 
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-out ${i === activeIndex ? 'opacity-30 scale-105' : 'opacity-0 scale-100'}`}
            style={{ backgroundImage: `url(${item.img})` }}
          />
        ))}
        {/* Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020807] via-[rgba(2,8,7,0.7)] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-transparent to-[rgba(2,8,7,0.4)]"></div>
        
        {/* Dynamic Color Tint */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-color transition-colors duration-[1500ms] ease-in-out"
          style={{ backgroundColor: activeColor }}
        ></div>
      </div>

      {/* Dynamic Radial Gradient */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] md:w-[600px] h-[500px] md:h-[600px] rounded-full opacity-[0.08] transition-colors duration-[1500ms] ease-in-out pointer-events-none" 
        style={{ background: `radial-gradient(circle, ${activeColor}, transparent 70%)` }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center w-full h-full">
        <div className="w-full md:w-1/2 pl-4 sm:pl-10 lg:pl-20 mb-20 md:mb-0 relative z-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-4 transition-colors duration-[1500ms] ease-in-out" style={{ color: activeColor }}>Essential Lore</p>
          <h2 className="font-display italic text-6xl md:text-8xl text-[#e2f0e6] leading-[0.9]">
            Tangkahan<br/>
            <span className="text-transparent transition-colors duration-[1500ms] ease-in-out" style={{ WebkitTextStroke: `1px ${strokeColorMap[activeColor]}` }}>Archives</span>
          </h2>
        </div>
        <div className="w-full md:w-1/2 h-full relative">
          <CardSwap width={400} height={450} delay={4000} onActiveChange={(idx) => setActiveIndex(idx)}>
            {infoData.map((item, i) => (
              <Card key={i} customClass="!bg-[rgba(10,31,18,0.7)] backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-center transition-colors duration-1000" style={{ borderColor: i === activeIndex ? strokeColorMap[activeColor] : 'rgba(74,222,128,0.1)' }}>
                <p className="font-mono text-[0.65rem] tracking-[0.2em] mb-4 uppercase transition-colors duration-1000" style={{ color: item.color }}>{item.category}</p>
                <h3 className="font-display italic text-3xl md:text-4xl text-white mb-6 leading-[1.1]">{item.title}</h3>
                <p className="font-body text-[#c4dccb] leading-relaxed text-sm">{item.desc}</p>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   APP — assembly
   ══════════════════════════════════════════════════ */

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',

  minFontSize = 24
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach(span => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        @import url('${fontUrl}');
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
    );
  }, [fontFamily, fontUrl, textColor, strokeColor, strokeWidth]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent">
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${className} ${
          flex ? 'flex justify-between' : ''
        } ${stroke ? 'stroke' : ''} uppercase text-center`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor
        }}
      >
        {chars.map((char, i) => (
          <span key={i} ref={el => (spansRef.current[i] = el)} data-char={char} className="inline-block">
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;

    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
      ...props
    },
    <span className="inline" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const [direction, setDirection] = useState('forward');

  const containerRef = useRef(null);
  const orderRef = useRef([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const computeOrder = useCallback(
    len => {
      const order = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set, count) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const encryptInstantly = useCallback(() => {
    const emptySet = new Set();
    setRevealedIndices(emptySet);
    setDisplayText(shuffleText(text, emptySet));
    setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerReverse = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    } else {
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices(prevRevealed => {
        if (sequential) {
          if (direction === 'forward') {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(true);
              return prevRevealed;
            }
          }

          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const idxToRemove = orderRef.current[pointerRef.current++];
              const newRevealed = new Set(prevRevealed);
              newRevealed.delete(idxToRemove);
              setDisplayText(shuffleText(text, newRevealed));
              if (newRevealed.size === 0) {
                clearInterval(intervalRef.current);
                setIsAnimating(false);
                setIsDecrypted(false);
              }
              return newRevealed;
            } else {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              return prevRevealed;
            }
          }
        } else {
          if (direction === 'forward') {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setDisplayText(text);
              setIsDecrypted(true);
            }
            return prevRevealed;
          }

          if (direction === 'reverse') {
            let currentSet = prevRevealed;
            if (currentSet.size === 0) {
              currentSet = fillAllIndices();
            }
            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
            const nextSet = removeRandomIndices(currentSet, removeCount);
            setDisplayText(shuffleText(text, nextSet));
            currentIteration++;
            if (nextSet.size === 0 || currentIteration >= maxIterations) {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              setDisplayText(shuffleText(text, new Set()));
              return new Set();
            }
            return nextSet;
          }
        }
        return prevRevealed;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    direction,
    fillAllIndices,
    removeRandomIndices,
    characters,
    useOriginalCharsOnly
  ]);

  const handleClick = () => {
    if (animateOn !== 'click') return;

    if (clickMode === 'once') {
      if (isDecrypted) return;
      setDirection('forward');
      triggerDecrypt();
    }

    if (clickMode === 'toggle') {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection('forward');
        triggerDecrypt();
      }
    }
  };

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;

    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setDirection('forward');
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  useEffect(() => {
    if (animateOn === 'click') {
      encryptInstantly();
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
    setRevealedIndices(new Set());
    setDirection('forward');
  }, [animateOn, text, encryptInstantly]);

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText
        }
      : animateOn === 'click'
        ? {
            onClick: handleClick
          }
        : {};

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>

      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};

function TextPressureBanner() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center bg-void z-20 px-6 sm:px-10 lg:px-16" style={{ height: '500px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <TextPressure
        text="TANGKAHAN"
        flex={true}
        alpha={false}
        stroke={true}
        width={true}
        weight={true}
        italic={true}
        textColor="#EAEAB9"
        strokeColor="#727E58"
        minFontSize={36}
      />
      <div className="mt-8 md:mt-12 font-mono text-sm tracking-[0.2em] text-[#6b9f7a] uppercase text-center max-w-2xl">
        <DecryptedText
          text="where every leaf tells a story of harmony"
          speed={30}
          maxIterations={20}
          animateOn="view"
          revealDirection="center"
          encryptedClassName="text-[#727E58]"
        />
      </div>
    </section>
  );
}

function App() {
  var loadedState = React.useState(false);
  var loaded = loadedState[0];
  var setLoaded = loadedState[1];
  var progressRef = React.useRef(0);

  return (
    <React.Fragment>
      <LoadingScreen progressRef={progressRef} onDone={function () { setLoaded(true); }} />
      <CustomCursor />
      <FloatingOrbs />
      <div className="grain" />
      <Header />
      <DepthSidebar />
      <main>
        <HeroCanvasScrub progressRef={progressRef} />
        <StatsSection />
        <BeyondSection />
        <LocationMapSection />
        <ElephantGallery />

        <HistorySlider />
        <SpotsSection />
        <JungleSecretsSection />
        <StarterPackSection />
        <VisualNovelSection />
        <InformationSection />
        <CanopyAtlasSection />
        <CTAFooter />
      </main>
    </React.Fragment>
  );
}



export default App;
