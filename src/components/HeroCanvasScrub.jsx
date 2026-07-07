import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
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

  // Preload Logic (WebP frames)
  useEffect(() => {
    let loadedCount = 0;
    const tempImages = [];
    const totalFrames = 240;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/asset/frames/frame-${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        if (props.progressRef) {
          props.progressRef.current = (loadedCount / totalFrames) * 100;
        }
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
        
        // Draw first frame immediately
        if (i === 1) {
          requestAnimationFrame(() => {
            renderFrame(img);
          });
        }
      };
      tempImages.push(img);
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
        end: '+=300%', // Dipersingkat agar tidak capek scroll
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
        if (images[frameIndex]) {
          renderFrame(images[frameIndex]);
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
        src="/asset/cover.jpeg"
        alt="Portal Cover"
        className="absolute inset-0 w-full h-full object-cover origin-center"
        style={{ zIndex: 10 }}
      />
      
      {/* Dark gradient overlay blending into StatsSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020807]" style={{ zIndex: 15 }} />

      {/* Layer 3 (Typography) */}
      <div ref={textRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        <h1 className="font-display font-bold text-white leading-none absolute" style={{ top: '35%', left: '10%', fontSize: 'clamp(4rem, 9vw, 9rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          Beyond
        </h1>
        <h1 className="font-display font-bold leading-none absolute" style={{ top: '55%', right: '28%', color: '#00441B', fontSize: 'clamp(2rem, 5vw, 5rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          The
        </h1>
        <h1 className="font-display font-bold leading-none absolute" style={{ top: '64%', right: '12%', color: '#006D2C', fontSize: 'clamp(4rem, 9vw, 9rem)', textShadow: '0 4px 60px rgba(0,0,0,0.8)' }}>
          Green
        </h1>
      </div>

      {/* Layer 4 (Scroll Instruction) */}
      <div ref={scrollInstRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none" style={{ zIndex: 30 }}>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70">Scroll To Explore</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}



export default HeroCanvasScrub;
