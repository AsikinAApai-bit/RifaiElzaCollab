import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: VISUAL NOVEL — Mahout's Story
   ══════════════════════════════════════════════════ */
function VisualNovelSection() {
  var VN_NODES = {
    start: {
      id: 'start',
      text: "Hutan ini dulu menangis karena keserakahan kami...",
      mood: "dark",
      choices: [
        { label: "Mengapa kalian berhenti?", nextId: "alasan_berhenti" },
        { label: "Apakah kalian tidak menyesal?", nextId: "penyesalan" }
      ]
    },
    alasan_berhenti: {
      id: 'alasan_berhenti',
      text: "Karena sembilan raksasa yang terluka datang dari Aceh. Kami melihat pantulan dosa kami di mata mereka.",
      mood: "hope",
      choices: [
        { label: "Lalu apa yang terjadi?", nextId: "ending_pelindung" }
      ]
    },
    penyesalan: {
      id: 'penyesalan',
      text: "Sangat menyesal. Sungai mengering dan desa kami memanas. Kami hampir kehilangan segalanya hingga gajah-gajah itu tiba.",
      mood: "sad",
      choices: [
        { label: "Bagaimana sekarang?", nextId: "ending_pelindung" }
      ]
    },
    ending_pelindung: {
      id: 'ending_pelindung',
      text: "Kini kami meletakkan gergaji dan memegang tongkat. Kami adalah pelindung mereka.",
      mood: "resolute",
      choices: [
        { label: "Selesai (Tutup Memori)", nextId: "end" }
      ]
    }
  };

  var state = React.useState('start');
  var currentNodeId = state[0];
  var setCurrentNodeId = state[1];
  
  var transState = React.useState(false);
  var isTransitioning = transState[0];
  var setIsTransitioning = transState[1];
  
  var node = VN_NODES[currentNodeId];
  
  var sectionRef = React.useRef(null);
  var boxRef = React.useRef(null);
  var textRef = React.useRef(null);
  var choicesContainerRef = React.useRef(null);
  var choiceRefs = React.useRef([]);
  
  var bgRef = React.useRef(null);
  var mahoutRef = React.useRef(null);

  choiceRefs.current = [];
  function addToChoiceRefs(el) {
    if (el && !choiceRefs.current.includes(el)) {
      choiceRefs.current.push(el);
    }
  }

  React.useEffect(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var floatTween = gsap.to(boxRef.current, { y: -15, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return function() { floatTween.kill(); };
  }, []);

  React.useEffect(function() {
    if (!node || currentNodeId === 'end') return;
    
    gsap.fromTo(textRef.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
    
    if (choiceRefs.current.length > 0) {
      gsap.fromTo(choiceRefs.current, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.4 }
      );
    }
    
    var filterStr = 'contrast(1.2) brightness(0.8)';
    var bgScale = 1;
    var mahoutScale = 1;
    var mahoutX = 0;
    
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
    }
    
    gsap.to(mahoutRef.current, { filter: filterStr, scale: mahoutScale, x: mahoutX, duration: 1.5, ease: 'power2.inOut' });
    gsap.to(bgRef.current, { scale: bgScale, duration: 2, ease: 'sine.inOut' });
    
  }, [currentNodeId]);

  function handleChoice(nextId) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    var tl = gsap.timeline({
      onComplete: function() {
        if (nextId === 'end') {
          gsap.to(boxRef.current, { opacity: 0, y: 40, duration: 1, ease: 'power3.inOut' });
          setCurrentNodeId('end');
        } else {
          setCurrentNodeId(nextId);
        }
        setIsTransitioning(false);
      }
    });
    
    if (choiceRefs.current.length > 0) {
      tl.to(choiceRefs.current, { opacity: 0, x: 20, stagger: -0.05, duration: 0.3, ease: 'power2.in' }, 0);
    }
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0.1);
  }

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#020807] flex items-center justify-center sm:justify-end px-4 sm:px-16" id="vn-branching">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img ref={bgRef} src="/asset/vn_bg.png" alt="Forest Background" className="absolute top-[-5%] left-[-5%] w-[110%] h-[110%] object-cover opacity-30 transform-gpu" />
      </div>
      
      <div className="absolute inset-0 z-10 flex items-end justify-start pointer-events-none">
        <img ref={mahoutRef} src="/asset/vn_mahout.png" alt="Mahout Silhouette" className="w-[120vw] sm:w-[65vw] max-w-4xl object-contain opacity-60 origin-bottom mix-blend-screen transform-gpu" style={{ filter: 'contrast(1.2) brightness(0.8)' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#020807] via-transparent to-[#020807]/50 opacity-90 z-20 pointer-events-none" />

      <div className="relative z-30 w-full max-w-2xl pt-20 pointer-events-none">
        <div ref={boxRef} className="w-full backdrop-blur-2xl bg-[rgba(10,31,18,0.4)] border border-[rgba(74,222,128,0.2)] rounded-[2rem] p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(74,222,128,0.05)] relative pointer-events-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,222,128,0.08)] to-transparent rounded-[2rem] pointer-events-none" />
          
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#f59e0b] mb-6 flex items-center gap-3 opacity-80">
            <span className="w-8 h-px bg-[#f59e0b] block" />
            Jejak Raksasa di Tangkahan
          </div>
          
          {currentNodeId !== 'end' && node && (
            <div className="relative min-h-[260px] flex flex-col justify-between">
              <p ref={textRef} className="font-display italic text-xl sm:text-2xl lg:text-3xl leading-[1.6] text-[#e2f0e6] opacity-0">
                {node.text}
              </p>

              <div ref={choicesContainerRef} className="mt-8 flex flex-col gap-3">
                {node.choices.map(function(choice, idx) {
                  return (
                    <button
                      key={idx}
                      ref={addToChoiceRefs}
                      onClick={function() { handleChoice(choice.nextId); }}
                      className="group relative overflow-hidden flex items-center justify-between w-full text-left px-6 py-4 rounded-2xl backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] transition-all duration-500 hover:bg-[rgba(74,222,128,0.1)] hover:border-[rgba(74,222,128,0.3)] hover:shadow-[0_0_20px_rgba(74,222,128,0.15)] opacity-0 cursor-pointer"
                    >
                      <span className="relative z-10 font-body text-[0.85rem] font-medium tracking-wide text-[#c4dccb] group-hover:text-[#4ade80] transition-colors duration-300">
                        {choice.label}
                      </span>
                      <span className="relative z-10 font-mono text-[0.8rem] text-[#4ade80] opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        →
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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

  function onMouseEnter(e, i) {
    if (window.matchMedia('(hover: none)').matches) return;
    var card = cardsRef.current[i];
    if(!card) return;
    var img = card.querySelector('.tool-img');
    var txtWrap = card.querySelector('.text-wrap');
    
    gsap.to(img, { clipPath: 'circle(150% at 50% 50%)', duration: 0.8, ease: 'power3.out' });
    gsap.to(txtWrap, { y: -10, duration: 0.5, ease: 'power2.out' });
    gsap.to(txtWrap.querySelectorAll('.dynamic-text'), { color: '#020807', duration: 0.5, ease: 'power2.out' });
  }

  function onMouseLeave(e, i) {
    if (window.matchMedia('(hover: none)').matches) return;
    var card = cardsRef.current[i];
    if(!card) return;
    var img = card.querySelector('.tool-img');
    var txtWrap = card.querySelector('.text-wrap');

    gsap.to(img, { clipPath: 'circle(0% at 50% 50%)', duration: 0.6, ease: 'power2.inOut' });
    gsap.to(txtWrap, { y: 0, duration: 0.5, ease: 'power2.inOut' });
    gsap.to(txtWrap.querySelector('.cat-text'), { color: '#4ade80', duration: 0.5, ease: 'power2.inOut' });
    gsap.to(txtWrap.querySelector('.title-text'), { color: '#e2f0e6', duration: 0.5, ease: 'power2.inOut' });
    gsap.to(txtWrap.querySelector('.num-text'), { color: 'rgba(255,255,255,0.2)', duration: 0.5, ease: 'power2.inOut' });
  }

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
                className={"relative w-full sm:w-[45%] lg:w-[28%] aspect-[4/5] rounded-3xl overflow-hidden cursor-crosshair group " + tool.class}
                onMouseEnter={function(e) { onMouseEnter(e, i); }}
                onMouseLeave={function(e) { onMouseLeave(e, i); }}
                style={{
                  background: 'rgba(2,8,7,0.4)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(74,222,128,0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  opacity: 0, // for scroll reveal
                }}
              >
                {/* Background Pattern / Noise */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none" />

                {/* Absolute Image (Hidden by clip-path initially) */}
                <img 
                  src={tool.img} 
                  alt={tool.name} 
                  className="tool-img absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ clipPath: 'circle(0% at 50% 50%)' }}
                />

                {/* Floating Content over the card */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 text-wrap pointer-events-none">
                  <div className="flex justify-between items-start w-full">
                    <span className="cat-text dynamic-text font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#4ade80] transition-colors duration-500">
                      {tool.category}
                    </span>
                    <span className="num-text dynamic-text font-mono text-[0.55rem] text-[rgba(255,255,255,0.2)] transition-colors duration-500">
                      0{i+1}
                    </span>
                  </div>
                  
                  <h3 className="title-text dynamic-text font-display italic text-[#e2f0e6] text-3xl sm:text-4xl leading-none transition-colors duration-500">
                    {tool.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


export default VisualNovelSection;
