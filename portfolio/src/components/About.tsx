"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "./SectionHeader";
import { GraduationCap, Code, Shield } from "lucide-react";

export default function About() {
  const containerRef = useScrollReveal({ y: 50, duration: 0.8 });

  return (
    <section id="about" className="section-padding relative">
      <div className="container-custom" ref={containerRef}>
        <SectionHeader title="About Me" subtitle="Get to know me" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 text-muted/90 leading-relaxed text-lg">
            <p>
              I am a passionate <strong className="text-primary">Software Engineering student</strong> at 
              COMSATS University Islamabad, with a strong interest in Web Development and Information Security.
            </p>
            <p>
              My journey in tech started with a curiosity about how things work under the hood. 
              Today, I'm focused on learning full-stack development and building robust, secure applications.
            </p>
            <p>
              Whether it's crafting intuitive GUIs or implementing security protocols, I thrive on 
              solving complex problems and continuously expanding my skill set.
            </p>
          </div>

          {/* Right: Timeline/Cards */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-neon/30 transition-colors duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-neon group-hover:scale-110 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Education</h3>
                  <p className="text-muted">Software Engineering</p>
                  <p className="text-sm text-muted/60 mt-2">COMSATS University Islamabad</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-neon-purple/30 transition-colors duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-neon-purple group-hover:scale-110 transition-transform">
                  <Code size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Development</h3>
                  <p className="text-muted">Full Stack & GUI</p>
                  <p className="text-sm text-muted/60 mt-2">Building modern web apps and desktop tools</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-neon/30 transition-colors duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-neon group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Security</h3>
                  <p className="text-muted">Information Security</p>
                  <p className="text-sm text-muted/60 mt-2">Passionate about secure coding practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
