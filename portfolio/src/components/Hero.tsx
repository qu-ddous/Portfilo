"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );

      tl.fromTo(
        ".hero-btn",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.4"
      );

      gsap.to(imageRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="min-h-screen flex items-center relative overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] -z-10" />

      <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 z-10">
          <div className="hero-text inline-block px-4 py-2 rounded-full glass-card border border-white/10 text-sm font-medium text-neon">
            Available for new opportunities
          </div>
          
          <h1 className="hero-text text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Hi, I'm <br />
            <span className="text-gradient-accent">Muhammad Quddous</span>
          </h1>
          
          <h2 className="hero-text text-2xl md:text-3xl text-muted font-medium">
            Software Developer
          </h2>
          
          <p className="hero-text text-lg text-muted/80 max-w-xl leading-relaxed">
            I build exceptional and accessible digital experiences for the web. 
            Passionate about full-stack development, information security, and creating 
            innovative solutions.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#contact"
              className="hero-btn group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-white/5 rounded-full overflow-hidden glass-card hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-neon/50"
            >
              <span className="mr-2">Hire Me</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/cv.pdf"
              target="_blank"
              className="hero-btn group inline-flex items-center justify-center px-8 py-4 font-bold text-primary rounded-full transition-all duration-300 hover:text-neon"
            >
              <Download size={18} className="mr-2 group-hover:-translate-y-1 transition-transform" />
              <span>Download CV</span>
            </a>
          </div>
        </div>

        {/* Right Content - 3D Image */}
        <div className="relative hidden lg:flex justify-center items-center z-10">
          <div ref={imageRef} className="relative w-[400px] h-[500px] glass-card rounded-3xl p-4 border border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/50">
              <Image 
                src="/images/profile-new.png" 
                alt="Muhammad Quddous" 
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
