"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "./SectionHeader";
import { Mail, Github, Linkedin, Send } from "lucide-react";

export default function Contact() {
  const containerRef = useScrollReveal({ y: 50, duration: 0.8 });

  return (
    <section id="contact" className="section-padding relative">
      <div className="container-custom" ref={containerRef}>
        <SectionHeader title="Get In Touch" subtitle="Let's work together" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-primary mb-6">
              Let's talk about your next project
            </h3>
            <p className="text-muted text-lg leading-relaxed mb-8">
              I'm currently available for freelance work and full-time opportunities. 
              If you have a project that needs some creative touch, I'd love to hear about it.
            </p>

            <div className="space-y-6">
              <a
                href="mailto:hello@muhammadquddous.dev"
                className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5 hover:border-neon/50 transition-all duration-300 group"
              >
                <div className="p-4 rounded-xl bg-white/5 text-neon group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Email Me</p>
                  <p className="text-lg font-medium text-primary">hello@muhammadquddous.dev</p>
                </div>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5 hover:border-white/50 transition-all duration-300 group"
              >
                <div className="p-4 rounded-xl bg-white/5 text-white group-hover:scale-110 transition-transform">
                  <Github size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">GitHub</p>
                  <p className="text-lg font-medium text-primary">github.com/muhammadquddous</p>
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5 hover:border-[#0A66C2]/50 transition-all duration-300 group"
              >
                <div className="p-4 rounded-xl bg-white/5 text-[#0A66C2] group-hover:scale-110 transition-transform">
                  <Linkedin size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">LinkedIn</p>
                  <p className="text-lg font-medium text-primary">linkedin.com/in/muhammadquddous</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] -z-10" />
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-muted ml-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted ml-1">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-muted ml-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted ml-1">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-neon to-neon-purple rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                <span className="mr-2">Send Message</span>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
