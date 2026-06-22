import { motion } from "framer-motion";
import { Download } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const stats = [
  { value: "20+", label: "Projects Shipped" },
  { value: "20+", label: "Technologies" },
  { value: "3", label: "Platforms — Web, Mobile, Desktop" },
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-ink relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About"
              title="From coursework to production code."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-ivory-muted text-base md:text-lg leading-relaxed"
            >
              <p>
                I'm a software engineer finishing my degree at COMSATS
                University, but most of what I know didn't come from a
                classroom — it came from building real systems end to end:
                admin portals that ISPs actually run on, encrypted vaults
                disguised as games, and election platforms that need to be
                provably tamper-evident.
              </p>
              <p>
                I work across three platforms — web, mobile, and desktop —
                and I'm comfortable owning a project from architecture to
                shipped product. I care about systems that hold up: clean
                state management, real-time data that doesn't break under
                load, and interfaces that don't make people think twice.
              </p>
              <p>
                When I'm not writing code, I'm usually refining how my own
                work looks and reads — from UI motion details to the
                occasional brand identity system, like the one behind this
                site.
              </p>
            </motion.div>

            <motion.a
              href="/Quddous_CV.pdf"
              download
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink-raised border border-ink-line text-ivory hover:border-lime hover:text-lime transition-all duration-300"
            >
              <Download size={18} />
              Download Resume
            </motion.a>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-ink-surface border border-ink-line hover:border-teal/50 transition-colors duration-300"
              >
                <div className="font-display text-4xl font-bold text-lime">
                  {stat.value}
                </div>
                <div className="mt-2 text-ivory-muted eyebrow normal-case tracking-normal text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
