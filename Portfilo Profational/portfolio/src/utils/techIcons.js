// Maps a tech-stack label (free text, as written in projects.js) to a
// lucide-react icon name. Falls back to a generic "Box" icon if no
// match is found, so new technologies never break rendering.

const techIconMap = [
  [/react/i, "Atom"],
  [/angular/i, "Triangle"],
  [/vite/i, "Zap"],
  [/typescript/i, "FileText"],
  [/tailwind/i, "Wind"],
  [/mui/i, "Component"],
  [/recharts|chart/i, "BarChart3"],
  [/framer/i, "Move3d"],
  [/three\.?js/i, "Boxes"],
  [/node\.?js/i, "Server"],
  [/express/i, "Workflow"],
  [/firebase|firestore|fcm/i, "Flame"],
  [/supabase/i, "Database"],
  [/postgres/i, "Database"],
  [/rest api/i, "Webhook"],
  [/flutter/i, "Smartphone"],
  [/riverpod/i, "Layers3"],
  [/hive/i, "HardDrive"],
  [/sqflite|sqlite/i, "Database"],
  [/secure_storage|encryption|aes|biometric/i, "ShieldCheck"],
  [/pointycastle/i, "Lock"],
  [/electron/i, "Monitor"],
  [/zustand/i, "Boxes"],
  [/jspdf|pdf/i, "FileText"],
  [/sheetjs|xlsx|excel/i, "FileSpreadsheet"],
  [/whisper|vosk/i, "Mic"],
  [/gpt|ollama|llm/i, "Brain"],
  [/elevenlabs/i, "Speaker"],
  [/geolocator|location/i, "MapPin"],
  [/notification/i, "Bell"],
  [/api/i, "Webhook"],
  [/math_expressions/i, "Calculator"],
  [/git/i, "GitBranch"],
  [/figma/i, "Component"],
  [/recaptcha/i, "ShieldCheck"],
  [/i18n|urdu|english/i, "Globe"],
];

export function getTechIcon(techName) {
  const match = techIconMap.find(([pattern]) => pattern.test(techName));
  return match ? match[1] : "Box";
}
