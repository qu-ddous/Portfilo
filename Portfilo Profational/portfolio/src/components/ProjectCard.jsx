import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getIcon } from "../utils/iconRegistry";
import { getTechIcon } from "../utils/techIcons";
import ProjectVisual from "./ProjectVisual";

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    >
      <Link
        to={`/project/${project.id}`}
        className="group block rounded-2xl bg-ink-surface border border-ink-line overflow-hidden hover:border-lime/50 transition-colors duration-300 h-full"
      >
        <div className="aspect-[16/10] bg-ink-raised relative overflow-hidden">
          <ProjectVisual
            project={project}
            imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallbackClassName="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight size={18} className="text-lime" />
          </div>
        </div>

        <div className="p-6">
          <span className="eyebrow text-teal">{project.category}</span>
          <h3 className="mt-2 font-display text-xl font-semibold text-ivory group-hover:text-lime transition-colors duration-300">
            {project.title}
          </h3>
          <p className="mt-2 text-ivory-muted text-sm leading-relaxed">
            {project.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => {
              const Icon = getIcon(getTechIcon(tech));
              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-teal px-2.5 py-1 rounded-full bg-ink-raised"
                >
                  <Icon size={12} className="opacity-80" />
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
