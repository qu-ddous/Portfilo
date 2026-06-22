import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const useSolidNavbar = scrolled || location.pathname !== "/";
  const isHeroOverlay = !useSolidNavbar;
  const desktopLinkClass =
    isHeroOverlay
      ? "eyebrow font-semibold text-white hover:text-lime transition-colors duration-200"
      : theme === "light"
      ? "eyebrow font-semibold text-ivory hover:text-teal transition-colors duration-200"
      : "eyebrow font-semibold text-ivory-muted hover:text-lime transition-colors duration-200";
  const iconButtonClass =
    isHeroOverlay
      ? "w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-lime hover:text-lime transition-all duration-300"
      : theme === "light"
      ? "w-10 h-10 rounded-full border border-ink-line bg-ink-surface/90 flex items-center justify-center text-ivory hover:border-teal hover:text-teal transition-all duration-300"
      : "w-10 h-10 rounded-full border border-ink-line flex items-center justify-center text-ivory-muted hover:border-teal hover:text-teal transition-all duration-300";
  const mobileMenuClass =
    theme === "light"
      ? "lg:hidden bg-ink-surface/95 backdrop-blur-md border-t border-ink-line overflow-hidden"
      : "lg:hidden bg-ink border-t border-ink-line overflow-hidden";
  const brandClass = isHeroOverlay
    ? "font-display font-bold text-xl text-white tracking-tight flex items-center gap-2 flex-shrink-0"
    : "font-display font-bold text-xl text-ivory tracking-tight flex items-center gap-2 flex-shrink-0";
  const mobileMenuButtonClass = isHeroOverlay ? "text-white" : "text-ivory";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Works from any page: if already on the home page, scroll smoothly.
  // If on a different page (e.g. a project detail page), navigate home
  // first, then scroll to the section once it has mounted.
  //
  // On mobile, the dropdown menu must finish its close animation BEFORE
  // we scroll — scrolling while the menu is collapsing shifts the layout
  // and the scroll lands in the wrong place (this was the "nav doesn't
  // work on mobile" bug).
  const handleNavClick = (href) => {
    const wasOpen = open;
    setOpen(false);

    const doScroll = () => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    const delay = wasOpen ? 350 : 0; // matches the menu's exit animation

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, delay + 150);
    } else {
      setTimeout(doScroll, delay);
    }
  };

  const goHome = () => {
    const wasOpen = open;
    setOpen(false);
    const delay = wasOpen ? 350 : 0;

    if (location.pathname !== "/") {
      navigate("/");
    } else {
      setTimeout(() => {
        document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
      }, delay);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        useSolidNavbar
          ? "bg-ink/90 backdrop-blur-md border-b border-ink-line"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          className={brandClass}
        >
          <span className="w-8 h-8 rounded-md bg-gradient-to-br from-lime to-teal flex items-center justify-center text-ink text-sm font-bold">
            Q
          </span>
          Quddous
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={desktopLinkClass}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className={iconButtonClass}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-lime text-lime eyebrow hover:bg-lime hover:text-ink transition-all duration-200 whitespace-nowrap"
          >
            Hire Me
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className={iconButtonClass}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            aria-label="Toggle menu"
            className={mobileMenuButtonClass}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={mobileMenuClass}
          >
            <ul className="flex flex-col px-6 py-6 gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={desktopLinkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-lime text-lime eyebrow"
              >
                Hire Me
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
