import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getIcon } from "../utils/iconRegistry";
import { GithubIcon } from "../components/BrandIcons";
import { getTechIcon } from "../utils/techIcons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectVisual from "../components/ProjectVisual";
import { projects, getProjectById } from "../data/projects";

function ProjectLightbox({
  isOpen,
  images,
  initialIndex,
  projectTitle,
  onClose,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setActiveIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious, isOpen, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <div className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:right-6 sm:top-6"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:left-6 sm:h-12 sm:w-12"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:right-6 sm:h-12 sm:w-12"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex max-h-full w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-5"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;

                const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
                const delta = touchStartX.current - touchEndX;
                touchStartX.current = null;

                if (Math.abs(delta) < 40 || images.length < 2) return;
                if (delta > 0) goToNext();
                if (delta < 0) goToPrevious();
              }}
            >
              <img
                src={currentImage}
                alt={`${projectTitle} screenshot ${activeIndex + 1}`}
                className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
              />
            </motion.div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
              <span className="font-medium">{projectTitle}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProjectById(id);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const galleryImages = useMemo(() => {
    if (!project) return [];

    return project.gallery?.length ? project.gallery : project.image ? [project.image] : [];
  }, [project]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setIsLightboxOpen(false);
    setLightboxIndex(0);
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
            className="mt-12 flex items-center justify-center rounded-2xl border border-ink-line bg-ink-surface p-4 sm:p-6"
          >
            {galleryImages.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(0);
                  setIsLightboxOpen(true);
                }}
                className="group flex w-full cursor-zoom-in items-center justify-center rounded-xl"
                aria-label={`Open ${project.title} preview`}
              >
                <img
                  src={galleryImages[0]}
                  alt={project.title}
                  className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain transition duration-300 group-hover:scale-[1.01]"
                />
              </button>
            ) : (
              <div className="flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl">
                <ProjectVisual
                  project={project}
                  imageClassName="max-h-[78vh] w-auto max-w-full object-contain"
                  fallbackClassName="min-h-[320px] w-full"
                />
              </div>
            )}
          </motion.div>

          {galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="eyebrow text-ivory-faint">More Screenshots</h2>
                {galleryImages.length > 1 && (
                  <span className="text-xs uppercase tracking-[0.22em] text-ivory-faint">
                    Tap to preview
                  </span>
                )}
              </div>

              <div className="project-gallery">
                {galleryImages.map((src, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                    className="project-gallery-item group block w-full overflow-hidden rounded-2xl border border-ink-line bg-ink-surface p-3 text-left transition duration-300 hover:border-lime/40 hover:bg-ink-raised"
                    aria-label={`Open screenshot ${idx + 1} for ${project.title}`}
                  >
                    <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl bg-black/20">
                      <img
                        src={src}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="h-auto max-h-[32rem] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </button>
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
      <ProjectLightbox
        isOpen={isLightboxOpen}
        images={galleryImages}
        initialIndex={lightboxIndex}
        projectTitle={project.title}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
