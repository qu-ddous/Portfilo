const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateHealthInsights(userData, query) {
  try {
    // Using gemini-2.0-flash as it's the premium standard in 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert Fitness & Health AI Coach named "Vitality AI".
      User Context:
      - Name: ${userData.name}
      - Goal: ${userData.fitness_goal}
      - Current Weight: ${userData.current_weight_kg}kg
      - Activity Level: ${userData.activity_level}
      
      User is asking: "${query}"
      
      Provide a professional, motivating, and concise response (max 150 words). 
      Format the response with bullet points if helpful.
      Do not give medical prescriptions, only fitness and diet advice.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error.status === 429) {
       return "I'm a bit overwhelmed with requests right now! Please give me a minute to catch my breath and ask again. Stay strong! 💪";
    }
    return "I'm having a little trouble connecting to my fitness brain. Please try again in a moment! Stay strong!";
  }
}

module.exports = { generateHealthInsights };
