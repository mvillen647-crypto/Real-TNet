import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Kutumia Environment Variables kutoka Vercel (Salama!)
    const api_user = process.env.SIGHTENGINE_USER;
    const api_secret = process.env.SIGHTENGINE_SECRET;

    // Kuandaa FormData kwa ajili ya Sightengine
    const form = new FormData();
    form.append("api_user", api_user);
    form.append("api_secret", api_secret);
    
    // 🔥 New Models kama ulivyoomba
    form.append("models", "genai,nudity-2.1,gore-2.0,faces");
    form.append("media", image);

    // Kufanya request kwenye Sightengine
    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: form
    });

    const data = await response.json();

    // Kurudisha matokeo kwa Frontend
    return res.status(200).json({
      success: true,
      ai: data
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
