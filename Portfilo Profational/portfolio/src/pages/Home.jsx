import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeamDivider from "../components/SeamDivider";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import Services from "../sections/Services";
import Experience from "../sections/Experience";
import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SeamDivider />
        <Skills />
        <SeamDivider />
        <Projects />
        <SeamDivider />
        <Services />
        <SeamDivider />
        <Experience />
        <SeamDivider />
        <Testimonials />
        <SeamDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
