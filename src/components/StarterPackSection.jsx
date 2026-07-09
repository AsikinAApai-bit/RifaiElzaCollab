import React from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

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
    <section className="relative px-6 sm:px-10 lg:px-16 overflow-hidden py-16 md:py-40" style={{ background: '#0a1f12' }}>
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

export default StarterPackSection;
