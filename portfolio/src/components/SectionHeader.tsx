"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ title, subtitle, align = "center" }: SectionHeaderProps) {
  const ref = useScrollReveal({ y: 30, duration: 0.6 });

  return (
    <div ref={ref} className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      {subtitle && (
        <span className="text-gradient-accent font-semibold tracking-wider uppercase text-sm mb-3 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
        {title}
      </h2>
      <div className={`h-1 w-20 bg-gradient-to-r from-neon to-neon-purple rounded-full ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
