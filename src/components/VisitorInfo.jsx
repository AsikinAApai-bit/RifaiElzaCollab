import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, forwardRef, Children, cloneElement, isValidElement } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CardSwap, Card } from './CardSwap';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   SECTION: INFORMATION (CardSwap)
   ══════════════════════════════════════════════════ */
function VisitorInfo() {
  const infoData = [
    { category: "INITIATIVE", title: "Donate Clean Water", desc: "Every family in North Sumatra deserves access to clean drinking water. Support underprivileged families with a water filter to help them save money and improve their health." },
    { category: "FAQ", title: "Getting to Tangkahan", desc: "Located in North Sumatra, on the border of Leuser National Park. 3 hours from Medan. June-September has less rain, but embrace the rainforest showers!" },
    { category: "FAQ", title: "Duration & Stay", desc: "We recommend staying 3-5 days. Perfect for meeting locals, bonfire dinners, jungle trekking, and tubing." },
    { category: "FAQ", title: "Elephant Interaction", desc: "The herd is used to human interaction under mahout supervision. You can feed, bathe, and walk with them. Elephant rides are strictly not allowed." }
  ];

  return (
    <section className="relative w-full h-[800px] md:h-screen bg-[#020807] overflow-hidden flex items-center">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }}></div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center w-full h-full">
        <div className="w-full md:w-1/2 pl-4 sm:pl-10 lg:pl-20 mb-20 md:mb-0 relative z-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#4ade80] mb-4">Essential Lore</p>
          <h2 className="font-display italic text-6xl md:text-8xl text-[#e2f0e6] leading-[0.9]">
            Tangkahan<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(74,222,128,0.5)' }}>Archives</span>
          </h2>
        </div>
        <div className="w-full md:w-1/2 h-full relative">
          <CardSwap width={400} height={450} delay={4000}>
            {infoData.map((item, i) => (
              <Card key={i} customClass="!bg-[rgba(10,31,18,0.7)] backdrop-blur-2xl border !border-[rgba(74,222,128,0.15)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-center">
                <p className="font-mono text-[0.65rem] text-[#4ade80] tracking-[0.2em] mb-4 uppercase">{item.category}</p>
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


export default VisitorInfo;
