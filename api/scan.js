// scan.js (GitHub Action version)
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

async function run() {
  const imagePath = './uploads/photo.jpg'; // Picha iliyopakiwa
  const form = new FormData();
  
  form.append("api_user", process.env.SIGHTENGINE_USER);
  form.append("api_secret", process.env.SIGHTENGINE_SECRET);
  form.append("media", fs.createReadStream(imagePath));
  form.append("models", "genai,nudity-2.1,gore-2.0,faces");

  const res = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  // Tunahifadhi matokeo kwenye faili la JSON
  fs.writeFileSync('./results/result.json', JSON.stringify(data));
}
run();
