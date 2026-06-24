import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Zap,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { GithubIcon, LinkedinIcon } from "../components/BrandIcons";
import { projects } from "../data/projects";

export default function CVProfile() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React.js",
    "Angular",
    "Tailwind CSS",
    "Material UI",
    "Node.js / Express",
    "Firebase",
    "Supabase",
    "Flutter",
    "Riverpod",
    "Electron",
    "SQLite",
    "UI/UX Design",
    "Database & Cloud",
    "Three.js",
    "Recharts",
    "Zustand",
    "Hive",
  ];

  return (
    <section id="cv-profile" className="py-24 lg:py-32 bg-ink-surface relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="CV"
          title="Professional Profile"
          description="A concise, modern overview of my skills, experience, and achievements"
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Profile Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-lime to-teal rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-ink">
                    <img
                      src="/profile.webp"
                      alt="Muhammad Quddous"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  CONTACT
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:m.quddous7271@gmail.com"
                    className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors"
                  >
                    <Mail size={18} className="text-teal" />
                    m.quddous7271@gmail.com
                  </a>
                  <a
                    href="https://wa.me/923092189637"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors"
                  >
                    <MessageCircle size={18} className="text-teal" />
                    +92 309 2189637
                  </a>
                  <div className="flex items-start gap-3 text-ivory-muted">
                    <MapPin size={18} className="text-teal mt-0.5" />
                    <span>Luddan District Vehari, Punjab, Pakistan</span>
                  </div>
                  <a
                    href="https://linkedin.com/in/m-quddous-4850903a4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors"
                  >
                    <LinkedinIcon size={18} className="text-teal" />
                    linkedin.com/in/m-quddous-4850903a4
                  </a>
                  <a
                    href="https://github.com/qu-ddous"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors"
                  >
                    <GithubIcon size={18} className="text-teal" />
                    github.com/qu-ddous
                  </a>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  EDUCATION
                </h3>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-ivory">BS Software Engineering</h4>
                  <p className="text-teal">COMSATS University Islamabad, Vehari Campus</p>
                  <p className="text-ivory-muted">2022 — 2026</p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  SKILLS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-ink border border-ink-line text-ivory-muted text-sm hover:border-lime hover:text-lime transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  LANGUAGES
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-ivory-muted">English</span>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-lime" />
                      ))}
                      <span className="w-2 h-2 rounded-full bg-ink-line" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ivory-muted">Urdu</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-lime" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Name and Title */}
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-ivory">
                  MUHAMMAD <span className="text-lime">QUDDOUS</span>
                </h2>
                <p className="text-xl text-teal tracking-widest uppercase">
                  Software Engineer • AI Driven  Development
                </p>
              </div>

              {/* Profile Summary */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  PROFILE
                </h3>
                <p className="text-ivory-muted leading-relaxed text-lg">
                  Results-driven Software Engineer specializing in AI Driven Full Stack Development with hands-on experience in building scalable web, mobile, and desktop applications using modern technologies including React, Flutter, and Node.js. Skilled in secure system design, real-time data synchronization, and cross-platform development. Proven ability to take projects from concept to deployment with a strong focus on performance, usability, and clean architecture.
                </p>
              </div>

              {/* Experience & Projects */}
              <div className="space-y-6 pl-8 border-l-2 border-ink-line">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  EXPERIENCE & PROJECTS
                </h3>

                {/* Freelance */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-ivory">
                    Freelance / Personal Projects Developer
                  </h4>
                  <ul className="list-disc list-outside ml-4 space-y-1.5 text-ivory-muted">
                    <li>Built multiple real-world applications across web, mobile, and desktop</li>
                    <li>Managed full development lifecycle (design → development → deployment)</li>
                  </ul>
                </div>

                {/* Projects List */}
                <div className="space-y-6">
                  {projects.slice(0, 8).map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                      className="space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h4 className="text-lg font-semibold text-ivory">{project.title}</h4>
                        <span className="text-teal font-medium">({project.techStack.join(", ")})</span>
                      </div>
                      <p className="text-ivory-muted">{project.tagline}</p>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-ivory-muted">
                        {project.highlights.map((highlight, j) => (
                          <li key={j}>{highlight}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-4 pt-4">
                <h3 className="text-2xl font-display font-semibold text-ivory flex items-center gap-2">
                  <span className="w-3 h-3 bg-lime rounded-full" />
                  ACHIEVEMENTS
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-ivory-muted">
                    <CheckCircle2 size={20} className="text-lime mt-0.5 flex-shrink-0" />
                    <span>Shipped {projects.length} production-grade applications across web, mobile & desktop.</span>
                  </li>
                  <li className="flex items-start gap-3 text-ivory-muted">
                    <CheckCircle2 size={20} className="text-lime mt-0.5 flex-shrink-0" />
                    <span>Built and maintained reusable design systems across multiple platforms.</span>
                  </li>
                  <li className="flex items-start gap-3 text-ivory-muted">
                    <CheckCircle2 size={20} className="text-lime mt-0.5 flex-shrink-0" />
                    <span>Comfortable owning a project end-to-end: architecture to deployment.</span>
                  </li>
                  <li className="flex items-start gap-3 text-ivory-muted">
                    <CheckCircle2 size={20} className="text-lime mt-0.5 flex-shrink-0" />
                    <span>Experience with secure systems (encrypted vaults, audit logging, role-based access).</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
