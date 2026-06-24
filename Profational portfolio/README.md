
# Quddous — Portfolio

https://quddous-portfolio-live.vercel.app

https://quddous-portfolio.netlify.app

Professional portfolio site built with React, Vite, Tailwind CSS, and
Framer Motion. Single scroll page (Hero → About → Skills → Projects →
Services → Experience → Testimonials → Contact → Footer) plus a
dedicated project detail page for each project.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — upload that to Vercel, Netlify, or
any static host.

## Adding / editing projects (your local "database")

Open `src/data/projects.js`. Every project is one object in the
`projects` array:

```js
{
  id: "your-project-id",
  title: "Project Name",
  category: "Web", // or "Mobile" / "Desktop"
  tagline: "One-line summary",
  image: yourImportedImage, // see below
  techStack: ["React", "Firebase"],
  problem: "...",
  solution: "...",
  highlights: ["...", "..."],
  liveLink: "https://...",
  githubLink: "https://...",
  featured: true,
}
```

**To add a project screenshot:**
1. Put the image file in `src/assets/projects/` (e.g. `flickcom-isp.png`)
2. At the top of `src/data/projects.js`, import it:
   ```js
   import flickcomImg from "../assets/projects/flickcom-isp.png";
   ```
3. Set `image: flickcomImg` on that project's object.

No backend, no database server — this file IS the database. The
Projects section and every project detail page render from it
automatically.

## Editing other content

- `src/data/skills.js` — skill categories and tags
- `src/data/services.js` — freelance service offerings
- `src/data/experience.js` — timeline entries
- `src/sections/Testimonials.jsx` — replace placeholder quotes with real ones
- `src/sections/Contact.jsx` — update the email address, and your social
  links (GitHub / LinkedIn URLs)
- `public/resume.pdf` — replace with your real resume (same filename)

## Contact form

The form is wired up in `src/sections/Contact.jsx` but doesn't send
anywhere yet — there's no backend. To make it actually deliver email,
sign up for a free account at either:

- **Formspree** (https://formspree.io) — paste your form endpoint into
  the commented-out `fetch` call in `handleSubmit`
- **EmailJS** (https://www.emailjs.com) — similar setup, a few more
  config values

Both are free for portfolio-level traffic and need zero backend code.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router (project detail pages)
- lucide-react (icons)

## Design tokens

- Background: `#0A0A0A` (ink)
- Primary accent: `#D4FF3F` (lime)
- Secondary accent: `#14B8A6` (teal)
- Text: `#F5F5F2` (ivory)
- Display font: Space Grotesk · Body font: Inter · Mono/labels: JetBrains Mono
