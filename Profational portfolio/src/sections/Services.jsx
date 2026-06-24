import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "../utils/iconRegistry";
import SectionHeading from "../components/SectionHeading";
import { services } from "../data/services";

export default function Services() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-24 lg:py-32 bg-ink-surface relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you."
          description="If you have a problem and need software to solve it, here's where I usually start."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group p-7 rounded-2xl bg-ink border border-ink-line hover:border-lime/50 transition-all duration-300 flex flex-col"
            >
              <span className="eyebrow text-lime mb-3">
                0{i + 1}
              </span>
              <h3 className="font-display text-xl font-semibold text-ivory mb-3">
                {service.title}
              </h3>
              <p className="text-ivory-muted text-sm leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => {
                  const Icon = getIcon(tag.icon);
                  return (
                    <span
                      key={tag.name}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-teal px-2.5 py-1 rounded-full bg-ink-raised"
                    >
                      <Icon size={12} className="opacity-80" />
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}

          <motion.button
            onClick={scrollToContact}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group p-7 rounded-2xl bg-gradient-to-br from-lime/10 to-teal/10 border border-lime/30 hover:border-lime transition-all duration-300 flex flex-col items-start justify-center text-left"
          >
            <span className="font-display text-xl font-semibold text-ivory mb-2">
              Have something else in mind?
            </span>
            <span className="text-ivory-muted text-sm mb-5">
              Let's talk about what you're trying to build.
            </span>
            <span className="inline-flex items-center gap-2 text-lime font-medium">
              Get in touch
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
