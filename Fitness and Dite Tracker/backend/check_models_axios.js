const axios = require('axios');

async function checkModels() {
  const API_KEY = "AIzaSyCACsb-72XDC4sJTfbFVsl5kfqFkTD1Kws";
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await axios.get(url);
    console.log("Available Models:", response.data.models.map(m => m.name));
  } catch (err) {
    console.error("Axios Error:", err.response ? err.response.data : err.message);
  }
}

checkModels();
