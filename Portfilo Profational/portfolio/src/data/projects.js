// Local "database" for projects.
//
// Each project's screenshots live in their own folder:
//   src/assets/projects/<project-id>/
// (a README.txt inside each folder explains exactly how to wire images up)
//
// `image`   = ONE screenshot shown on the project card in the Projects grid
// `gallery` = ALL screenshots shown on that project's detail page (1–15+)
//
// To add screenshots: drop image files into the project's folder, import
// them at the top of this file, then set `image` and `gallery` below.

export const categories = ["All", "Web", "Mobile", "Desktop"];

export const projects = [
  // ───────────────────────── WEB ─────────────────────────
  {
    id: "flickcom-isp",
    title: "Flickcom ISP Admin Portal",
    category: "Web",
    tagline: "Full operations dashboard for an internet service provider",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["React 18", "Vite", "Firebase", "Tailwind", "MUI", "Recharts"],
    problem:
      "Flickcom needed a single dashboard to manage subscriber KYC, billing, complaints, and pricing — previously handled across spreadsheets and manual processes.",
    solution:
      "Built a role-based admin portal with real-time Firebase RTDB sync, a KYC approval workflow, grandfathered pricing logic for legacy customers, and direct JazzCash/EasyPaisa billing integrations with dual FCM payment notifications.",
    highlights: [
      "Real-time KYC approval workflow",
      "Grandfather pricing engine (price_locked logic)",
      "Direct JazzCash & EasyPaisa integration",
      "Dual FCM push notifications on payment events",
    ],
    liveLink: "",
    githubLink: "",
    featured: true,
  },
  {
    id: "kametipro",
    title: "KametiPro — Committee Management System",
    category: "Web",
    tagline: "Digitizing traditional rotating-savings committees (Kameti)",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Angular 17", "Node.js", "Express", "Supabase", "Tailwind"],
    problem:
      "Kameti groups in Pakistan are run manually with paper ledgers, causing trust and tracking issues among members.",
    solution:
      "Architected a 12-phase platform covering member onboarding, contribution tracking, automated payout scheduling, and a transparent ledger — rebuilt from the ground up after an earlier version had structural issues.",
    highlights: [
      "Automated contribution & payout scheduling",
      "Transparent digital ledger per member",
      "Full 12-phase systems architecture",
    ],
    liveLink: "",
    githubLink: "",
    featured: true,
  },
  {
    id: "election-system",
    title: "Secure Online Election Management System",
    category: "Web",
    tagline: "Blockchain-style audit logging for verifiable digital elections",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["React 18", "Vite", "Node.js", "Supabase", "Three.js", "Framer Motion"],
    problem:
      "Digital voting needs to be both accessible and provably tamper-evident, with support for non-English speaking voters.",
    solution:
      "Built an 85+ file platform with blockchain-style audit logs for vote integrity, Google reCAPTCHA v3 for bot protection, full English/Urdu i18n, and automatic session idle timeout for security.",
    highlights: [
      "Blockchain-style tamper-evident audit log",
      "reCAPTCHA v3 fraud prevention",
      "English / Urdu i18n",
      "Session idle timeout security",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "smart-labor-platform",
    title: "Smart Labor Platform",
    category: "Web",
    tagline: "Connecting skilled laborers with clients — final year project",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["React 18", "Vite", "Node.js", "Supabase"],
    problem:
      "Daily-wage and skilled laborers in local markets lack a structured way to advertise availability and get hired.",
    solution:
      "Designed a multi-role platform (laborer, client, admin) with a full interactive demo, replacing an original MongoDB/Socket.io/Cloudinary stack with a leaner Supabase-based architecture.",
    highlights: [
      "Multi-role interactive demo",
      "Simplified, modern backend architecture",
      "Built as a complete university FYP",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "mini-store",
    title: "Mini Store",
    category: "Web",
    tagline: "A lightweight e-commerce storefront for small sellers",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["React 18", "Vite", "Tailwind", "Supabase", "Zustand"],
    problem:
      "Small sellers need an online storefront without the overhead of a full enterprise e-commerce platform.",
    solution:
      "Built a lightweight storefront with product catalog management, cart and checkout flow, and a Supabase backend for orders and inventory — fast to deploy and easy to run.",
    highlights: [
      "Lightweight product catalog & cart",
      "Supabase-backed inventory & orders",
      "Fast load times, minimal overhead",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "doctor-hub",
    title: "Doctor Hub",
    category: "Web",
    tagline: "Appointment booking and patient management for clinics",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["React 18", "Vite", "Tailwind", "Firebase", "Firestore"],
    problem:
      "Small clinics needed a simple way to manage doctor schedules and let patients book appointments without phone calls.",
    solution:
      "Built a booking platform with real-time slot availability via Firestore, patient records, and a doctor-facing schedule dashboard.",
    highlights: [
      "Real-time appointment slot availability",
      "Doctor schedule dashboard",
      "Patient record management",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },

  // ───────────────────────── MOBILE (Flutter) ─────────────────────────
  {
    id: "gamevault",
    title: "GameVault",
    category: "Mobile",
    tagline: "A tap-match game that's secretly an encrypted file vault",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "AES-256-CBC", "PointyCastle", "flutter_secure_storage"],
    problem:
      "Standard vault apps look like vault apps — making them an obvious target. The brief called for a hidden, deniable way to store sensitive files.",
    solution:
      "Designed a fully playable casual tap-match game where a secret in-game gesture sequence unlocks an AES-256-CBC encrypted file vault, with all 7 UI screens, full security pipeline, and key derivation handled client-side.",
    highlights: [
      "AES-256-CBC encryption pipeline",
      "Secret in-game trigger to unlock vault",
      "7 fully designed UI screens",
      "Zero visual trace of vault functionality",
    ],
    liveLink: "",
    githubLink: "",
    featured: true,
  },
  {
    id: "smart-finance-tracker",
    title: "Smart Finance Tracker",
    category: "Mobile",
    tagline: "Personal finance tracking with real-time sync",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Flutter", "Riverpod", "Firebase Auth", "Firestore"],
    problem:
      "Users needed a finance tracker that felt native and fast across a wide range of screen sizes, from small phones to tablets.",
    solution:
      "Specced and refined a 9-screen Flutter app with Riverpod state management, responsive breakpoints from 320px to 1025px+, and real-time Firestore sync.",
    highlights: [
      "9 fully responsive screens",
      "Riverpod-driven state architecture",
      "Breakpoints from 320px to 1025px+",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "smart-task-reminder",
    title: "Smart Task Reminder",
    category: "Mobile",
    tagline: "Exact-alarm task reminders that don't get missed",
    image: "https://images.unsplash.com/photo-1506784926709-22f1ec395907?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "Hive", "Exact Alarms", "RepaintBoundary"],
    problem:
      "Generic reminder apps lose precision — alarms fire late or get killed by the OS in the background.",
    solution:
      "Refactored and QA'd the app end to end: resolved 17 static-analysis issues including a critical null-safety crash, applied the repository pattern, and optimized custom BubbleCard animations with RepaintBoundary and VisibilityDetector for smooth scrolling.",
    highlights: [
      "Exact alarms with full-screen alerts",
      "17 static-analysis issues resolved",
      "Repository pattern for data access",
      "Animation performance optimization",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "zip-manager",
    title: "Mobile Zip Manager",
    category: "Mobile",
    tagline: "Compress, extract, and organize files directly on-device",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "Hive", "archive", "file_picker"],
    problem:
      "Mobile users often need to compress or extract files without a desktop nearby — most file managers don't handle this cleanly.",
    solution:
      "Built a zip/unzip utility with a clean file browser, in-app compression and extraction, and Hive-backed local history of recently handled archives.",
    highlights: [
      "In-app zip/unzip with progress tracking",
      "Local file browser with archive preview",
      "Recently-handled files history (Hive)",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "todo-list",
    title: "To-Do List App",
    category: "Mobile",
    tagline: "Task management that syncs across devices",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "Hive", "Firebase Firestore", "flutter_local_notifications"],
    problem:
      "Most to-do apps are either purely local (no sync) or purely cloud (slow, no offline support).",
    solution:
      "Combined Hive for instant local-first interaction with Firestore sync in the background, plus scheduled local notifications for due tasks.",
    highlights: [
      "Offline-first with background cloud sync",
      "Scheduled task notifications",
      "Categorized lists with priority sorting",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "weather-app",
    title: "Weather App",
    category: "Mobile",
    tagline: "Clean, fast forecasts with location-aware updates",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Flutter", "OpenWeather API", "Geolocator", "Riverpod"],
    problem:
      "Many weather apps are cluttered with ads and slow API calls that delay showing the actual forecast.",
    solution:
      "Built a minimal weather app with geolocation-based auto-detection, a 5-day forecast view, and cached responses to stay fast on weak connections.",
    highlights: [
      "Auto-location detection",
      "5-day forecast with hourly breakdown",
      "Response caching for weak connections",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    category: "Mobile",
    tagline: "Timed quizzes with categories and a live leaderboard",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Flutter", "Hive", "Firebase Firestore"],
    problem:
      "Quiz apps often feel static — no sense of competition or progress tracking across sessions.",
    solution:
      "Built a category-based quiz engine with countdown timers, local score history via Hive, and a Firestore-backed global leaderboard.",
    highlights: [
      "Timed quiz engine with category selection",
      "Global leaderboard via Firestore",
      "Local score history and stats",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "calculator-all-in-one",
    title: "Calculator — All in One",
    category: "Mobile",
    tagline: "Standard, scientific, and unit-conversion calculator in one app",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Flutter", "math_expressions"],
    problem:
      "Switching between separate apps for basic math, scientific calculations, and unit conversion is unnecessary friction.",
    solution:
      "Built a single app with swipeable calculator modes — standard, scientific, and unit converter — sharing one consistent UI.",
    highlights: [
      "Standard, scientific & converter modes",
      "Calculation history per mode",
      "Single consistent UI across modes",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "privacy-security-app",
    title: "Privacy & Security App",
    category: "Mobile",
    tagline: "App-locking and encrypted notes for sensitive data",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "flutter_secure_storage", "AES Encryption", "Biometric Auth"],
    problem:
      "Users need a straightforward way to lock specific apps and store sensitive notes without trusting a third-party cloud service.",
    solution:
      "Built an on-device privacy suite — biometric/PIN app locking and AES-encrypted notes stored entirely via flutter_secure_storage, with zero cloud dependency.",
    highlights: [
      "Biometric & PIN-based app locking",
      "AES-encrypted local notes",
      "Fully offline — no cloud dependency",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "dairy-milk-management",
    title: "Dairy Milk Management",
    category: "Mobile",
    tagline: "Tracking daily milk collection and dairy farmer payments",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "sqflite (SQLite)", "Supabase"],
    problem:
      "Small dairy collection points track daily milk volume and farmer payments on paper, leading to disputes and lost records.",
    solution:
      "Built a local-first SQLite app for daily entry logging with Supabase sync, automatic rate calculations, and monthly farmer payment summaries.",
    highlights: [
      "Daily milk entry logging per farmer",
      "Automatic rate & payment calculation",
      "Monthly summaries with Supabase backup",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "fitness-diet-tracker",
    title: "Fitness & Diet Tracker",
    category: "Mobile",
    tagline: "Meal logging and workout tracking with progress charts",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Flutter", "Riverpod", "Firebase Auth", "Firestore"],
    problem:
      "Most fitness trackers are either too complex for casual users or too shallow to show meaningful progress over time.",
    solution:
      "Analyzed and tested the app thoroughly using white-box testing methods (control flow graphs, cyclomatic complexity, 26 test cases across 8 modules) to verify reliability, alongside meal and workout logging with progress visualization.",
    highlights: [
      "Meal & workout logging with daily targets",
      "White-box tested: 26 cases across 8 modules",
      "Progress charts over time",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "tailor-management",
    title: "Tailor Management App",
    category: "Mobile",
    tagline: "Order tracking and measurements for tailoring businesses",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "Riverpod", "Hive", "Supabase"],
    problem:
      "Tailoring shops manage customer measurements and order status on paper, making it hard to track delivery dates reliably.",
    solution:
      "Built an order management app storing customer measurements locally with Hive, syncing order status to Supabase, with delivery date reminders.",
    highlights: [
      "Customer measurement profiles",
      "Order status tracking with delivery reminders",
      "Local-first with Supabase sync",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    category: "Mobile",
    tagline: "Classic two-player game with local match history",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f545?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["Flutter", "Hive"],
    problem:
      "A simple brief: a polished, distraction-free version of a classic game with a sense of progress across matches.",
    solution:
      "Built a clean two-player Tic Tac Toe with win-streak tracking and match history stored locally via Hive.",
    highlights: [
      "Local two-player mode",
      "Win-streak & match history tracking",
      "Minimal, distraction-free UI",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },

  // ───────────────────────── DESKTOP ─────────────────────────
  {
    id: "ai-english-assistant",
    title: "AI English Assistant",
    category: "Desktop",
    tagline: "Voice-driven English practice with real-time AI feedback",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Electron", "React", "Whisper / Vosk", "GPT / Ollama", "ElevenLabs"],
    problem:
      "Language learners need conversational practice on demand — not scheduled sessions with a tutor.",
    solution:
      "Built a desktop app that listens via Whisper/Vosk speech-to-text, generates contextual responses through GPT or a local Ollama model, and speaks back using ElevenLabs voice synthesis — a full conversational loop running on the desktop.",
    highlights: [
      "Real-time speech-to-text (Whisper/Vosk)",
      "Local or cloud LLM response generation",
      "Natural voice replies via ElevenLabs",
    ],
    liveLink: "",
    githubLink: "",
    featured: true,
  },
  {
    id: "college-management-system",
    title: "College Management System",
    category: "Desktop",
    tagline: "Student records, attendance, and grading in one desktop app",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    techStack: ["React 18", "TypeScript", "Electron 30", "better-sqlite3", "Recharts", "Tailwind"],
    problem:
      "Smaller colleges often run on a patchwork of spreadsheets for student records, attendance, and grading.",
    solution:
      "Built a unified desktop system with synchronous SQLite storage for instant local performance, attendance tracking, grade management, and Recharts-based performance dashboards — exportable to PDF and Excel.",
    highlights: [
      "Student records, attendance & grading in one place",
      "PDF and Excel export (jsPDF, SheetJS)",
      "Fast synchronous local storage (better-sqlite3)",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "typing-master",
    title: "Typing Master",
    category: "Desktop",
    tagline: "Typing speed and accuracy trainer with progress tracking",
    image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Electron", "React", "Zustand"],
    problem:
      "Typing trainers often feel disconnected from real progress — no clear sense of improvement over time.",
    solution:
      "Built a desktop typing trainer with live WPM/accuracy tracking, lesson progression, and Zustand-managed state for a snappy, responsive typing experience.",
    highlights: [
      "Live WPM & accuracy tracking",
      "Progressive lesson structure",
      "Snappy state management with Zustand",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
  {
    id: "blood-bank",
    title: "Blood Bank Management System",
    category: "Desktop",
    tagline: "Donor records and blood inventory tracking for blood banks",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    techStack: ["Electron", "React", "SQLite"],
    problem:
      "Blood banks need fast, reliable lookup of donor and inventory records — ideally without depending on an internet connection.",
    solution:
      "Built a fully offline desktop app with SQLite storage for donor profiles, blood type inventory, and request matching.",
    highlights: [
      "Offline-first donor & inventory records",
      "Blood type matching for requests",
      "Local SQLite storage, no internet dependency",
    ],
    liveLink: "",
    githubLink: "",
    featured: false,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id) => projects.find((p) => p.id === id);
