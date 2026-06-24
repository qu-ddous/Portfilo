import { useMemo, useState } from "react";

const visualConfig = {
  "smart-labor-platform": {
    eyebrow: "Pakistan Labor Network",
    chips: ["Workers", "Jobs", "Clients"],
    gradient: "from-slate-900 via-emerald-900 to-teal-700",
  },
  gamevault: {
    eyebrow: "Hidden Security Game",
    chips: ["Puzzle", "Vault", "AES"],
    gradient: "from-slate-950 via-violet-950 to-indigo-700",
  },
  "smart-task-reminder": {
    eyebrow: "Smart Daily Planner",
    chips: ["Tasks", "Alerts", "Schedule"],
    gradient: "from-slate-950 via-cyan-950 to-sky-700",
  },
  "zip-manager": {
    eyebrow: "Mobile File Utility",
    chips: ["Zip", "Extract", "Files"],
    gradient: "from-slate-950 via-amber-950 to-orange-700",
  },
  "todo-list": {
    eyebrow: "Professional To Do App",
    chips: ["Lists", "Sync", "Priority"],
    gradient: "from-slate-950 via-emerald-950 to-lime-700",
  },
  "privacy-security-app": {
    eyebrow: "Private Mobile Security",
    chips: ["PIN", "Biometric", "Notes"],
    gradient: "from-slate-950 via-blue-950 to-cyan-700",
  },
  "dairy-milk-management": {
    eyebrow: "Pakistan Dairy Records",
    chips: ["Farmers", "Milk", "Payments"],
    gradient: "from-slate-950 via-green-950 to-emerald-700",
  },
  "tailor-management": {
    eyebrow: "Darzi Shop Management",
    chips: ["Measurements", "Orders", "Delivery"],
    gradient: "from-slate-950 via-rose-950 to-orange-700",
  },
  "tic-tac-toe": {
    eyebrow: "Classic Mobile Game",
    chips: ["X", "O", "History"],
    gradient: "from-slate-950 via-fuchsia-950 to-purple-700",
  },
  "college-management-system": {
    eyebrow: "Pakistan Campus ERP",
    chips: ["Students", "Attendance", "Grades"],
    gradient: "from-slate-950 via-blue-950 to-indigo-700",
  },
};

function ProjectPlaceholder({ project, className = "" }) {
  const config = useMemo(() => {
    return (
      visualConfig[project.id] || {
        eyebrow: `${project.category} Project`,
        chips: project.techStack.slice(0, 3),
        gradient: "from-slate-950 via-slate-900 to-teal-700",
      }
    );
  }, [project]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${config.gradient} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,204,50,0.22),transparent_30%)]" />
      <div className="absolute -right-12 top-6 h-28 w-28 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm" />
      <div className="absolute left-6 bottom-6 h-20 w-20 rounded-2xl border border-white/15 bg-black/15" />

      <div className="relative flex h-full flex-col justify-between p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
            {config.eyebrow}
          </span>
          <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-medium text-white/80">
            {project.category}
          </span>
        </div>

        <div className="max-w-[85%]">
          <h3 className="font-display text-2xl font-semibold leading-tight text-white">
            {project.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
            {project.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {config.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectVisualContent({
  project,
  imageClassName = "",
  fallbackClassName = "",
}) {
  const [hasError, setHasError] = useState(false);

  if (project.image && !hasError) {
    return (
      <img
        src={project.image}
        alt={project.title}
        className={imageClassName}
        onError={() => setHasError(true)}
      />
    );
  }

  return <ProjectPlaceholder project={project} className={fallbackClassName} />;
}

export default function ProjectVisual(props) {
  return <ProjectVisualContent key={`${props.project.id}-${props.project.image ?? ""}`} {...props} />;
}
