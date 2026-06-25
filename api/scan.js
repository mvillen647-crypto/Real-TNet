import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Ondoa "data:image/jpeg;base64," kama ipo kwenye kamba ya picha
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const form = new FormData();
    form.append("api_user", process.env.SIGHTENGINE_USER);
    form.append("api_secret", process.env.SIGHTENGINE_SECRET);
    form.append("models", "genai,nudity-2.1,gore-2.0,faces");
    // Hapa ndipo tunatuma picha kama file (buffer)
    form.append("media", buffer, { filename: 'upload.jpg', contentType: 'image/jpeg' });

    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: form // Hapa FormData itajiweka yenyewe headers sahihi (multipart/form-data)
    });

    const data = await response.json();
    return res.status(200).json({ success: true, ai: data });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
