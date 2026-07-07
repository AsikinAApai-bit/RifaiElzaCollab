import React from 'react';
import useReveal from '../hooks/useReveal';

var TECHNIQUES = [
  {
    phase: '01',
    title: 'Portal Terbuka',
    desc: 'Gambar statis hutan dengan lubang putih di-scale hingga 80× — lubang menelan seluruh viewport. Power4.in membuat percepatan dramatis.',
    accent: '#4ade80',
  },
  {
    phase: '02',
    title: 'Flashbang Reveal',
    desc: 'Pada momen tepat lubang putih memenuhi layar, opacity di-snap ke 0 — mengekspos canvas di bawahnya dalam satu kedipan mata.',
    accent: '#f59e0b',
  },
  {
    phase: '03',
    title: 'River Scrub',
    desc: '240 frame WebP di-preload sebagai Image objects. GSAP onUpdate menggambar frame sesuai posisi scroll — kamu adalah pengontrol waktu.',
    accent: '#fb7185',
  },
];

function TechniqueSection() {
  var ref = useReveal('.rv', { stagger: 0.1 });
  return (
    <section id="rimba" className="relative px-6 sm:px-10 lg:px-16 border-t border-[rgba(74,222,128,0.05)]" style={{ paddingTop: 'clamp(5rem,10vw,9rem)', paddingBottom: 'clamp(5rem,10vw,9rem)', background: 'linear-gradient(180deg, #0a1f12 0%, #020807 100%)' }}>
      <div ref={ref} className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="rv mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow mb-4">
              <span className="eyebrow__line" />
              <span className="eyebrow__text">Tiga Fase</span>
            </div>
            <h2 className="font-display italic text-[#e2f0e6] leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
              Anatomi
              <br className="hidden sm:block" />
              <span className="text-[#4ade80]"> Efek Portal</span>
            </h2>
          </div>
          <p className="max-w-xs text-[0.8rem] text-[#3d6b4a] leading-relaxed">
            Setiap transisi didesain tanpa generic boilerplate. Sepenuhnya custom, sepenuhnya sinematik.
          </p>
        </div>

        <div className="space-y-0">
          {TECHNIQUES.map(function (t, i) {
            return (
              <div key={t.phase} className="rv flex gap-5 sm:gap-8 pb-10 last:pb-0">
                <div className="flex flex-col items-center pt-1.5 shrink-0">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ background: t.accent, boxShadow: '0 0 12px ' + t.accent + '99' }} />
                  {i < TECHNIQUES.length - 1 && <span className="mt-2 w-px flex-1" style={{ background: 'linear-gradient(to bottom, ' + t.accent + '33, transparent)' }} />}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: t.accent + 'cc' }}>
                      Phase {t.phase}
                    </p>
                  </div>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl italic text-[#e2f0e6]">{t.title}</h3>
                  <p className="mt-2 max-w-xl text-[0.85rem] text-[#6b9f7a] leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechniqueSection;
