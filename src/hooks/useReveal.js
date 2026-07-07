import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function useReveal(selector, opts) {
  var options = opts || {};
  var ref = useRef(null);
  useEffect(function () {
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
