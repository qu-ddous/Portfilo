const fs = require('fs');
const path = require('path');

const componentsDir = 'c:/university/Portfilo/portfolio/src/components';

const files = {
  'Navbar.tsx': `"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${
        scrolled ? "glass-nav py-4" : "bg-transparent py-6"
      }\`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          MQ.
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="#contact"
            className="px-4 py-2 text-sm font-medium bg-primary text-background rounded-md hover:bg-gray-200 transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
}
`,
  'Hero.tsx': `"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { personalInfo } from "@/lib/data";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-element",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32" ref={heroRef}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="hero-element inline-block py-1 px-3 rounded-full bg-card border border-card-border text-xs font-medium text-muted mb-6">
              Available for new opportunities
            </span>
            <h1 className="hero-element text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Building digital <br />
              <span className="text-gradient">experiences.</span>
            </h1>
            <p className="hero-element text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
              {personalInfo.heroDescription}
            </p>
            <div className="hero-element flex flex-wrap gap-4">
              <Link
                href="#projects"
                className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                View Projects
              </Link>
              <Link
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-card border border-card-border text-primary font-medium rounded-md hover:border-gray-600 transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end hero-element">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-card-border bg-card">
              <Image
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'About.tsx': `"use client";

import { useEffect, useRef } from "react";
import { personalInfo } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-element",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section-padding bg-card/30 border-y border-card-border" ref={sectionRef}>
      <div className="container-custom max-w-4xl mx-auto text-center">
        <h2 className="about-element text-3xl md:text-4xl font-bold tracking-tight mb-8">
          About Me
        </h2>
        <p className="about-element text-lg text-muted leading-relaxed mb-10">
          {personalInfo.bio}
        </p>
        <div className="about-element grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">Web Development</h3>
            <p className="text-sm text-muted">Building responsive and performant web applications using modern frameworks.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">Python & Data</h3>
            <p className="text-sm text-muted">Creating robust backend systems, automation scripts, and data processing tools.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">Info Security</h3>
            <p className="text-sm text-muted">Implementing secure practices and understanding cryptographic principles.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'Skills.tsx': `"use client";

import { useEffect, useRef } from "react";
import { skillCategories } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="section-padding" ref={sectionRef}>
      <div className="container-custom">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Technical Skills</h2>
          <p className="text-muted max-w-2xl">Technologies and tools I work with to build solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="skill-card card p-6 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-6 text-primary border-b border-card-border pb-4">
                {category.category}
              </h3>
              <ul className="space-y-4 flex-grow">
                {category.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center justify-between">
                    <span className="text-sm text-muted">{skill.name}</span>
                    <span className="text-xs font-medium text-primary bg-card-border px-2 py-1 rounded">
                      {skill.level}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'Projects.tsx': `"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="section-padding bg-card/30 border-y border-card-border" ref={sectionRef}>
      <div className="container-custom">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Featured Projects</h2>
          <p className="text-muted max-w-2xl">A selection of my recent work and technical achievements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => p.featured).map((project) => (
            <div key={project.id} className="project-card card overflow-hidden flex flex-col">
              <div className="relative h-48 w-full bg-card-border">
                {/* Fallback if image fails or is missing */}
                <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
                  Project Image
                </div>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
                <p className="text-sm text-muted mb-6 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, idx) => (
                    <span key={idx} className="text-xs font-medium px-2 py-1 bg-card-border text-muted rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-card-border">
                  <Link href={project.github} className="text-sm font-medium text-primary hover:text-accent transition-colors">
                    GitHub
                  </Link>
                  <Link href={project.demo} className="text-sm font-medium text-primary hover:text-accent transition-colors">
                    Live Demo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'Achievements.tsx': `"use client";

import { useEffect, useRef } from "react";
import { achievements } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".achievement-card",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" className="section-padding" ref={sectionRef}>
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <div key={idx} className="achievement-card card p-8 text-center flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-4">{item.number}</span>
              <h3 className="text-lg font-medium text-primary mb-2">{item.label}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'Contact.tsx': `"use client";

import { useEffect, useRef } from "react";
import { personalInfo } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-element",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section-padding bg-card/30 border-t border-card-border" ref={sectionRef}>
      <div className="container-custom max-w-3xl mx-auto text-center">
        <h2 className="contact-element text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Let's work together
        </h2>
        <p className="contact-element text-lg text-muted mb-10">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="contact-element card p-8 text-left">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-primary">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-background border border-card-border rounded-md px-4 py-3 text-primary focus:outline-none focus:border-muted transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-background border border-card-border rounded-md px-4 py-3 text-primary focus:outline-none focus:border-muted transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-primary">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full bg-background border border-card-border rounded-md px-4 py-3 text-primary focus:outline-none focus:border-muted transition-colors resize-none"
                placeholder="How can I help you?"
              ></textarea>
            </div>
            <button 
              type="button"
              className="w-full bg-primary text-background font-medium py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="contact-element mt-12 flex items-center justify-center gap-6">
          <a href={\`mailto:\${personalInfo.email}\`} className="text-muted hover:text-primary transition-colors">
            Email
          </a>
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
            GitHub
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
`,
  'Footer.tsx': `import Link from "next/link";
import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-card-border bg-background">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-primary">
            MQ.
          </Link>
        </div>
      </div>
    </footer>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components updated successfully.');
