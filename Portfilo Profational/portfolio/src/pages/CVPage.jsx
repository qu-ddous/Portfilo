import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CVProfile from "../sections/CVProfile";

export default function CVPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ink-surface min-h-screen">
      <Navbar />
      <main className="pt-20">
        <CVProfile />
      </main>
      <Footer />
    </div>
  );
}