"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollReveal(options: any = {}) {
  const ref = useRef<any>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: options.y ?? 50,
          x: options.x ?? 0,
          scale: options.scale ?? 1,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: options.duration ?? 0.8,
          delay: options.delay ?? 0,
          ease: options.ease ?? "power3.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [options]);

  return ref;
}

export function useStaggerReveal(selector: string, options: any = {}) {
  const ref = useRef<any>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        {
          opacity: 0,
          y: options.y ?? 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.8,
          stagger: options.stagger ?? 0.1,
          ease: options.ease ?? "power3.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [selector, options]);

  return ref;
}
