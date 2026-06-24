import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, MessageCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import SectionHeading from "../components/SectionHeading";
import { GithubIcon, LinkedinIcon } from "../components/BrandIcons";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Your actual EmailJS credentials
      const serviceId = "service_1hvinbj";
      const templateId = "template_7xw0mns";
      const publicKey = "k62FOQatuXRwvAn6X";

      await emailjs.send(serviceId, templateId, form, publicKey);

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-ink relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something."
              description="Whether it's a full product or a focused feature — tell me what you're trying to solve."
            />

            <div className="space-y-4 mt-8">
              <a
                href="mailto:m.quddous7271@gmail.com"
                className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors duration-200"
              >
                <Mail size={18} />
                m.quddous7271@gmail.com
              </a>
              <a
                href="https://wa.me/923092189637"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-ivory-muted hover:text-lime transition-colors duration-200"
              >
                <MessageCircle size={18} />
                +92 309 2189637
              </a>
              <div className="flex items-center gap-3 text-ivory-muted">
                <MapPin size={18} />
                Luddan District Vehari, Punjab, Pakistan
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <a
                href="https://github.com/qu-ddous"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-full bg-ink-surface border border-ink-line flex items-center justify-center text-ivory-muted hover:border-lime hover:text-lime transition-all duration-300"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/m-quddous-4850903a4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full bg-ink-surface border border-ink-line flex items-center justify-center text-ivory-muted hover:border-teal hover:text-teal transition-all duration-300"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="eyebrow text-ivory-faint block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-ink-surface border border-ink-line text-ivory placeholder:text-ivory-faint focus:border-lime transition-colors duration-200 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="eyebrow text-ivory-faint block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-ink-surface border border-ink-line text-ivory placeholder:text-ivory-faint focus:border-lime transition-colors duration-200 outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow text-ivory-faint block mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-ink-surface border border-ink-line text-ivory placeholder:text-ivory-faint focus:border-lime transition-colors duration-200 outline-none resize-none"
                placeholder="What are you trying to build?"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-lime text-ink font-medium hover:shadow-lime-glow transition-all duration-300 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>

            {status === "sent" && (
              <p className="text-teal text-sm">
                Message sent. I'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Failed to send message. Please try again or email directly.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
