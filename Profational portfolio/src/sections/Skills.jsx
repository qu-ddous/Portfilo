import { motion } from "framer-motion";
import { getIcon } from "../utils/iconRegistry";
import SectionHeading from "../components/SectionHeading";
import { skillCategories } from "../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="py-24 lg:py-32 bg-ink-surface relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Skills"
          title="The stack behind the work."
          description="Tools I reach for depending on what the problem actually needs — not a fixed toolkit applied everywhere."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, i) => {
            const isLime = cat.accent === "lime";
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className={`group p-7 rounded-2xl bg-ink border border-ink-line transition-colors duration-300 ${
                  isLime ? "hover:border-lime/60" : "hover:border-teal/60"
                }`}
              >
                <div
                  className={`w-10 h-1 rounded-full mb-5 ${isLime ? "bg-lime" : "bg-teal"}`}
                />
                <h3 className="font-display text-xl font-semibold text-ivory mb-4">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => {
                    const Icon = getIcon(skill.icon);
                    return (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-raised text-sm font-mono transition-colors duration-300 ${
                          isLime ? "text-lime" : "text-teal"
                        }`}
                      >
                        <Icon size={14} className="opacity-80" />
                        <span className="text-ivory-muted group-hover:text-ivory transition-colors duration-300">
                          {skill.name}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
