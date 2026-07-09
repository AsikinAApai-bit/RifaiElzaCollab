import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DomeGallery from './DomeGallery';
gsap.registerPlugin(ScrollTrigger);

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
      />
    </section>
  );
}



export default CanopyAtlasSection;
