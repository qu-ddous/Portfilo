import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

// Professional English testimonials with circular profile images (Pakistani people)
const testimonials = [
  {
    quote:
      "Quddous built our online store and helped us triple our sales in just 2 months. His communication skills and timely delivery were exceptional.",
    name: "Ahmed Khan",
    role: "Owner, Lahore Clothing Co.",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote:
      "We were thoroughly impressed by Quddous's technical skills and problem-solving abilities. He completely automated our inventory management system.",
    name: "Sara Ahmed",
    role: "Operations Manager, Karachi Electronics",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote:
      "Quddous designed and developed my portfolio website — the design is incredibly professional and fully responsive. Highly recommended!",
    name: "Ali Hassan",
    role: "Freelance Photographer, Islamabad",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-ink-surface relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people say after working together."
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-ink border border-ink-line hover:border-lime/30 hover:shadow-[0_0_30px_rgba(168,204,50,0.08)] transition-all duration-300"
            >
              <Quote size={24} className="text-lime mb-6" />
              <p className="text-ivory-muted text-sm md:text-base leading-relaxed mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-lime"
                />
                <div>
                  <p className="text-ivory font-medium text-sm">{t.name}</p>
                  <p className="text-ivory-faint text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
