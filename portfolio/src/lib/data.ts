// ============================================================
// CENTRALIZED DATA - Edit this file to update all content
// ============================================================

export const personalInfo = {
  name: "Muhammad Quddous",
  title: "Aspiring Software Developer",
  subtitle: "Web Development | Python | Information Security",
  email: "muhammadquddous@email.com", // Update your email
  github: "https://github.com/muhammadquddous", // Update your GitHub
  linkedin: "https://linkedin.com/in/muhammadquddous", // Update your LinkedIn
  bio: "Muhammad Quddous is a software development student passionate about web development, Python programming, data structures, and information security. He builds practical applications to solve real-world problems and is continuously expanding his skill set across multiple domains of modern software engineering.",
  heroDescription:
    "A dedicated software development student crafting clean, efficient, and impactful digital solutions. Specializing in full-stack web development, Python application development, and information security.",
  profileImage: "/images/profile.png", // Your Gemini generated profile image
  resumeLink: "/resume.pdf", // Add your resume here
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export const skillCategories = [
  {
    category: "Programming Languages",
    icon: "code",
    skills: [
      { name: "Python", level: 85 },
      { name: "C++", level: 75 },
      { name: "Java", level: 70 },
      { name: "C#", level: 70 },
    ],
  },
  {
    category: "Web Technologies",
    icon: "web",
    skills: [
      { name: "HTML / CSS", level: 90 },
      { name: "JavaScript", level: 80 },
      { name: "React", level: 75 },
      { name: "Tailwind CSS", level: 80 },
      { name: "Node.js", level: 65 },
      { name: "Express.js", level: 60 },
    ],
  },
  {
    category: "Databases",
    icon: "database",
    skills: [
      { name: "MySQL", level: 75 },
      { name: "MongoDB", level: 65 },
    ],
  },
  {
    category: "Tools & Frameworks",
    icon: "tools",
    skills: [
      { name: "Tkinter", level: 80 },
      { name: "PySimpleGUI", level: 75 },
      { name: "Flutter", level: 55 },
      { name: "Firebase", level: 60 },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Hardware Shop Management System",
    description:
      "A comprehensive desktop application for hardware shop inventory management, billing, and sales tracking built with C# and SQL Server.",
    tech: ["C#", ".NET", "SQL Server", "WinForms"],
    image: "/images/projects/project1.jpg",
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Quiz Application",
    description:
      "An interactive multi-category quiz application with score tracking, timer functionality, and a clean Java-based GUI interface.",
    tech: ["Java", "Java Swing", "OOP"],
    image: "/images/projects/project2.jpg",
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    id: 3,
    title: "Blood Bank Management System",
    description:
      "A Python GUI application for blood bank operations including donor registration, blood inventory management, and request processing.",
    tech: ["Python", "Tkinter", "MySQL"],
    image: "/images/projects/project3.jpg",
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 4,
    title: "Typing Master Application",
    description:
      "A feature-rich typing practice tool with WPM tracking, accuracy measurement, difficulty levels, and progress reporting.",
    tech: ["Python", "PySimpleGUI", "Statistics"],
    image: "/images/projects/project4.jpg",
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    id: 5,
    title: "Information Security Tools",
    description:
      "A collection of cryptographic tools implementing Caesar Cipher, OTP, RSA encryption, and hashing algorithms for educational purposes.",
    tech: ["Python", "Cryptography", "RSA", "OTP"],
    image: "/images/projects/project5.jpg",
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 6,
    title: "Smart Service Booking Platform",
    description:
      "A full-stack web application for booking professional services with real-time availability, user authentication, and admin dashboard.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    image: "/images/projects/project6.jpg",
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 7,
    title: "Teacher Assistant Web App",
    description:
      "A web application for teachers to manage student records, assignments, grading, and generate academic performance reports.",
    tech: ["React", "Firebase", "Tailwind CSS"],
    image: "/images/projects/project7.jpg",
    github: "#",
    demo: "#",
    featured: false,
  },
];

export const achievements = [
  {
    number: "7+",
    label: "Software Projects",
    description: "Completed across multiple domains and platforms",
    icon: "projects",
  },
  {
    number: "4+",
    label: "Languages Mastered",
    description: "Python, Java, C#, C++ with practical experience",
    icon: "code",
  },
  {
    number: "5+",
    label: "Technologies",
    description: "Web, GUI, Database, Mobile & Security tools",
    icon: "tech",
  },
  {
    number: "∞",
    label: "Learning Mindset",
    description: "Continuously expanding skills and knowledge",
    icon: "growth",
  },
];
