require('dotenv').config();
const { generateHealthInsights } = require('./services/geminiService');

async function testAI() {
  console.log("Testing AI Coach...");
  const dummyUser = {
    name: "Test User",
    fitness_goal: "weight_loss",
    current_weight_kg: 85,
    activity_level: "sedentary"
  };
  
  const response = await generateHealthInsights(dummyUser, "I want to lose 5kg in a month, give me a quick tip.");
  console.log("\nAI Response:\n", response);
}

testAI();
