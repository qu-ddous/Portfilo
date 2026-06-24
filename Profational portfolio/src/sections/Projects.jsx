import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import { projects, categories } from "../data/projects";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-ink relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <SectionHeading
            eyebrow="Projects"
            title="Selected work, end to end."
            description="Each one solved a real problem — from ISP operations to disguised data security."
          />

          <div className="flex flex-wrap gap-2 md:pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-lime text-ink"
                    : "bg-ink-surface text-ivory-muted border border-ink-line hover:border-teal hover:text-teal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-ivory-muted text-center py-16">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
