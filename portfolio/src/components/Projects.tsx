"use client";
import { useStaggerReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "./SectionHeader";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "Blood Bank Management System",
    description: "A comprehensive system to manage blood donations, inventory, and requests efficiently.",
    tech: ["Python", "MySQL", "Tkinter"],
    image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=800&auto=format&fit=crop",
    github: "#",
    demo: "#"
  },
  {
    title: "Typing Master Application",
    description: "A Python GUI application to help users improve their typing speed and accuracy with real-time feedback.",
    tech: ["Python", "Tkinter", "SQLite"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    github: "#",
    demo: "#"
  },
  {
    title: "File Encryption Tool",
    description: "A secure tool for encrypting and decrypting sensitive files using advanced cryptographic algorithms.",
    tech: ["C++", "Cryptography", "File I/O"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    github: "#",
    demo: "#"
  },
  {
    title: "Hardware Shop Management System",
    description: "Inventory and sales management system tailored for hardware retail stores.",
    tech: ["Java", "JavaFX", "MySQL"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    github: "#",
    demo: "#"
  },
  {
    title: "Teacher Assistant System",
    description: "A platform to assist teachers in managing student records, grades, and attendance.",
    tech: ["C#", ".NET", "SQL Server"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    github: "#",
    demo: "#"
  }
];

export default function Projects() {
  const containerRef = useStaggerReveal(".project-card", { y: 50, stagger: 0.1 });

  return (
    <section id="projects" className="section-padding relative">
      <div className="container-custom" ref={containerRef}>
        <SectionHeader title="Featured Projects" subtitle="My recent work" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="project-card group relative rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-neon/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 mix-blend-overlay" />
              </div>

              {/* Content */}
              <div className="p-6 relative z-30">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-neon transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-neon-purple border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <a
                    href={project.github}
                    className="text-muted hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Github size={18} />
                    Code
                  </a>
                  <a
                    href={project.demo}
                    className="text-muted hover:text-neon transition-colors flex items-center gap-2 text-sm font-medium ml-auto"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
