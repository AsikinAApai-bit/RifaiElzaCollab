import React from 'react';
import { ScrollStack, ScrollStackItem } from './ScrollStack';

function Biodiversity() {
  var SECRETS = [
    { id: 'sec-1', name: 'Prologue', img: '/asset/TheStoryofTangkahan1.jpeg', subtitle: '', desc: "For decades, Tangkahan faced severe threats from rampant illegal logging. They live depended entirely on exploiting the forest." },
    { id: 'sec-2', name: 'The Turning Point:', img: '/asset/TheStoryofTangkahan2.jpeg', subtitle: '', desc: "Realizing the destruction, the local community took a bold step. In 2001, they formed the Tangkahan Tourism Institute (LPT) and officially banned illegal logging. They chose a sustainable path, transforming their village into an eco-tourism destination." },
    { id: 'sec-3', name: 'After That...', img: '/asset/TheStoryofTangkahan3.jpeg', subtitle: '', desc: "To safeguard the area, the community welcomed a team of trained captive elephants and their mahouts (elephant handlers). Together, they established the legendary Tangkahan Elephant Patrol, actively scouting the jungle to deter illegal loggers, protect the wildlife." },
    { id: 'sec-4', name: 'Now Its Up to Us:', img: '/asset/TheStoryofTangkahan4.jpeg', subtitle: '', desc: "This story isn't over yet. Now, it's up to us to protect this land together. The local community works tirelessly to preserve this environment, but they cannot do it alone. As a visitor, your help is crucial. By respecting nature and leaving no trace, you become a vital partner in keeping this place alive for the future." }
  ];

  return (
    <section id="jungle-secrets" className="relative w-full bg-gradient-to-b from-[#020807] to-[#0a1f12] py-24 border-t border-[rgba(74,222,128,0.05)] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/asset/BACKGROUNDJungleSecretsSection.webp" alt="Jungle Secrets Background" className="w-full h-full object-cover opacity-70" />
      </div>
      
      {/* Title */}
      <div className="text-center mb-12 lg:mb-24 px-4 relative z-20">

        <h2 className="font-display italic text-[#e2f0e6] leading-[0.9]" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.02em' }}>
          The Story of
          <br />
          <span className="text-tangkahan-gold">Tangkahan</span>
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
                    <h3 className="font-display italic text-4xl md:text-5xl text-[#c8b07a] mb-4">
                      {secret.name}
                    </h3>
                    <p className="font-body text-sm md:text-base text-[#c4dccb] leading-relaxed opacity-90 text-justify">
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

export default Biodiversity;
