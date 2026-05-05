require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const API_KEY = "AIzaSyCACsb-72XDC4sJTfbFVsl5kfqFkTD1Kws";
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
     // The SDK usually doesn't have a direct listModels without a model instance or something
     // Actually let's try the direct fetch if needed, but let's try something else first.
     console.log("Trying gemini-1.5-flash with v1...");
     const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
     const result = await model.generateContent("Hi");
     console.log(await result.response.text());
  } catch (err) {
    console.error("List Test Error:", err);
  }
}

listModels();
