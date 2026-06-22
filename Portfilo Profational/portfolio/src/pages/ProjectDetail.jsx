import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import { getIcon } from "../utils/iconRegistry";
import { GithubIcon } from "../components/BrandIcons";
import { getTechIcon } from "../utils/techIcons";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectVisual from "../components/ProjectVisual";
import { projects, getProjectById } from "../data/projects";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProjectById(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
          <h1 className="font-display text-3xl text-ivory mb-4">
            Project not found
          </h1>
          <p className="text-ivory-muted mb-8">
            This project doesn't exist or may have been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime text-ink font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-ink min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <Link
            to="/#projects"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setTimeout(() => {
                document.querySelector("#projects")?.scrollIntoView();
              }, 100);
            }}
            className="inline-flex items-center gap-2 text-ivory-muted hover:text-lime transition-colors duration-200 mb-10"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow text-teal">{project.category}</span>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-semibold text-ivory text-balance">
              {project.title}
            </h1>
            <p className="mt-4 text-ivory-muted text-lg max-w-2xl">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {project.techStack.map((tech) => {
                const Icon = getIcon(getTechIcon(tech));
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 text-sm font-mono text-teal px-3 py-1.5 rounded-full bg-ink-surface border border-ink-line"
                  >
                    <Icon size={14} className="opacity-80" />
                    {tech}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime text-ink font-medium hover:shadow-lime-glow transition-all duration-300"
                >
                  Live Demo
                  <ExternalLink size={16} />
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink-line text-ivory hover:border-teal hover:text-teal transition-all duration-300"
                >
                  <GithubIcon size={16} />
                  View Code
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="aspect-[16/9] rounded-2xl bg-ink-surface border border-ink-line mt-12 overflow-hidden flex items-center justify-center"
          >
            <ProjectVisual
              project={project}
              imageClassName="w-full h-full object-cover"
            />
          </motion.div>

          {project.gallery && project.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <h2 className="eyebrow text-ivory-faint mb-4">More Screenshots</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((src, idx) => (
                  <div
                    key={idx}
                    className="aspect-[16/10] rounded-xl bg-ink-surface border border-ink-line overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-10 mt-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="eyebrow text-lime mb-3">The Problem</h2>
              <p className="text-ivory-muted leading-relaxed">
                {project.problem}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="eyebrow text-teal mb-3">The Solution</h2>
              <p className="text-ivory-muted leading-relaxed">
                {project.solution}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14"
          >
            <h2 className="eyebrow text-ivory-faint mb-4">Key Highlights</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 text-ivory-muted text-sm leading-relaxed p-4 rounded-xl bg-ink-surface border border-ink-line"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lime mt-1.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="seam my-16" />

          <Link
            to={`/project/${nextProject.id}`}
            className="group flex items-center justify-between p-7 rounded-2xl bg-ink-surface border border-ink-line hover:border-lime/50 transition-colors duration-300"
          >
            <div>
              <span className="eyebrow text-ivory-faint">Next Project</span>
              <h3 className="mt-1 font-display text-xl text-ivory group-hover:text-lime transition-colors duration-300">
                {nextProject.title}
              </h3>
            </div>
            <ArrowRight
              size={22}
              className="text-ivory-muted group-hover:text-lime group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
