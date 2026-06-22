import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { experience } from "../data/experience";
import { getProjectById } from "../data/projects";

function TimelineCard({ item, project, align, delay }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={`group p-6 rounded-2xl bg-ink-surface border border-ink-line transition-colors duration-300 ${
        project ? "hover:border-lime/50 cursor-pointer" : "hover:border-teal/50"
      }`}
    >
      {item.period && (
        <span className="eyebrow text-ivory-faint block mb-1">{item.period}</span>
      )}
      <h3 className="font-display text-lg font-semibold text-ivory group-hover:text-lime transition-colors duration-300">
        {item.title}
      </h3>
      <p className="text-sm text-teal mt-0.5">{item.org}</p>
      <p className="mt-2 text-ivory-muted text-sm leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );

  return project ? <Link to={`/project/${project.id}`}>{content}</Link> : content;
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 lg:py-32 bg-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Experience"
          title="How the work actually progressed."
          align="center"
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Center vertical line on desktop, left-aligned on mobile */}
          <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-px bg-ink-line md:-translate-x-1/2" />

          <div className="space-y-6 md:space-y-3">
            {experience.map((item, i) => {
              const isLeft = i % 2 === 0;
              const project = item.type === "project" ? getProjectById(item.id) : null;
              const dotColor = item.type === "education" ? "bg-teal" : "bg-lime";

              return (
                <div key={item.id} className="relative flex md:items-center">
                  {/* Dot */}
                  <span
                    className={`absolute z-10 w-3.5 h-3.5 rounded-full border-2 border-ink ${dotColor} left-4 md:left-1/2 md:-translate-x-1/2 top-7 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2`}
                  />

                  {/* Mobile: single column */}
                  <div className="md:hidden pl-12 w-full">
                    <TimelineCard item={item} project={project} align="left" delay={(i % 8) * 0.04} />
                  </div>

                  {/* Desktop: two columns, content only on the correct side */}
                  <div className="hidden md:flex w-full items-center gap-10">
                    <div className="w-1/2 flex justify-end pr-4">
                      {isLeft && (
                        <div className="w-full max-w-md">
                          <TimelineCard item={item} project={project} align="left" delay={(i % 8) * 0.04} />
                        </div>
                      )}
                    </div>
                    <div className="w-1/2 flex justify-start pl-4">
                      {!isLeft && (
                        <div className="w-full max-w-md">
                          <TimelineCard item={item} project={project} align="right" delay={(i % 8) * 0.04} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
