import { motion } from "framer-motion";
import { ArrowDown, Download, Eye } from "lucide-react";
import heroImg from "../assets/images/hero-original-hd.webp";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();
  
  const handleDownloadCV = async () => {
    const { jsPDF } = await import("jspdf");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/Quddous_CV.jpg";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const pdf = new jsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
      unit: "pt",
      format: [img.width, img.height],
    });

    pdf.addImage(img, "JPEG", 0, 0, img.width, img.height, undefined, "NONE");
    pdf.save("Quddous_CV.pdf");
  };
  
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Quddous, software engineer, working outdoors at night"
          className={`w-full h-full object-cover object-[65%_center] sm:object-[75%_center] scale-[1.02] ${isLight
              ? "brightness-[0.95] contrast-[0.93] saturate-[0.9]"
              : "brightness-[0.88] contrast-[0.9] saturate-[0.84]"
            }`}
        />
        {isLight && (
          <div className="absolute inset-y-0 left-0 w-[48%] bg-gradient-to-r from-[#f6f1e7]/42 via-[#f6f1e7]/16 to-transparent" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-lime inline-flex items-center gap-2 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-lime inline-block" />
          Available for work
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-2xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory leading-[1.1] sm:leading-[1.05] max-w-4xl text-balance"
        >
          Software Engineer <span className="text-lime">AI Driven</span> Development
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-ivory-muted text-lg md:text-xl max-w-xl leading-relaxed"
        >
          I'm Quddous - a Software Engineer building production-grade web,
          mobile, and desktop applications. From admin dashboards to
          encrypted vaults, I turn complex requirements into software people
          actually trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={() => navigate('/cv')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-teal text-ivory font-medium hover:bg-teal/90 hover:shadow-[0_0_24px_rgba(13,148,136,0.28)] transition-all duration-300"
          >
            Preview CV
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-lime text-ink font-medium hover:shadow-lime-glow transition-all duration-300"
          >
            Download CV
            <Download size={16} />
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo("#about")}
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-ivory-muted hover:text-lime transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={22} />
        </motion.div>
      </motion.button>
    </section>
  );
}

