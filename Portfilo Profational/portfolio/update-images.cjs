const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'projects.js');
let content = fs.readFileSync(filePath, 'utf8');

const images = {
  "flickcom-isp": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  "kametipro": "https://images.unsplash.com/photo-1580519542036-ed47f3e4271d?auto=format&fit=crop&w=800&q=80",
  "election-system": "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
  "smart-labor-platform": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
  "mini-store": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
  "doctor-hub": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  "gamevault": "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=800&q=80",
  "smart-finance-tracker": "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=800&q=80",
  "smart-task-reminder": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
  "zip-manager": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  "todo-list": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
  "weather-app": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
  "quiz-master": "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
  "calculator-all-in-one": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80",
  "privacy-security-app": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  "dairy-milk-management": "https://images.unsplash.com/photo-1599818816906-90df1e0c7914?auto=format&fit=crop&w=800&q=80",
  "fitness-diet-tracker": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  "tailor-management": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  "tic-tac-toe": "https://images.unsplash.com/photo-1611996575749-79a3a250f545?auto=format&fit=crop&w=800&q=80",
  "ai-english-assistant": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
  "college-management-system": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  "typing-master": "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=800&q=80",
  "blood-bank": "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"
};

for (const [id, url] of Object.entries(images)) {
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?image:\\s*")[^"]*(")`, 'g');
  content = content.replace(regex, `$1${url}$2`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated projects.js with better, more relevant image URLs');
