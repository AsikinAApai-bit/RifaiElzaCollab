import React from 'react';
import { ScrollStack, ScrollStackItem } from './ScrollStack';

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
                  <img src={secret.img} alt={secret.name} className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal" />
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

export default JungleSecretsSection;
