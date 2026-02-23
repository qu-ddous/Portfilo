"use client";
import { useStaggerReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "./SectionHeader";
import { Trophy, Star, Award, Target } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Top Performer",
    description: "Consistently ranked among the top students in programming courses.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10"
  },
  {
    icon: Star,
    title: "Hackathon Winner",
    description: "Secured 1st place in the university-level coding competition.",
    color: "text-neon",
    bg: "bg-neon/10"
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Completed multiple advanced certifications in Web Development and Security.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10"
  },
  {
    icon: Target,
    title: "Projects Completed",
    description: "Successfully delivered 10+ academic and personal projects.",
    color: "text-green-400",
    bg: "bg-green-400/10"
  }
];

export default function Achievements() {
  const containerRef = useStaggerReveal(".achievement-card", { y: 40, stagger: 0.15 });

  return (
    <section id="achievements" className="section-padding relative bg-black/20">
      <div className="container-custom" ref={containerRef}>
        <SectionHeader title="Achievements" subtitle="Milestones & Recognition" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="achievement-card glass-card p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 group text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
