"use client";
import { useStaggerReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "./SectionHeader";
import { 
  SiPython, SiJavascript, SiCplusplus,
  SiReact, SiNextdotjs, SiNodedotjs, SiMongodb, SiMysql, SiTailwindcss
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

const skills = [
  { category: "Languages", items: [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "C#", icon: TbBrandCSharp, color: "#239120" },
  ]},
  { category: "Technologies", items: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  ]}
];

export default function Skills() {
  const containerRef = useStaggerReveal(".skill-card", { y: 30, stagger: 0.05 });

  return (
    <section id="skills" className="section-padding relative bg-black/20">
      <div className="container-custom" ref={containerRef}>
        <SectionHeader title="My Skills" subtitle="What I do" />

        <div className="space-y-16">
          {skills.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-2xl font-bold text-primary mb-8 text-center">
                {group.category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {group.items.map((skill, i) => (
                  <div
                    key={i}
                    className="skill-card glass-card p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-all duration-300 border border-white/5 hover:border-neon/50 group"
                  >
                    <skill.icon 
                      size={48} 
                      className="text-muted group-hover:text-white transition-colors duration-300"
                      style={{ color: skill.color }}
                    />
                    <span className="font-medium text-primary">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
