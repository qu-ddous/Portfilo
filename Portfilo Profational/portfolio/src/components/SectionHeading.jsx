import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-14 ${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-xl"}`}
    >
      <span className="eyebrow text-teal block mb-3">{eyebrow}</span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-ivory text-balance leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-ivory-muted text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
